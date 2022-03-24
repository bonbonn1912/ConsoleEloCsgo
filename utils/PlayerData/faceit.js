require("dotenv").config();
let axios = require("axios");
async function getElo(players, current_cmd, msg_log) {
  let newPlayers = [];
  let body = {
    meta : {
      cmd : current_cmd,
      statusMessage : msg_log,
      env : process.env.NODE_ENV,
    },
    players: players,
  }
  let url = 'https://bonbonn-faceitapi.herokuapp.com/internal/api/getMultiplePlayers';
  return new Promise((resolve) => {
    axios.post(url, body).then((res) => {
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
