const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const User = require("../models/user");
const UserKey = require("../models/userkeys")
const Userpublic = require("../models/public")

router.get("/", (req, res) => {
  res.render("register/register");
});

router.post("/", (req, res) => {
  const { name, email, password1, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password1 || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password1 != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password1.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register/register", {
      errors,
      name,
      email,
      password1,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register/register", {
          errors,
          name,
          email,
          password1,
          password2,
        });
      } else {
        const newUser = new User({
          name : name,
          email : email,
          password : password1,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
               genkeys(user)
                req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

function genkeys(user){
  const key = crypto.createECDH('secp256k1');
  key.generateKeys();
  const userpublickey = key.getPublicKey().toString('base64');
  const userprivatekey = key.getPrivateKey().toString('base64');
  const newUserKey = new UserKey({
    email : user.email,
    privateKey : userprivatekey,
    publicKey : userpublickey
  });
  console.log(newUserKey)

  newUserKey.save()
  .then((userkey) => {
    console.log('userkey')
   })
   .catch((err) => console.log(err));

   const userdetails = new Userpublic({
    email : user.email,
    publicKey : userpublickey
   }); 

   userdetails.save()
  .then((userpubkey) => {
    console.log('userkey')
   })
   .catch((err) => console.log(err));
  }

module.exports = router;

