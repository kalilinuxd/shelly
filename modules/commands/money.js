module.exports.config = {
	name: "رصيد",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "مرحبا",
	commandCategory: "فلوس", 
	usages: "[Tag]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies, Users }) {
	const { threadID, messageID, senderID, mentions } = event;
	let uid = senderID;
	let name = (await Users.getData(uid)).name;
	let money = (await Currencies.getData(uid)).money;
	if (!money) money = 0;

	if (event.type == "message_reply") {
		uid = event.messageReply.senderID;
	} else if (Object.keys(mentions).length == 1) {
		uid = Object.keys(mentions)[0];
	}

	name = (await Users.getData(uid)).name;
	money = (await Currencies.getData(uid)).money;
	if (!money) money = 0;

	return api.sendMessage(`رصيد ${name} هو  ${money} دولار
	`, threadID, messageID);
}