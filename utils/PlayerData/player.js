
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
  getAllString(outputParameter){
    let output = "echo";
    switch(outputParameter){
      case "say": output = "say"; break;
      case "echo": output = "echo"; break;
      case "tsay": output = "tsay"; break;
    }
    return `${output} ${this.steamusername}, MM-Rank: ${this.mmRank} / Faceit: ${ singePlayer.elo == "no elo" ? "No Acc found" : singePlayer.elo}`;
  }
}

module.exports = player;