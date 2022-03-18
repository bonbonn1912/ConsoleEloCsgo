var axios = require("axios");
require("dotenv").config();

async function getElo(steam64ids, connection) {
  var elos = [];
  var number = steam64ids.length;
  let i = 0;
  return new Promise((resolve, reject) => {
     steam64ids.forEach((steam64id) => {
      url = `https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${steam64id}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${process.env.FACEIT_API_KEY}`,
          },
        })
        .then((res) => {
        //  console.log(steam64id);
         elos.push(res.data.steam_nickname + " has "  + res.data.games.csgo.faceit_elo + "Elo");
        })
        .catch((err) => {
          // console.log(steam64id);
          // console.log(err);
        });
      
    })
    setTimeout(() => {
      resolve(elos);
    },3000);
   
  })

 
}

module.exports = {
  getElo,
};
