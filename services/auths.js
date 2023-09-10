const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
   
  
 
  const createSendToken = (user) => {
//   const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
  
    // res.cookie('jwt', token, {
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    // });
  
    // Remove password from output
    user.password = undefined;
  
    // res.status(statusCode).json({
    //   status: 'success',
    //   token,
    //   data: {
    //     user
    //   }
    // });
  };
  
  exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
  
    const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    await new Email(newUser, url).sendWelcome();
  
    createSendToken(newUser, 201, req, res);
  });
  
  exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  });