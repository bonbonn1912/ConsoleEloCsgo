function getPlayerLines(statusmessage){
  let lines =  [];
  statusmessage.split(/\n/).forEach((line) => {
    if (line.includes("BOT") && line != undefined) {
    } else if (line.includes("STEAM_")) {
      lines.push(line);
    }
  });
  return lines;

}


function getSteamUsername(statusmessage){

  let usernames = [];
  let lines = getPlayerLines(statusmessage);

  for (let i = 0; i < lines.length; i++) {
    var splittet = lines[i].split(/#\s+\d+\s\d+\s"/);
    if (splittet[1] != undefined) {
      usernames.push(splittet[1].substring(0,splittet[1].lastIndexOf('"')));
    }
  }
  return usernames;
}

 function getSteamIds(statusmessage){
  let steamids = [];
  let lines = getPlayerLines(statusmessage);
  for (let i = 0; i < lines.length; i++) {
    var splittet = lines[i].split(/#\s+\d+\s\d+\s"/);
    if (splittet[1] != undefined) {
      steamids.push(splittet[1].substring(splittet[1].lastIndexOf('"'),splittet[1].length).split(" ")[1]);
    }
  }
  return steamids;
}

module.exports = {
  getSteamIds,
  getSteamUsername,
};
