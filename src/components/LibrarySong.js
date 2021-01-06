import React from "react";
// import { playAudio } from "../util";

const LibrarySong = ({
	song,
	songs,
	setCurrentSong,
	id,
	audioRef,
	isPlaying,
	setSongs,
}) => {
	// Event Handlers
	const songSelectHandler = async () => {
		// const selectedSong = songs.filter((state) => state.id === id);
		// setCurrentSong(selectedSong[0]);
		await setCurrentSong(song);

		// Add active state (shows/highlights the selected song)
		const newSongs = songs.map((song) => {
			if (song.id === id) {
				return {
					...song,
					active: true,
				};
			} else {
				return {
					...song,
					active: false,
				};
			}
		});
		// set the active state
		setSongs(newSongs);

		// check is the song is playing
		// playAudio(isPlaying, audioRef);
		if (isPlaying) audioRef.current.play();
	};
	return (
		<div
			onClick={songSelectHandler}
			className={`library-song ${song.active ? "selected" : ""}`}
		>
			<img src={song.cover} alt={song.name} />
			<div className="song-description">
				<h3>{song.name}</h3>
				<h4>{song.artist}</h4>
			</div>
		</div>
	);
};

export default LibrarySong;
