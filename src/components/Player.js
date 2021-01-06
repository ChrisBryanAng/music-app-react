import React from "react";
// adding '{}' after import means importing a specific thing rather than importing the whole package
// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// icons
import {
	faPlay,
	faAngleLeft,
	faAngleRight,
	faPause,
} from "@fortawesome/free-solid-svg-icons";

// import { playAudio } from "../util";

const Player = ({
	audioRef,
	currentSong,
	isPlaying,
	setIsPlaying,
	songInfo,
	setSongInfo,
	songs,
	setCurrentSong,
	setSongs,
}) => {
	// not optimal for states (like currentSong) that changes it state multiple times
	// UseEffect to show/highlight the song when skipped forward or back
	// useEffect(() => {
	// 	// Add active state (shows/highlights the selected song)
	// 	const newSongs = songs.map((song) => {
	// 		if (song.id === currentSong.id) {
	// 			return {
	// 				...song,
	// 				active: true,
	// 			};
	// 		} else {
	// 			return {
	// 				...song,
	// 				active: false,
	// 			};
	// 		}
	// 	});
	// 	// set the active state
	// 	setSongs(newSongs);
	// 	// run this function whenever [currentSong] gets updated... syntax below (line 44)
	// }, [currentSong]);

	// use a function like this instead of a use effect to avoid malfunctions
	const activeLibraryHandler = (nextOrPrevious) => {
		// Add active state (shows/highlights the selected song)
		const newSongs = songs.map((song) => {
			if (song.id === nextOrPrevious.id) {
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
	};

	// Event Handlers
	// Handles to play or pause the current song
	const playSongHandler = () => {
		// if the song is playing, pause it, otherwise, play again
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying);
		} else {
			audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	};

	// Handles the start and over all duraion of the song
	// The time updates as the song is playing
	const getTime = (time) => {
		return (
			Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
		);
	};
	// Handles the duration bar... make it so you can skip or choose a specific part of the song
	const dragHandler = (e) => {
		audioRef.current.currentTime = e.target.value;
		setSongInfo({ ...songInfo, currentTime: e.target.value });
	};
	// Handles the skip back or skip back buttons
	const skipTrackHandler = async (direction) => {
		// find the current index of the song
		let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

		// check if song is still inbounds of the song list, if not, loop back to the first song
		if (direction === "skip-forward") {
			await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
			activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
		}

		if (direction === "skip-back") {
			// check if song is the first and if true, skip-back to the very last song
			if ((currentIndex - 1) % songs.length === -1) {
				await setCurrentSong(songs[songs.length - 1]);
				activeLibraryHandler(songs[songs.length - 1]);
				// check is the song is playing
				// playAudio(isPlaying, audioRef);
				if (isPlaying) audioRef.current.play();
				return;
			}
			await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
			activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
		}

		// check is the song is playing
		// playAudio(isPlaying, audioRef);
		if (isPlaying) audioRef.current.play();
	};
	// Add the styles (for input bar customizations)
	const trackAnim = {
		transform: `translateX(${songInfo.animationPercentage}%)`,
	};

	return (
		<div className="player">
			<div className="time-control">
				<p>{getTime(songInfo.currentTime)}</p>
				<div
					style={{
						background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
					}}
					className="track"
				>
					<input
						min={0}
						max={songInfo.duration || 0}
						value={songInfo.currentTime}
						onChange={dragHandler}
						type="range"
					/>
					<div style={trackAnim} className="animate-track"></div>
				</div>
				<p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
			</div>
			<div className="play-control">
				<FontAwesomeIcon
					onClick={() => skipTrackHandler("skip-back")}
					className="skip-back"
					size="2x"
					icon={faAngleLeft}
				/>
				<FontAwesomeIcon
					onClick={playSongHandler}
					className="play"
					size="2x"
					icon={isPlaying ? faPause : faPlay}
				/>
				<FontAwesomeIcon
					className="skip-forward"
					size="2x"
					icon={faAngleRight}
					onClick={() => skipTrackHandler("skip-forward")}
				/>
			</div>
		</div>
	);
};

export default Player;
