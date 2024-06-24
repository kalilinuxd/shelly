module.exports.config = {
    name: "بان",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐊𝐈𝐓𝐄 凧",
    description: "restriction",
    commandCategory: "group",
    usages: `ban user\n\nHow to use?\n${global.config.PREFIX}ban <UID @tag>\n\nExample:\n${global.config.PREFIX}ban (uid)\n${global.config.PREFIX}ban @name\n`,
    cooldowns: 5
};

module.exports.languages = {
    "en": {
        "reason": "السبب",
        "at": "في",
        "allCommand": "جميع الأوامر",
        "commandList": "الأوامر",
        "banSuccess": "[ حظر المستخدم ] تم حظر المستخدم: %1",
        "banCommandSuccess": "[ حظر أمر المستخدم ] تم حظر الأمر مع المستخدم: %1",
        "errorReponse": "%1 لا يمكن تنفيذ ما تطلبه",
        "IDNotFound": "%1 معرف الذي استوردته غير موجود في قاعدة البيانات",
        "existBan": "[ حظر المستخدم ] المستخدم %1 تم حظره من قبل %2 %3",
        "missingCommandInput": "%1 يجب عليك استيراد الأمر الذي تريد حظره!",
        "returnBan": "[ حظر المستخدم ] أنت تطلب حظر المستخدم:\n- معرف المستخدم واسم من تريد حظره: %1%2\n\n❮ تفاعل مع هذه الرسالة لإكمال ❯",
        "returnBanCommand": "[ حظر أمر المستخدم ] أنت تطلب حظر الأمر مع المستخدم:\n - معرف المستخدم واسم من تريد حظره: %1\n- الأوامر: %2\n\n❮ تفاعل مع هذه الرسالة لإكمال ❯",
        "returnResult": "هذه هي نتيجتك: \n",
        "returnNull": "لا توجد نتيجة لإدخالك!",
        "returnList": "[ قائمة المستخدمين ]\هناك %1 مستخدم محظور، هنا %2 مستخدم\n\n%3",
        "returnInfo": "[ معلومات المستخدم ]:\n- معرف المستخدم واسم: %1\n- محظور؟: %2 %3 %4\n- الأمر المحظور؟: %5"
    }    
}

module.exports.handleReaction = async({ event, api, Users, handleReaction, getText }) => {
    if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
    const moment = require("moment-timezone");
    const { threadID } = event;
    const { messageID, type, targetID, reason, nameTarget } = handleReaction;

    const time = moment.tz("Africa/Casablanca").format("HH:MM:ss L");
    global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);

    switch (type) {
        case "ban":
            {
                try {
                    let data = (await Users.getData(targetID)).data || {};
                    data.banned = true;
                    data.reason = reason || null;
                    data.dateAdded = time;
                    await Users.setData(targetID, { data });
                    global.data.userBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
                    return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
                        return api.unsendMessage(messageID);
                    });
                } catch { return api.sendMessage(getText("errorReponse", "[ Ban User ]"), threadID) };
            }
    }
}

module.exports.run = async({ event, api, args, Users, getText }) => {
    const { threadID, messageID } = event;
    var targetID = String(args[0]);
    var reason = (args.slice(2, args.length)).join(" ") || null;

    if (isNaN(targetID)) {
        const mention = Object.keys(event.mentions);
        args = args.join(" ");
        targetID = String(mention[0]);
        reason = (args.slice(args.indexOf(event.mentions[mention[0]]) + (event.mentions[mention[0]] || "").length + 1, args.length)) || null;
    }

    if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Ban User ]"), threadID, messageID);
    if (global.data.userBanned.has(targetID)) {
        const { reason, dateAdded } = global.data.userBanned.get(targetID) || {};
        return api.sendMessage(getText("existBan", targetID, ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")} ${dateAdded}` : "")), threadID, messageID);
    }
    const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
    return api.sendMessage(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
        global.client.handleReaction.push({
            type: "ban",
            targetID,
            reason,
            nameTarget,
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,

        });
    }, messageID);
                                                                          }