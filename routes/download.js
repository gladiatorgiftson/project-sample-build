const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bufferify = require('json-bufferify');
const publickey = require('../models/public')
const keys = require('../models/userkeys')
const dataModel = require('../models/data')
const decrypteddataModel = require('../models/decryptedData')


router.get('/',async(req, res)=>{
    let receivedData = []
    let dData = []
    const email = req.cookies.email;
    try {
        receivedData = await dataModel.find({reciever: email});
        if (receivedData != null || receivedData != ""){
            
            decrypt(receivedData,res)
            dData = await decrypteddataModel.find({owner : email})
        } else {
            dData = await decrypteddataModel.find({owner : email})
            
        }
    } catch(error) {
        console.log(error)
    }
    res.render('download/download', {dData : dData})
});


async function decrypt(receivedData,res){
    receivedData.forEach(async(rData) =>{
        const id = rData.id
        const owner = rData.owner
        const reciever = rData.reciever
        const ivHex = rData.ivHex
        const authTag = rData.authTag
        const data = rData.data
        const fileType = rData.fileType
        const fileName = rData.fileName

        const ownerdetails = await keys.findOne({email : reciever})
        const senderdetails = await publickey.findOne({email : owner})
        const ownerprivatekey = ownerdetails.privateKey
        const senderpublickey = senderdetails.publicKey
        const secretKey = crypto.createECDH('secp256k1');
        var buf = Buffer.from(ownerprivatekey, 'base64');
        secretKey.setPrivateKey(buf);
        const sharedKey = secretKey.computeSecret(senderpublickey, 'base64', 'hex');
        const decipher = crypto.createDecipheriv(
              'aes-256-gcm',
              Buffer.from(sharedKey, 'hex'),
              Buffer.from(ivHex, 'hex'))
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(data, 'hex', 'base64');
        decrypted += decipher.final('base64');

        const decData = new decrypteddataModel({
            sender : owner,
            owner : reciever,
            fileType : fileType,
            fileName : fileName,
            data : decrypted
        });
        decData.save()
        .catch((err) => console.log(err));
        dataModel.findByIdAndRemove(id)
        .catch((err) => console.log(err));
    });
    


}

module.exports = router;

