import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getCurrentUser,
  searchChannels,
  removeVideoFromWatchHistory,
  clearWatchHistory,
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

// ================= REGISTER =================
router.route("/register").post(
  upload.single("avatar"),   // ✅ single file upload
  registerUser
);

// ================= LOGIN =================
router.route("/login").post(loginUser);

// ================= AUTH ROUTES =================
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// ================= FILE UPDATES =================
router.route("/avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

router.route("/cover-image").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);

// ================= PUBLIC / OPTIONAL AUTH =================
router.route("/search").get(optionalAuth, searchChannels);
router.route("/c/:username").get(optionalAuth, getUserChannelProfile);

// ================= WATCH HISTORY =================
router
  .route("/watch-history")
  .get(verifyJWT, getWatchHistory)
  .delete(verifyJWT, clearWatchHistory);

router
  .route("/watch-history/:videoId")
  .delete(verifyJWT, removeVideoFromWatchHistory);

export default router;