import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";

function Home({
    tracks,
    playlists,
    favorites,
    handleSearch,
    handlePlayTrack,
    handleFavorite,
    handleAddToPlaylist,
  }) {
    return (
      <div className="p-4 min-h-screen">
        <header className="text-center py-8">
          <h1 className="text-5xl font-extrabold tracking-wide">
            Music Player <span className="text-blue-400">🎵</span>
          </h1>
        </header>
  
        <div className="w-full flex justify-center mb-8 px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
  
        <main className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={() => handlePlayTrack(index)}
                onFavorite={() => handleFavorite(track)}
                isFavorite={favorites.some((fav) => fav.id === track.id)}
                playlists={playlists}
                onAddToPlaylist={handleAddToPlaylist}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">
              Search for tracks to get started!
            </p>
          )}
        </main>
      </div>
    );
  }
  
  export default Home;
  