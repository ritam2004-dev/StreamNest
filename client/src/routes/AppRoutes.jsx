import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Watch from "../pages/Watch";
import Upload from "../pages/Upload";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Channel from "../pages/Channel";
import ChannelPlaylist from "../pages/ChannelPlaylist";
import Dashboard from "../pages/Dashboard";
import Playlists from "../pages/Playlists";
import Profile from "../pages/Profile";
import SearchResults from "../pages/SearchResults";
import Tweets from "../pages/Tweets";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/c/:username" element={<Channel />} />
      <Route
        path="/c/:username/playlists/:playlistId"
        element={<ChannelPlaylist />}
      />
      <Route path="/search" element={<SearchResults />} />

      {/* protected routes */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tweets"
        element={
          <ProtectedRoute>
            <Tweets />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
