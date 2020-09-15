const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport)
   //DB CONFIG
 const db =require('./config/db').MongoURI;
 // MONGODB CONNECTION
 mongoose.connect(db,{useNewUrlParser:true ,useUnifiedTopology: true})
 .then(()=>console.log('MongoDb Connected'))
 .catch(err=>console.log(err))
 const app = express();
 //EJS
  app.use(expressLayouts);
   app.set('view engine','ejs');
   //BODY PARSER
    app.use(express.urlencoded({extended:false}))
    //Express session middleware
    app.use(
      session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      })
    );
    // Passport middleware
app.use(passport.initialize());
app.use(passport.session());
    // Connect flash
     app.use(flash());
     // Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

  app.use('/', require('./routes/index'))
  app.use('/users', require('./routes/users'))

  const PORT = process.env.PORT||5000;
  app.listen(PORT,()=>console.log(`Server started at ${PORT}`))