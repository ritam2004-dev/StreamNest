import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ================= CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔍 DEBUG CHECK
console.log("🔍 CLOUDINARY ENV CHECK:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET);

// ================= UPLOAD =================
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("❌ No file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image", // 🔥 FIXED (important)
    });

    console.log("✅ Upload success:", response.secure_url);

    // delete local file after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    // delete file if exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

// ================= DELETE =================
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.log("❌ No publicId provided");
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("🗑️ Deleted from Cloudinary:", result);

    return result;
  } catch (error) {
    console.error("❌ Cloudinary Delete Error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };