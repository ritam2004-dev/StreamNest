import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import { uploadVideo } from "../api/video.api";

export default function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoFile) {
      setError("Title and video file are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      formData.append("isPublished", isPublished);

      await uploadVideo(formData);

      // reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      setIsPublished(true);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">
          Upload Video
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2"
              placeholder="Video title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2"
              placeholder="Video description"
            />
          </div>

          {/* Video file */}
          <div>
            <label className="block text-sm mb-1">
              Video file
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFile(e.target.files[0])
              }
              className="text-sm"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm mb-1">
              Thumbnail (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbnail(e.target.files[0])
              }
              className="text-sm"
            />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) =>
                setIsPublished(e.target.checked)
              }
            />
            <span className="text-sm">
              Publish immediately
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-lg
              bg-orange-500 hover:bg-orange-400
              text-black font-medium
              disabled:opacity-60
            "
          >
            {loading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
