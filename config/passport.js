const LocalStratergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 const User = require('../models/User');
 

 module.exports = async (passport)=>{
  passport.use(new LocalStratergy({usernameField:'email',},async(email,password,done)=>{
      //MATCH USERS
     const user = await User.findOne({email});
      if(!user){
          return done(null,false,{message:'The Email is not Registered'})
      }
      //MATCH PASSWORD
      const isMatch=  await bcrypt.compare(password,user.password);
      if(!isMatch){
           return done(null,false,{message:'Password Incorrect'})
      }else{
          return done(null,user)
      }
  }))
  passport.serializeUser((user, done) =>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  });
 }

