import React, { useState } from "react";

const TrackCard = ({ track, onPlay, onFavorite, isFavorite, playlists, onAddToPlaylist }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddToPlaylist = (playlistId) => {
    onAddToPlaylist(playlistId, track);
    setShowDropdown(false); // Close dropdown after adding
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
      {/* Album Cover */}
      <img
        src={track.album.cover}
        alt={track.title}
        className="w-32 h-32 rounded-md mb-4"
      />

      {/* Track Title */}
      <h3 className="text-xl text-white font-semibold mb-2">{track.title}</h3>

      {/* Artist Name */}
      <p className="text-gray-400 mb-4">Artist: {track.artist.name}</p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onPlay}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Play Preview
        </button>
        <button
          onClick={onFavorite}
          className={`${
            isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-md transition-all duration-300`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Add to Playlist
          </button>

          {/* Dropdown for Playlists */}
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white text-black p-2 rounded shadow-lg z-10 animate-fade-in-down">
              <ul className="text-sm">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <li
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                    >
                      {playlist.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No playlists available</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
