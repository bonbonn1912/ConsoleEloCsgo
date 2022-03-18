let steam = require("steamidconvert")();
let steamids = [];
let steam64ids = [];
let lines = [];

function getSteam64Ids(statusmessage) {
  statusmessage.split("#").forEach((line) => {
    if (line.includes("BOT") && line != undefined) {
    } else if (line.includes("STEAM_")) {
      lines.push(line);
    }
  });

  for (let i = 1; i < lines.length; i++) {
    var splittet = lines[i].split('"');
    if (splittet[2] != undefined) {
      steamids.push(splittet[2].split(" ")[1]);
    }
  }
  steamids.forEach((steamid) => {
    let steam64 = steam.convertTo64(steamid);
    steam64ids.push(steam64);
  });
    return steam64ids;
}

module.exports = {
  getSteam64Ids,
};
