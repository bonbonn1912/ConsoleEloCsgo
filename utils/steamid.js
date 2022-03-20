let steam = require("steamidconvert")();

function getLines(statusmessage){
  let lines = [];
  statusmessage.split(/#(\s+)(\d+)(\s)(\d+)(\s)/).forEach((line) => {
    if (line.includes("BOT") && line != undefined) {
    } else if (line.includes("STEAM_")) {
      lines.push(line);
    }
  });
  return lines;
}


function getSteam64Ids(statusmessage) {
  
  let steam64ids = [];
  let lines = getLines(statusmessage);
  let steamids = getSteam64Ids(lines);

  steamids.forEach((steamid) => {
    let steam64 = steam.convertTo64(steamid);
    steam64ids.push(steam64);
  });
    return steam64ids;
}

function getSteamUsername(statusmessage){

  let usernames = [];
  let lines = getLines(statusmessage);

  for (let i = 0; i < lines.length; i++) {
    let splittet = lines[i].split('"');
    if (splittet[1] != undefined) {
      usernames.push(splittet[1]);
    }
  }
  return usernames;
}

function getSteamIds(statusmessage){
  let steamids = [];
  let lines = getLines(statusmessage);

  for (let i = 0; i < lines.length; i++) {
    var splittet = lines[i].split('"');
    if (splittet[2] != undefined) {
      steamids.push(splittet[2].split(" ")[1]);
    }
  }
  return steamids;

}

module.exports = {
  getSteam64Ids,
  getSteamIds,
  getSteamUsername,
};
