const localStradegy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = function(passport){
    passport.use(new localStradegy({ usernameField : 'email'}, (email,password, done)=>{
        User.findOne({email : email})
        .then(user =>{
            if(!user){
                return done(null, false, {message : 'Email not registered'})
            }

            // match password
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if (err) throw err;
                if (isMatch){
                    return done(null, user)
                } else {
                    return done(null, false, {message : 'Password not Correct'})
                }
            })
        })
        .catch(err => console.log(err))
    }));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}



