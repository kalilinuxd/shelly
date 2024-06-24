const axios = require('axios');
const fs = require('fs');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyBFNMIC7pTPGo2zBxE8JrF0oPpOpxV6KU8');

module.exports.config = {
	name: "راندم",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Replit AI",
	description: "Sends a random video with sound from the top 10 'Neymar edit' search results on YouTube",
	commandCategory: "media",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  var additionalSongs = [
      "PlayaPhonk - PHONKY TOWN",
      "DJ Smokey - Cursed",
      "Ghostface Playa - Why Not",
      "LXST CXNTURY - NEON BLADE",
      "Kaito Shoma - Tokyo Drift (Phonk Remix)",
      "DJ YUNG VAMP - Bando",
      "Phonk Killer - Jack Daniels",
      "Ryan Celsius - Death Mode",
      "Sadfriendd - Suicideyear",
      "Soudiere - Sippin’ Codeine",
      "TrillPhonk - Memphis 66.6",
      "YUNG LIXO - MARY JANE",
      "VZVRI - Nocturne",
      "xaxanity - Dark Paradise",
      "Zomow - House of Memories (Phonk Remix)"
  ];

;
  var song = additionalSongs[Math.floor(Math.random() * additionalSongs.length)];

  const keyword = song;
	const limit = 1; // Get top 10 search results
	try {
		const results = await youtube.searchVideos(keyword, limit);
		// Choose a random video from the top 10 results
		const randomIndex = Math.floor(Math.random() * results.length);
		const videoID = results[randomIndex].id;
		const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
		// Using 'highestaudio' and 'mp4' format to keep the sound
		const streamOptions = { quality: 'highestaudio', filter: 'audioonly' };
		const stream = ytdl(videoURL, streamOptions);
		const tempPath = `temp/temp-${videoID}.mp3`;
		stream.pipe(fs.createWriteStream(tempPath));
		stream.on('end', () => {
			api.sendMessage({
				body: `اغنية: ${results[randomIndex].title}`,
				attachment: fs.createReadStream(tempPath)
			}, event.threadID, () => {
				fs.unlinkSync(tempPath); // Delete the temp file after sending the video with sound
			}, event.messageID);
		});
	} catch (err) {
		api.sendMessage("An error occurred while fetching the video.", event.threadID, event.messageID);
		console.error(err);
	}
};