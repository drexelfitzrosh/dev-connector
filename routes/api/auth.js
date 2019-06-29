const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");

//@Route  GET api/auth
//@desc   Test route
//@acess  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@Route  Post api/auth
//@desc   Authenticate user & get token
//@acess  Public
router.post(
  "/",
  [
    check("email", "please include email").isEmail(),
    check("password", "password required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // check if email exist
      let user = await User.findOne({ email });
      if (!user) {
        res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }
      //check if password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }

      //return json webtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
