const express = require('express');
const router= express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User');
const passport = require('passport');

//RENDERING LOGIN PAGE
router.get('/login',  (req,res)=>{
     res.render('login')
})
// RENDERING REGISTER PAGE
router.get('/register',(req,res)=>{
    res.render('register')
})
//Handling Register
router.post('/register',async (req,res)=>{
    const {name,email,password,password2}= req.body;
    let errors=[];
    if(!name || !email || !password   || !password2){
        errors.push({
            msg:'Please fill in all the Fields'
        })
    }
    if (password != password2){
        errors.push({msg:'Password donot match'})
    }
     if (password.length <6){
         errors.push({msg:'Password must be atleast 6 characters'})
     }
     if(errors.length >0){
         res.render('register',{
             errors,
             name,
             email,
             password,
             password2
         })
     }
     else{
         let user = await User.findOne({email});
          if (user){
              errors.push({msg:'User already exists'})
              res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            })
          }else{
              const newUser = new User({
                  name,
                  email,
                  password
              })
               const salt = await bcrypt.genSalt(10);
               newUser.password= await bcrypt.hash(password,salt)
            
               await newUser.save();
               req.flash('success_msg','You are now registered and can Now LogIn')
               res.redirect('/users/login')
          }
     }
     
})
// HANDLING LOGIN
 router.post('/login',(req,res,next)=>{
     passport.authenticate('local',{
         successRedirect:'/dashboard',
         failureRedirect:'/users/login',
         failureFlash: true,
     })(req,res,next);
 })

 //RENDERING LOGOUT PAGE
 router.get('/logout',(req,res)=>{
     req.logout();
     req.flash('success_msg','You are Logged Out')
     res.redirect('/users/login');
  
 })

 module.exports= router;