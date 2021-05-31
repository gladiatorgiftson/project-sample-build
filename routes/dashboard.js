const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth')

router.get('/',ensureAuthenticated, (req, res)=>{
    res.cookie('email', req.user.email)
    res.render('dashboard/dashboard', {name : req.user.name})
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'you logged out sucessfully')
    res.redirect('/login');
})
module.exports = router;