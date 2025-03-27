import Router from "express";
import bcrypt from "bcrypt";
import User from "../schema/user.js";
import jwt from "jsonwebtoken";

const router = Router();

function getNewJWTToken(userId) {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

function getPasswordErrors(password) {
  // Is required
  if (!password) {
    return { error: "Password is required" };
  }

  // Should be a string
  if (typeof password !== "string") {
    return { error: "Password must be a string" };
  }

  // Should be of min len 5
  if (password.length < 5) {
    return { error: "Password must be at least 5 characters long" };
  }

  // Should have atleast 1 digit
  const hasNumber = /\d/.test(password);
  if (!hasNumber) {
    return {
      error: "Password must contain at least one number",
    };
  }

  // Should have atleast 1 alphabet
  const hasAlphabet = /[a-zA-Z]/.test(password);
  if (!hasAlphabet) {
    return {
      error: "Password must contain at least one alphabet",
    };
  }

  // No error
  return {};
}

router.post("/register", async (req, res) => {
  // Check if user already exists
  const usernameExists = await User.countDocuments({
    username: req.body.username,
  });
  if (usernameExists > 0) {
    return res.status(400).json({ username: "Username already taken" });
  }

  // Validate password
  const passwordErrors = getPasswordErrors(req.body.password);
  if (passwordErrors.error) {
    return res.status(400).json({ password: passwordErrors.error });
  }

  // Store details in DB
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  await user.save();

  return res.json({
    message: "User registered",
    token: getNewJWTToken(user._id),
  });
});

router.post("/login", async (req, res) => {
  // Validating password using predefined nomenclature to reduce load on DB. This is something that needs to be decided based on business use-case
  const passwordErrors = getPasswordErrors(req.body.password);
  if (passwordErrors.error) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if user exists
  const usernameExists = await User.countDocuments({
    username: req.body.username,
  });
  if (usernameExists === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if password is correct
  const user = await User.findOne({ username: req.body.username });
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!user || !isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return res.json({ token: getNewJWTToken(user._id) });
});

export default router;
