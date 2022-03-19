var axios = require("axios");
require("dotenv").config();

<<<<<<< HEAD:faceit.js
async function getElo(steam64ids) {
  let elos = [];
  console.log(steam64ids);
  await Promise.all(
    steam64ids.map(async (steam64id) => {
      let eloResp = await getFaceitElo(steam64id);
      elos.push(eloResp);
    })
  );
  return elos;
=======
async function getElo(players) {
  let newPlayers = [];
  await Promise.all(players.map(async (player) => {
   let eloResp = await getFaceitElo(player.steam64ID);
   player.addElo(eloResp[0]);
   player.addUsername(eloResp[1]);
  // console.log("Player : " + player.username + " has " + eloResp[0] + " elo");
   newPlayers.push(player);
  }));
  return newPlayers;
>>>>>>> mm-ranks:utils/faceit.js
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
        console.log([res.data.games.csgo.faceit_elo, res.data.steam_nickname]);
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
