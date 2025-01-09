import React, { useRef, useState, useEffect } from "react";

const MusicPlayer = ({ track, onNext, onPrevious, onClose }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Effect to load and prepare a new track without playing it immediately
  useEffect(() => {
    if (!track?.preview) return; // Exit if no valid preview URL

    const audio = audioRef.current;

    // Reset and prepare the new track
    const prepareAudio = () => {
      audio.pause(); // Ensure the previous track is stopped
      audio.currentTime = 0; // Reset to the start
      audio.src = track.preview; // Set the new track's preview URL
      audio.volume = volume; // Maintain the current volume
    };

    prepareAudio(); // Call the prepare function

    // Cleanup: Stop playback when the component unmounts or track changes
    return () => {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setIsPreviewing(false);
    };
  }, [track, volume]); // Runs when `track` or `volume` changes

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (playing) {
      audio.pause(); // Pause the track
    } else {
      const playPromise = audio.play(); // Start playback
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.error("Play error:", error));
      }
    }
    setPlaying(!playing); // Toggle playing state
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg max-w-md mx-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
        aria-label="Close Player"
      >
        ✖️
      </button>
      {/* Track Information */}
      <div className="flex items-center space-x-4">
        <img
          src={track?.album?.cover || ""}
          alt={track?.title || "Track Cover"}
          className="w-20 h-20 rounded-lg"
        />
        <div>
          <h2 className="text-lg font-semibold">{track?.title || "Unknown Title"}</h2>
          <p className="text-sm text-gray-400">
            {track?.artist?.name || "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-3 h-0">
        <button
          onClick={onPrevious}
          className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 mt-5"
        >
          ⏮️
        </button>
        <button
          onClick={togglePlayPause}
          className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600 mt-5"
        >
          {playing ? "⏸️" : "▶️"}
        </button>
        <button
          onClick={onNext}
          className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 mt-5"
        >
          ⏭️
        </button>
      </div>

      {/* Volume Control */}
      <div className="mt-4">
        <label htmlFor="volume" className="block text-sm">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full mt-1"
        />
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;
