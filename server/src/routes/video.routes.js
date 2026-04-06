import { Router } from "express"
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";


const router = Router();

// Public routes
router.route("/").get(getAllVideos);
router.route("/:videoId").get(optionalAuth, getVideoById);

// Protected routes (require authentication)
router.post(
    "/",
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);

router.route("/:videoId")
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router