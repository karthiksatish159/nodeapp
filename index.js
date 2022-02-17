const express=require("express");
const bodyparser=require("body-parser");
const passport=require("passport");
const app=express();
const path=require("path");
const strategy=require('passport-facebook').Strategy;
var port=process.env.port||3000;
//strategy is ntg but configutation file
passport.use(new strategy({
    clientID:"993748147911203",
    clientSecret:"03c96e7c1b4bfbcda74608105b7f13a2",
    callbackURL:"https://mynodeface.herokuapp.com/login/facebook/callback/return"
},
(accessToken,refershTokken,profile,cb)=>
{
    return cb(null,profile);
}
))
passport.serializeUser((obj,cb)=>{
    cb(null,obj);

});
passport.deserializeUser((obj,cb)=>
{
    cb(null,obj);
})
//Set view dir
app.set('views',path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
//var morgan = require('morgan')
//app.use(morgan('combined))
//The above two lines and below line is same
app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('express-session')({secret:'ks',resave:true,saveUninitialized:false}));

//@route - Get /
//@desc - a route to home
//@access - PUBLIC
app.get("/",(req,res)=>
{
    res.render("home",{user:req.user})
})
//@route - Get /login
//@desc - a route to login
//@access - PUBLIC
app.get("/login",(req,res)=>{
    res.render("login");
})
//@route - Get /login/facebook
//@desc - a route to facebookAuth
//@access - PUBLIC

app.get("/login/facebook",passport.authenticate('facebook'));

//@route - Get /login/facebook/callback
//@desc - a route to facebookAuth
//@access - PUBLIC
app.get("/login/facebook/callback",passport.authenticate('facebook',{failureRedirect:'/login'}),
    (req,res)=>
    {
        res.redirect('/');
    })
//@route - Get /profile
//@desc - a route to profile of use
//@access - PRIVATE
app.get('/profile',require('connect-ensure-login').ensureLoggedIn(),(req,res)=>
{
    res.render('profile',{user:req.user})
})
app.listen(port,()=>{
    console.log(`Server is running on 3000`);
})



