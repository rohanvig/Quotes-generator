const express = require('express');
const authRoutes = require('./routes/authRoutes');
const quotesRoutes=require('./routes/quotesRoutes')
const cookieParser = require('cookie-parser');
const{checkUser}=require("./middleware/authMiddleware")
const app = express();
const port=8000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
require("./models/conn");

// routes
app.use('/api',quotesRoutes)
app.get("*",checkUser)//to every get routes
app.get('/', (req, res) => res.render('home'));//for homepage 
app.get('/error',(req,res,next)=>{
    throw Error("invalid bro!!")
})
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use(authRoutes);// middleware for further routing
app.use(function errorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })//error page
  })
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})