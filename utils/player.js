
let steam = require("steamidconvert")();
class player {
  constructor(steamID, mmRank, steamusername) {
    this.steamID = steamID;
    this.mmRank = mmRank;
    this.steam64ID = steam.convertTo64(steamID);
    this.steamusername = steamusername;
  }
  addElo(elo) {
    this.elo = elo;
  }
  addUsername(username) {
    this.username = username;
  }
}

module.exports = player;