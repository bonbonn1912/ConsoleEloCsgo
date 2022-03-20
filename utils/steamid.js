let steam = require("steamidconvert")();

function getPlayerLines(statusmessage){
  let lines =  [];
  statusmessage.split(/#(\s+)(\d+)(\s)(\d+)(\s)/).forEach((line) => {
    if (line.includes("BOT") && line != undefined) {
    } else if (line.includes("STEAM_")) {
      lines.push(line);
    }
  });
  return lines;
}

function getElementFromLine(lines, index1, index2){
  let steamids = [];
  for (let i = 1; i < lines.length; i++) {
    var splittet = lines[i].split('"');
    if (splittet[2] != undefined) {
      steamids.push(splittet[index1].split(" ")[index2]);
    }
  }
  return steamids;
}

function getSteam64Ids(statusmessage) {

  let steam64ids = [];
  let lines = getPlayerLines(statusmessage);
  let steamids = getElementFromLine(lines, 2, 1);

  steamids.forEach((steamid) => {
    let steam64 = steam.convertTo64(steamid);
    steam64ids.push(steam64);
  });
    return steam64ids;
}

function getSteamUsername(statusmessage){
  let usernames = [];
  let lines = getPlayerLines(statusmessage);

  for (let i = 0; i < lines.length; i++) {
    let splittet = lines[i].split('"');
    if (splittet[1] != undefined) {
      usernames.push(splittet[1]);
    }
  }
  return usernames;

}

function getSteamIds(statusmessage){

  let lines = getPlayerLines(statusmessage);
  let steamids = getElementFromLine(lines, 2, 1);
  return steamids;

}

module.exports = {
  getSteam64Ids,
  getSteamIds,
  getSteamUsername,
};
