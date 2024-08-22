const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message); // message will console
  let errors = { email: '', password: '' };
  

//incorrect email
if(err.message === 'incorrect email') {
 errors.email="the email is not registered";
}
if(err.message === 'incorrect password') {
  errors.password="the password is incorrect";
  
 }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => { // err destructed part(properties)
      errors[properties.path] = properties.message; 
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions


module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.reset_get=(req,res)=>{
  res.render('reset');
}
module.exports.signup_post = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const user = await User.create({ fullname, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
try{
  const user=await User.login(email,password);
  const token = createToken(user._id);
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge *1000});
  res.status(200).json({user:user._id})
}
catch(err){
const errors=handleErrors(err);
res.status(400).json({errors});
}
}

// logout (a blank cookie replace with minimum time )
module.exports.logout_get=(req,res)=>{
  res.cookie('jwt',"",{maxAge:1});
  res.redirect('/');
}


module.exports.reset_post= async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).send('User not found');
      }

      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 3600000; // 1 hour

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await user.save();

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'rohanvig777@gmail.com',
              pass: 'awiw vzgx vdzl eunf'
          }
      });

      const mailOptions = {
          to: user.email,
          from: 'rohanvig777@gmail.com',
          subject: 'Password Reset',
          text: `Click the following link to reset your password: 
          http://${req.headers.host}/reset/${token}`
      };

      transporter.sendMail(mailOptions, (err) => {
          if (err) {
              return res.status(500).send('Error sending email');
          }
          res.status(200).send('Email sent');
      });
  } catch (error) {
      res.status(500).send('Internal server error');
  }
}

module.exports.reset_post_token= async (req, res) => {
  try {
      const { token } = req.params;
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).send('Password reset token is invalid or has expired.');
      }

      res.send(`<form action="/reset/${token}" method="POST">
                  <input type="password" name="password" placeholder="Enter new password" required/>
                  <input type="submit" value="Reset Password"/>
                </form>`);
  } catch (error) {
      res.status(500).send('Internal server error');
  }
}

module.exports.getlink=(req,res)=>{
  res.render('emailreset');
}