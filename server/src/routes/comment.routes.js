import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:videoId")
  .get(getVideoComments)
  .post((req, _, next) => {
    req.body.videoId = req.params.videoId;
    next();
  }, addComment);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
