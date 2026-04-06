import User from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({
        message: "Avatar image is required",
      });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      return res.status(500).json({
        message: "Avatar upload failed",
      });
    }

    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar.secure_url,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: createdUser,
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      message: "User registration failed",
      error: error.message,
    });
  }
};


// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};


// ================= FIXED CURRENT USER =================
export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user, // 🔥 VERY IMPORTANT
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch current user",
    });
  }
};


// ================= OTHER ROUTES =================
export const logoutUser = (req, res) =>
  res.json({ message: "logout working" });

export const refreshAccessToken = (req, res) =>
  res.json({ message: "refresh working" });

export const changeCurrentPassword = (req, res) =>
  res.json({ message: "change password working" });

export const updateAccountDetails = (req, res) =>
  res.json({ message: "update account working" });

export const updateUserAvatar = (req, res) =>
  res.json({ message: "update avatar working" });

export const updateUserCoverImage = (req, res) =>
  res.json({ message: "update cover working" });

export const getUserChannelProfile = (req, res) =>
  res.json({ message: "channel profile working" });

export const getWatchHistory = (req, res) =>
  res.json({ message: "watch history working" });

export const searchChannels = (req, res) =>
  res.json({ message: "search working" });

export const removeVideoFromWatchHistory = (req, res) =>
  res.json({ message: "remove video working" });

export const clearWatchHistory = (req, res) =>
  res.json({ message: "clear history working" });