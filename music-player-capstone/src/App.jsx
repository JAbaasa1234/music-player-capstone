import React, { useEffect, useReducer, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Home from "./pages/Home";
import searchTracks from "./services/deezerService";
import MusicPlayer from "./components/MusicPlayer";
import Playlists from "./components/PlayLists";

// Initial state for useReducer
const initialState = {
  tracks: [],
  favorites: [],
  currentTrackIndex: null,
  playlists: [],
  searchHistory: [],
};

// Reducer function to manage state
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TRACKS":
      return { ...state, tracks: action.payload };
    case "ADD_TO_FAVORITES":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.payload.id),
      };
    case "SET_CURRENT_TRACK":
      return { ...state, currentTrackIndex: action.payload };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.payload };
    case "ADD_TO_SEARCH_HISTORY":
      if (state.searchHistory.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory].slice(0, 10),
      };
    case "REMOVE_FROM_SEARCH_HISTORY":
      return {
        ...state,
        searchHistory: state.searchHistory.filter(
          (query) => query !== action.payload
        ),
      }
    default:
      return state;
  }
};

function App() {
  const persistedState = JSON.parse(localStorage.getItem("musicPlayerState"));
  const [state, dispatch] = useReducer(reducer, persistedState || initialState);

  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showMenu, setShowMenu] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  const handleDeleteSearchHistory = (query) => {
    dispatch({ type: "REMOVE_FROM_SEARCH_HISTORY", payload: query});
    showAlert(`"${query}" removed from search history!`);
  };

  // Utility to show alerts
  const showAlert = (message) => alert(message);

  // Handle track search
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchTracks(query);
      dispatch({ type: "SET_TRACKS", payload: data.data });
      dispatch({ type: "ADD_TO_SEARCH_HISTORY", payload: query });
    } catch (error) {
      console.error("Error fetching tracks:", error);
      showAlert("Error fetching tracks!");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding/removing favorites
  const handleFavorite = (track) => {
    const isFavorited = state.favorites.some((fav) => fav.id === track.id);
    dispatch({
      type: isFavorited ? "REMOVE_FROM_FAVORITES" : "ADD_TO_FAVORITES",
      payload: track,
    });
    showAlert(
      `${track.title} ${isFavorited ? "removed from" : "added to"} favorites!`
    );
  };

  // Play a specific track
  const handlePlayTrack = (index) => dispatch({ type: "SET_CURRENT_TRACK", payload: index });

  // Play next/previous track
  const playNextTrack = () => {
    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: (state.currentTrackIndex + 1) % state.tracks.length,
    });
  };

  const playPreviousTrack = () => {
    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length,
    });
  };

  // Handle playlist operations
  const handleCreatePlaylist = (playlistName) => {
    if (!playlistName.trim()) {
      showAlert("Playlist name cannot be empty!");
      return;
    }
    const newPlaylist = { id: Date.now(), name: playlistName, tracks: [] };
    dispatch({ type: "SET_PLAYLISTS", payload: [...state.playlists, newPlaylist] });
    showAlert(`Playlist "${playlistName}" created!`);
  };

  const handleAddToPlaylist = (playlistId, track) => {
    const updatedPlaylists = state.playlists.map((playlist) =>
      playlist.id === playlistId
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    );
    dispatch({ type: "SET_PLAYLISTS", payload: updatedPlaylists });
    showAlert(`"${track.title}" added to the playlist!`);
  };

  const handleDeletePlaylist = (playlistId) => {
    dispatch({
      type: "SET_PLAYLISTS",
      payload: state.playlists.filter((pl) => pl.id !== playlistId),
    });
    showAlert("Playlist deleted!");
  };

  useEffect(() => {
    localStorage.setItem("musicPlayerState", JSON.stringify(state));
  }, [state]);

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {/* Navigation Bar */}
      <header className={`flex justify-between items-center px-4 py-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}  shadow-lg`}>
        <h1 className="text-3xl font-bold text-blue-400">
          Music Player <span>🎵</span>
        </h1>
        <div className="md:hidden">
          {/* Hamburger Menu */}
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={`p-2 w-10 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-400 text-white"}`}
          >
            ☰
          </button>
        </div>
        <nav
          className={`${
            showMenu ? "block" : "hidden"
          } md:flex gap-4 md:bg-transparent md:shadow-none ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <Link to="/" className="block px-4 py-2 hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700">
            Home
          </Link>
          <Link to="/favorites" className="block px-4 py-2 hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700">
            Favorites
          </Link>
          <Link to="/playlists" className="block px-4 py-2 hover:bg-blue-400 md:hover:bg-transparent md:hover:text-blue-700">
            Playlists
          </Link>
        </nav>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-400 text-white"}`}
          >
            {isDarkMode ? "LightMode" : "Dark Mode"}
          </button>
      </header>

      {/* Search History */}
      <div className={`px-4 py-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <h3 className="text-lg font-semibold">Search History</h3>
        <ul className="flex flex-wrap gap-2">
          {state.searchHistory.map((query, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 cursor-pointer ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              } hover:underline`}
            >
              <span onClick={() => handleSearch(query)}>{query}</span>
              <button
                onClick={() => handleDeleteSearchHistory(query)}
                className={`text-sm ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                } hover:underline`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              tracks={state.tracks}
              favorites={state.favorites}
              handleSearch={handleSearch}
              handlePlayTrack={handlePlayTrack}
              handleFavorite={handleFavorite}
              playlists={state.playlists}
              handleAddToPlaylist={handleAddToPlaylist}
              loading={loading}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites
                favorites={state.favorites}
                handlePlayTrack={handlePlayTrack}
                handleFavorite={handleFavorite}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <Playlists
              playlists={state.playlists}
              handleCreatePlaylist={handleCreatePlaylist}
              handleAddToPlaylist={handleAddToPlaylist}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          }
        />
      </Routes>

      {/* Music Player */}
      {state.currentTrackIndex !== null && (
        <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-300"} shadow-lg p-4`}>
          <MusicPlayer
            track={state.tracks[state.currentTrackIndex]}
            onNext={playNextTrack}
            onPrevious={playPreviousTrack}
            onClose={() => dispatch({ type: "SET_CURRENT_TRACK", payload: null })}
          />
        </div>
      )}
    </div>
  );
}

export default App;
