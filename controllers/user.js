const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.body);

  //check if all details are entered

  if (!email || !username || !password) {
    return res.status(400).json({
      message: "enter all detailsssss",
    });
  }
  const userExists = await User.findOne({ email });

  //check if user already exists
  if (userExists) {
    return res.status(401).json({ message: "User already exists" });
  }

  //hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      //store hash in DB
      const user = await User.create({
        username,
        email,
        password: hash,
      });
      console.log(user);
      //check if user is created
      if (user) {
        return res.status(201).json({
          _id: user.id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
          message: "User Created Succesfully",
        });
      } else
        return res.status(401).json({
          message: "Invalid User Data",
        });
    });
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
      message: "user logged in",
    });
  } else {
    res.status(400).json({
      message: "Invalid User Credentials",
    });
  }
};

module.exports = { registerUser, loginUser };
