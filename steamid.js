let steam = require("steamidconvert")();
let faceit = require("./faceit.js");

let input = `status
Connected to =[A:1:817494019:19840]:0
hostname: Valve CS:GO EU West Server (srcds119-fra2.271.1)
version : 1.38.2.2 secure
os      :  Linux
type    :  official dedicated
map     : de_dust2
players : 15 humans, 1 bots (16/0 max) (not hibernating)

# userid name uniqueid connected ping loss state rate
# 1942 2 "Hiovi" STEAM_1:1:571436593 10:50 45 0 active 196608
# 1969 3 "aLc0oL" STEAM_1:0:542318713 02:26 78 0 active 196608
# 1974 4 "Luis Stan" STEAM_1:1:225332011 01:15 29 0 active 196608
# 1975 5 "!xakzero" STEAM_1:0:632192616 00:27 76 0 active 786432
# 1947 6 "52ГЕРЦА" STEAM_1:1:640828189 08:49 37 0 active 128000
# 1972 7 "MIЯ" STEAM_1:1:543128257 01:45 166 0 active 786432
# 1973 8 "Bacon" STEAM_1:0:46643393 01:27 46 0 active 196608
# 1956 9 "DJ 420BlazeItFgt" STEAM_1:1:62455682 04:26 42 0 active 196608
# 1976 10 "BonBonn" STEAM_1:1:82178006 00:15 40 0 active 128000
# 1931 11 "tontonbeke" STEAM_1:1:237820013 14:30 61 0 active 196608
# 1957 12 "VeNnoM" STEAM_1:0:622270087 04:20 112 0 active 196608
# 1703 13 "İsak Vural" STEAM_1:0:217596200  2:24:20 63 0 active 786432
# 1951 17 "Meliodas" STEAM_1:0:86289186 06:31 59 0 active 196608
# 1953 19 "mutsuzum" STEAM_1:0:435505286 06:02 77 0 active 196608
# 1097 22 "WeRtIk" STEAM_1:0:602535833  6:53:34 118 0 active 196608
#end`;

var lines = [];
var steamids = [];
var steam64ids = [];

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
/* );
    for (let i = 1; i < lines.length - 1; i++) {
        console.log(lines.length)
      var splittet = lines[i].split('"');
      if (splittet[2] != undefined) {
        steamids.push(splittet[2].split(" ")[1]);
      }
    

    steamids.forEach((steamid) => {
      let steam64 = steam.convertTo64(steamid);
      steam64ids.push(steam64);
    }); */

module.exports = {
  getSteam64Ids,
};
