function getPlayerLines(statusmessage) {
  let lines = [];
  statusmessage.split(/\n/).forEach((line) => {
    if (line.match(/#\d+\s"\w+"\sBOT\s/) && line != undefined) {
    } else if (line.includes("STEAM_")) {
      lines.push(line);
    }
  });
  return lines;
}

function getSteamUsername(statusmessage) {
  let usernames = [];
  let lines = getPlayerLines(statusmessage);
  for (let i = 0; i < lines.length; i++) {
    var splittet = lines[i].split(/#\s+\d+\s\d+\s"/);
    if (splittet[1] != undefined) {
      var name = splittet[1].substring(0, splittet[1].lastIndexOf('"')); 
      usernames.push(`${name}`);
    }
  }
  return usernames;
}

function getSteamIds(statusmessage) {
  let steamids = [];
  let lines = getPlayerLines(statusmessage);
  for (let i = 0; i < lines.length; i++) {
    var splittet = lines[i].split(/#\s+\d+\s\d+\s"/);
    if (splittet[1] != undefined) {
      var id = splittet[1]
        .substring(splittet[1].lastIndexOf('"'), splittet[1].length)
        .split(" ")[1];
      if (!steamids.includes(id)) steamids.push(id);
    }
  }
  return steamids;
}

function getPlayerObjects(statusmessage) {
  let steamUsernames = getSteamUsername(statusmessage);
  let steamIds = getSteamIds(statusmessage)
  let objects = [];
  if (steamIds.length === steamUsernames.length) {
    for (let i = 0; i < steamIds.length; i++) {
      objects.push({
        id: steamIds[i],
        username: steamUsernames[i],
      });
    }
    return objects
  }
};

module.exports = {
  getSteamIds,
  getSteamUsername,
  getPlayerObjects
};
