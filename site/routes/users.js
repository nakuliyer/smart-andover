const router = require('express').Router();
let User = require('../models/user.model');
const auth = require('../authentication/auth')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.route('/register').post(async (req, res) => {
  // check if email already exists
  const emailExists = await User.findOne({
    email: req.body.email
  })
  if (emailExists) {
    return res.status(400).json('There is already an account with that email! Try logging in instead.')
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email
  })

  // hash and salt password
  // (see https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb
  // and https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/)
  newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);

  newUser.save()
    .then((user) => {
      const token = jwt.sign({ _id: user._id, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.TOKEN_SECRET);
      res.header('auth-token', token).json('User added!')
    })
    .catch(err => res.status(400).json('Error: ' + err))
})



router.route('/login').post(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })

  // check if email doesn't exist
  if (!user) {
    return res.status(400).json('Error: Email or password incorrect.');
  }

  // check if password matches
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) {
    return res.status(400).json('Error: Email or password incorrect.');
  }

  // create jwt
  const token = jwt.sign({ _id: user._id, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).json();
})



router.get('/current', auth, async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id
  })

  res.json({
    _id: user._id,
    username: user.username,
    // any other important data can be sent HERE
  })
})



// admin token-based login
router.route('/admin/login').post(async (req, res) => {
  if (req.body.token !== process.env.BACKEND_TOKEN) {
    return res.status(400).json('Error: Invalid token.')
  }
  const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.BACKEND_SECRET);
  res.header('auth-token', token).json('Authorized.');
})

// TODO: Add delete user, update user (i.e. update password), etc

module.exports = router;
