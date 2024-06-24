module.exports.config = {
	name: "اضف",
	version: "2.4.3",
	hasPermssion: 0,
	credits: "Gry凧",
	description: "اضافة مستخدم للمجموعة",
	commandCategory: "group",
	usages: "[args]",
	cooldowns: 5
};

async function getUID(url, api) {

	if (url.includes("facebook.com") || url.includes("fb.com")) {
		try {
			if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
				url = "https://" + url;
			}
			let data = await api.httpGet(url);
			let regex = /for \(;;\);{"redirect":"(.*?)"}/.exec(data);
			if (data.includes("for (;;);{\"redirect\":\"")) {
				data = await api.httpGet(regex[1].replace(/\\/g, '').replace(/(?<=\?\s*)(.*)/, '').slice(0, -1));
			}
			let regexid = /"userID":"(\d+)"/.exec(data);
			let name = JSON.parse("{\"name\": \"" + data.match(/"title":"(.*?)"/s)[1] + "\"}").name || null;
			return [+regexid[1], name, false];
		} catch {
			return [null, null, true];
		}
	} else {
		return ["err", null, true];
	}
	
}

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const botID = api.getCurrentUserID();
	const out = msg => api.sendMessage(msg, threadID, messageID);
	var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
	var participantIDs = participantIDs.map(e => parseInt(e));
	if (!args[0]) return out("من فضلك قم باضافة ID او رابط الشخص المراد اضافته.");
	if (!isNaN(args[0])) return adduser(args[0], undefined);
	else {
		try {
			var [id, name, fail] = await getUID(args[0], api);
			if (fail == true && id != null) return out(id);
			else if (fail == true && id == null) return out("لم يتم ايجاد.")
			else {
				await adduser(id, name || "Facebook user");
			}
		} catch (e) {
			return out(`${e.name}: ${e.message}.`);
		}
	}

	async function adduser(id, name) {
		id = parseInt(id);
		if (participantIDs.includes(id)) return out(`${name ? name : "Member"} موجود في المجموعة بالفعل.`);
		else {
			var admins = adminIDs.map(e => parseInt(e.id));
			try {
				await api.addUserToGroup(id, threadID);
			}
			catch {
				return out(`لا يمكن اضافة ${name ? name : "user"} الى المجموعة.`);
			}
			if (approvalMode === true && !admins.includes(botID)) return out(`تمت اضافة ${name ? name : "member"} الى طلبات العضوية !`);
			else return out(`تمت اضافة ${name ? name : "member"} الى المجموعة !`)
		}
	}
    }