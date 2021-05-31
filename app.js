if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const registerRouter = require('./routes/register.js')
const dashBoardRouter = require('./routes/dashboard')
const uploadRouter = require('./routes/upload')
const downloadRouter = require('./routes/download')

const app = express();
const mongoose = require('mongoose');

//passport config
require('./config/passport')(passport);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(methodOverride('_method'));

app.use(express.static('public'));
app.use(express.urlencoded({limit : '10mb', extended: false}))
app.use(express.json())

//setting up session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }));

// passport middleware

app.use(passport.initialize());
app.use(passport.session());

//using flash 
app.use(flash());
app.use(cookieParser())
//setting up global variable

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser : true}, {useUnifiedTopology: true});
const db = mongoose.connection

db.on('error', error => console.error(error));
db.on('open', () => console.log('connected to Mongoose'));

app.use('/', indexRouter)
app.use('/login',loginRouter)
app.use('/home', homeRouter)
app.use('/register', registerRouter)
app.use('/dashboard', dashBoardRouter)
app.use('/upload', uploadRouter)
app.use('/download', downloadRouter)

app.listen(process.env.PORT || 3000);

