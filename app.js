const express=require('express');
const path=require('path');
const app=express();
const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

//Passport config
require('./config/passport')(passport);

//DB config
const db=require('./config/keys').MongoURI;
//console.log(db);

//connect to db
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology: true })
	.then(()=>console.log('MongoDB Connected...'))
	.catch(err=>console.log(err))

//Middleware
app.use(expressLayout);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Express session
app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized:true,

}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect falsh
app.use(flash());

//Global vars
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	next();
})


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.use(express.static(path.join(__dirname,'public')));
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{console.log(`Listening on port ${PORT}`)});