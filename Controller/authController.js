const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register User
exports.register = async (req, res) => {
  const { firstName, lastName, username, password, mobileNo, email, address } =
    req.body;

  // Validate fields
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  if (!emailRegex.test(email))
    return res.status(400).send({ message: "Invalid email format" });
  if (!mobileRegex.test(mobileNo))
    return res.status(400).send({ message: "Invalid mobile number" });

  try {
    // Check if user already exists (by email or mobile number)
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNo }] });
    if (existingUser) {
      return res.status(400).send({
        message: "User with this email or mobile number already exists",
      });
    }

    // Create a new user with hashed password
    const userSchema = new User({
      firstName,
      lastName,
      username,
      password,
      mobileNo,
      email,
      address,
    });

    // Save the user to the database
    await userSchema.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error registering user", error: err.message });
  }
};
// Login User
exports.login = async (req, res) => {
  const { email, mobileNo, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { mobileNo: mobileNo }],
    });
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).send({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send({ message: "Error logging in", error: err.message });
  }
};

// Get My User Details
exports.getMyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error fetching user details", error: err.message });
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error searching users", error: err.message });
  }
};
