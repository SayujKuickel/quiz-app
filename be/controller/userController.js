const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../model/ProfileModel");

// Create a new user and automatically create a profile
async function createUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    await Profile.create({
      user: user._id,
      bio: "",
      profilePicture: "",
      skills: [],
      github: "",
      linkedin: "",
      portfolioUrl: "",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Login handler
async function loginHandleController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.AUTH_SECRET_KEY)
      throw new Error("AUTH_SECRET_KEY not defined");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ message: "Login successful", accessToken: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get list of users (without passwords)
async function getUserListController(req, res) {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ message: "User list fetched", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update logged-in user's profile
async function updateProfileMeController(req, res) {
  try {
    const { id } = req.user;
    const { bio, profilePicture, skills, github, linkedin, portfolioUrl } =
      req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: id },
      {
        bio: bio ?? "",
        profilePicture: profilePicture ?? "",
        skills: skills ?? [],
        github: github ?? "",
        linkedin: linkedin ?? "",
        portfolioUrl: portfolioUrl ?? "",
      },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// View logged-in user's profile
async function viewMyProfileController(req, res) {
  try {
    const { id } = req.user;
    const profile = await Profile.findOne({ user: id }).populate(
      "user",
      "name email role"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error viewing profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// View another user's profile by ID
async function viewProfileofUserController(req, res) {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ user: id }).populate(
      "user",
      "name email role"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error viewing user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createUserController,
  loginHandleController,
  getUserListController,
  updateProfileMeController,
  viewMyProfileController,
  viewProfileofUserController,
};
