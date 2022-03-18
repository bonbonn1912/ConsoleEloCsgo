var axios = require("axios");
require("dotenv").config();

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
        resolve(res.data.games.csgo.faceit_elo);
      })
      .catch((err) => {
        resolve("no faceit");
      });
  });
}
module.exports = {
  getElo,
};
