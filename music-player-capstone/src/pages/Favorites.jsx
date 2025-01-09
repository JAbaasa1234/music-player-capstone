import React, { useState } from "react";
import TrackCard from "../components/TrackCard";
import MusicPlayer from "../components/MusicPlayer";

function Favorites({ favorites, tracks = [], handlePlayTrack, handleFavorite, playlists, handleAddToPlaylist }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handlePlayTrackPreview = (track) => {
    setSelectedTrack(track);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-5xl font-extrabold tracking-wide text-blue-400">
          Your Favorites
        </h1>
      </header>

      {/* Favorite Tracks */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
        {favorites.length > 0 ? (
          favorites.map((track) => {
            const trackIndex = tracks.findIndex((t) => t.id === track.id); // Find index in the tracks array
            return (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={() => handlePlayTrackPreview(track)}
                onFavorite={() => handleFavorite(track)}
                isFavorite={true}
                playlists={playlists}
                onAddToPlaylist={handleAddToPlaylist}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-400">No favorites yet!</p>
        )}  
      </section>

      {selectedTrack && (
        <MusicPlayer
          track={selectedTrack}
          onNext={() => {}}
          onPrevious={() => {}}
          onClose={() => setSelectedTrack(null)}
        />
      )}
    </div>
  );  
}

export default Favorites;
