var axios = require("axios");
require("dotenv").config();

async function getElo(players) {
  let newPlayers = [];
  await Promise.all(players.map(async (player) => {
   let eloResp = await getFaceitElo(player.steam64ID);
   player.addElo(eloResp[0]);
   player.addUsername(eloResp[1]);
   newPlayers.push(player);
  }));
  return newPlayers;
}

async function getFaceitElo(steam64id) {
  return new Promise((resolve) => {
    let url = `https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${steam64id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
        },
      })
      .then((res) => {
        resolve([res.data.games.csgo.faceit_elo, res.data.steam_nickname]);
      })
      .catch((err) => {
        resolve(["no elo", "invalid user"]);
      });
  });
}
module.exports = {
  getElo,
};
