var axios = require("axios");
require("dotenv").config();

async function getElo(players) {
  let newPlayers = [];
  let url = 'https://bonbonn-faceitapi.herokuapp.com/internal/api/getMultiplePlayers';
  return new Promise((resolve) => {
    axios.post(url, players).then((res) => {
      newPlayers = res.data;
      resolve(newPlayers);
    }).catch((err) => {
      resolve(players);
    })
  }) 
}
module.exports = {
  getElo,
};
