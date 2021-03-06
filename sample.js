router.get('/',async(req, res)=>{
    let receivedData = []
    const email = req.cookies.email;
    console.log(email)
    try {
        receivedData = await dataModel.find({reciever: email},{_id:0});
        const ownerdetails = await keys.findOne({email : reciever})
        const senderdetails = await publickey.findOne({email : owner})
        const ownerprivatekey =  ownerdetails.privateKey
        const senderpublickey = senderdetails.publicKey
    } catch(error) {
        console.log(error)
    }
    decrypt(receivedData,ownerprivatekey,senderpublickey,res)
   
});


function decrypt(receivedData,ownerprivatekey,senderpublickey,res){
    dData = []
    receivedData.forEach((rData) =>{
        const owner = rData.owner
        const reciever = rData.reciever
        const ivHex = rData.ivHex
        const authTag = rData.authTag
        const data = rData.data
        const fileType = rData.fileType
        const fileName = rData.fileName

        const ownerdetails = keys.findOne({email : reciever})
        const senderdetails = publickey.findOne({email : owner})
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
        rData.data = decrypted
    });

    


}