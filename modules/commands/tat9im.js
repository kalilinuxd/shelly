const axios = require("axios");
module.exports.config = {
    name: "تطاقيم",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Gry KJ",
    description: "Talk to Neymar",
    commandCategory: "Neymar",
    usages: "[ask]",
    cooldowns: 2,
};
module.exports.run = async function({ api, event, box}) {

const res = await axios.get("https://api.erdwpe.com/api/randomgambar/couplepp");
const data = res.data;
const m = await funcs.getStreamFromURL(data.result.male);
const f = await funcs.getStreamFromURL(data.result.female);
box.reply({body: "هيهي (❁´◡`❁)", attachment: [m,f]})

}
