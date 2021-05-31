const express = require('express');
const router = express.Router();
const publicKey = require('../models/public')
const crypto = require('crypto')
const keys = require('../models/userkeys')
const publickey = require('../models/public')
const dataModel = require('../models/data')
const {ensureAuthenticated} = require('../config/auth')

router.get('/', ensureAuthenticated,async(req, res)=>{
    const publickey = await publicKey.find({});
    res.render('upload/upload', {publickey : publickey})
});

router.post('/', async(req,res)=>{
    savedata(req)
    res.redirect("/dashboard");
})

async function savedata (req){
    const receiver = req.body.Reciever
    const coverenc = JSON.parse(req.body.cover)
    const data = coverenc.data
    const name = coverenc.name
    const type = coverenc.type
    const ownerEmail = req.cookies.email
    const ownerdetails = await keys.findOne({email : ownerEmail})
    const receiverdetails = await publickey.findOne({email : receiver})
    const receiverEmail = receiverdetails.email
    const ownerprivatekey = ownerdetails.privateKey
    const recieverpublickey = receiverdetails.publicKey
    const secretKey = crypto.createECDH('secp256k1');
    var buf = Buffer.from(ownerprivatekey, 'base64');
    secretKey.setPrivateKey(buf);
    const sharedKey = secretKey.computeSecret(recieverpublickey, 'base64', 'hex'); 
    const message = data
    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(sharedKey, 'hex'),
        IV
      );
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const auth_tag = cipher.getAuthTag().toString('hex');
    const ivHex = IV.toString('hex');
    
    const encData = new dataModel({
        owner : ownerEmail,
        reciever : receiverEmail,
        ivHex : ivHex,
        authTag : auth_tag,
        data : encrypted,
        fileType : type,
        fileName : name

    });
    encData.save()
    .then((savedData) => { 
        req.flash(
        "success_msg",
        "Data has been updated sucessfully"
        );
        
    })
    .catch((err) => console.log(err));

}

module.exports = router;
