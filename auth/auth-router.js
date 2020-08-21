const router = require('express').Router();
const bcrypt = require('bcryptjs')
const authModel = require('./auth-model')
const jwt = require("jsonwebtoken");
const constants = require("../config/constants.js");


//constants
function isValid(user) {
  return Boolean(user.username && user.password && typeof user.password === "string");
}

//Registeration
// router.post('/register', async (req, res, next) => {
//   try{
//     const user = req.body
//     res.status(201).json(await authModel.add(user))
//   } catch(err){
//     next(err)
//   }
// });
router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;

      // hash the password
      const hash = bcrypt.hashSync(credentials.password, rounds);

      credentials.password = hash;

      // save the user to the database
      authModel.add(credentials)
          .then(user => {
              res.status(201).json({ data: user });
          })
          .catch(error => {
              res.status(500).json({ message: error.message });
          });
  } else {
      res.status(400).json({
          message:
              "please provide username and password and the password shoud be alphanumeric",
      });
  }
});


//Login
router.post('/login', (req, res) => {
  const {username, password} = req.body;

  if(isValid(req.body)) {
    authModel.findBy({ username: username})
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user)

        res.status(200).json({
          message: 'welcome to the api',
          token,
        });
      } else {
        res.status(401).json({ message: 'invalid credentials'})
      }
    })
    .catch(err => {
      res.status(500).json({message: err.message})
    })
  } else {
    res.status(400).json({
      message: 'please provide username and password and the password shoud be alphanumeric'
    });
  }
});

function signToken(user) {
  const payload = {
      subject: user.id,
      username: user.username,
  };

  const secret = constants.jwtSecret;

  const options = {
      expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}


module.exports = router;