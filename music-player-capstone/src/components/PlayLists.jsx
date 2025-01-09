import React, { useState, useEffect } from "react";

const Playlists = ({
  playlists = [],
  handleCreatePlaylist,
  handleAddToPlaylist,
  handleDeletePlaylist,
  handlePlayPlaylistTrack,
  tracks,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Update selectedPlaylist when playlists change
  useEffect(() => {
    if (selectedPlaylist) {
      const updatedPlaylist = playlists.find((p) => p.id === selectedPlaylist.id);
      setSelectedPlaylist(updatedPlaylist || null);
    }
  }, [playlists, selectedPlaylist]);

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>

      {/* Create Playlist Form */}
      <div className="mb-4">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          className="p-2 border rounded text-black"
        />
        <button
          onClick={() => {
            handleCreatePlaylist(newPlaylistName);
            setNewPlaylistName("");
          }}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Create Playlist
        </button>
      </div>

      {/* Playlist List */}
      <ul className="mb-4">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="p-2 cursor-pointer hover:bg-blue-400 flex justify-between items-center"
            >
              <span onClick={() => setSelectedPlaylist(playlist)}>
                {playlist.name}
              </span>
              <button
                onClick={() => handleDeletePlaylist(playlist.id)}
                className="p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No playlists available. Create one to get started!</p>
        )}
      </ul>

      {/* Selected Playlist */}
      {selectedPlaylist && (
        <div>
          <h2 className="text-xl font-bold">{selectedPlaylist.name}</h2>
          <ul className="mb-4">
            {selectedPlaylist.tracks && selectedPlaylist.tracks.length > 0 ? (
              selectedPlaylist.tracks.map((track) => (
                <li
                  key={track.id}
                  className="flex justify-between p-2 border-b cursor-pointer hover:bg-gray-200"
                >
                  <span>{track.title}</span>
                  <button
                    onClick={() => handlePlayPlaylistTrack(track)}
                    className="p-1 bg-blue-500 text-white rounded"
                  >
                    Play
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No tracks in this playlist.</p>
            )}
          </ul>

          {/* Add Tracks to Playlist */}
          <h3 className="text-lg font-bold">Add Tracks</h3>
          <ul>
            {tracks.map((track) => (
              <li key={track.id} className="flex justify-between p-2">
                <span>{track.title}</span>
                <button
                  onClick={() => handleAddToPlaylist(selectedPlaylist.id, track)}
                  className="p-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Playlists;
