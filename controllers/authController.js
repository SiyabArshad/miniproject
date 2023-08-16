const User = require("../models/User");
const bcrypt = require("bcrypt");
const ResponseManager = require("../helpers/CustomError");
const jwt = require("jsonwebtoken");
const { mailusers } = require("../helpers/mailusers");

//signup function
const signupFunction = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(403)
        .json(ResponseManager.errorResponse("Some feilds are missing", 403));
    } else {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          friends: [],
        });

        await newUser.save();

        return res
          .status(200)
          .json(ResponseManager.successResponse({}, "Registered sucessfully"));
      }
      return res
        .status(409)
        .json(
          ResponseManager.errorResponse(
            "User with this email already exists",
            409
          )
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(ResponseManager.errorResponse(error?.message, 500));
  }
};

//login function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(403)
        .json(ResponseManager.errorResponse("Some feilds are missing", 403));
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json(ResponseManager.errorResponse("Invalid credentials", 401));
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json(ResponseManager.errorResponse("Invalid credentials", 401));
      }
      await mailusers(email, "Login", "you have logged in to min project");
      const token = jwt.sign({ userId: user._id }, process.env.SECKEY, {
        expiresIn: "1d",
      });
      setCookieFunction(res, token, 86400000); //cookie will expire in 1 day or 24 hours
      return res
        .status(200)
        .json(ResponseManager.successResponse({ token }, "Login successful"));
    }
  } catch (error) {
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//function to set cookie
const setCookieFunction = (res, token, expiry = 3600000) => {
  res.cookie("miniproject", token, { maxAge: expiry, httpOnly: true });
};

//logout user function
async function logoutUser(req, res) {
  try {
    res.cookie("miniproject", "", { expires: new Date(0), httpOnly: true });
    res.json(ResponseManager.successResponse({}, "Logout successful"));
  } catch (error) {
    console.error("Error during user logout:", error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
}

module.exports = {
  signupFunction,
  loginUser,
  logoutUser,
};
