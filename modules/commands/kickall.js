module.exports.config = {
  name: "بووم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Gry KJ",
  description: "",
  commandCategory: "administration",
  usages: "", 
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const threadInfo = await api.getThreadInfo(event.threadID);

  for(let participant of threadInfo.participantIDs) {
    if(participant == api.getCurrentUserID() || participant == event.senderID) {
      continue;
    }

    await api.removeUserFromGroup(participant, event.threadID);
  }
};