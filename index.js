const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./utils/steamid");
const faceit = require("./utils/faceit");
const mm = require("./utils/mm");
const example = require("./utils/example");
const RETRY_TIMEOUT = 10 * 1000;

async function listen() {
  const connection = new Telnet.Telnet();
  const params = {
    host: "127.0.0.1",
    port: config.port,
    negotiationMandatory: false,
    timeout: 1500,
  };

  try {
    await connection.connect(params);
  } catch (e) {
    console.log(
      `Error: Unable to connect to ${params.host}:${params.port}.\nMake sure that "-netconport ${params.port}" is added to the CS:GO launch options and that the game is running.\nRetrying in 10 seconds...`
    );
    setTimeout(() => {
      listen();
    }, RETRY_TIMEOUT);
    return;
  }
  const socket = connection.getSocket();
  socket.on("data", async (data) => {
    var msg = data.toString("utf8");
    if (msg.includes("STEAM_") ) {
      if(process.env.NODE_ENV.trim() !== "production"){
       var msg = example.statusmessage;
      }else {
        var msg = data.toString("utf8");
      }
      let playerList = [];
      ids = game.getSteamIds(msg);
      let url = mm.createUrl(ids);
      let steamusernames = game.getSteamUsername(msg);
      let players = await mm.getMMRank(url, ids, steamusernames);
      faceit.getElo(players).then((newPlayers) => {
        for (let i = 0; i < newPlayers.length; i++) {
          playerList.push(newPlayers[i]);
        }
        initMessage(playerList, connection);
      });
    }else if(msg.includes("getelo")) {
      try {
        await connection.exec("status");
      } catch (e) {
        console.log("error in status");
      }
    } 
  });
}

<<<<<<< HEAD
listen();

async function initMessage(elo, con) {
  (function myLoop(i) {
    setTimeout(() => {
      sendMessage(con, elo[i - 1]);
      if (--i) myLoop(i);
    }, 700);
  })(elo.length);
=======
async function initMessage(playerList, con) {
  (function myLoop(i) {
    setTimeout(function () {
      sendMessage(con, playerList[i - 1]);
      if (--i) myLoop(i);
    }, 700);
  })(playerList.length);
>>>>>>> mm-ranks
}
async function sendMessage(con, singePlayer) {
  try {
<<<<<<< HEAD
    if (msg[1] != "invalid user" && msg[0] != "no elo") {
      console.log(`say ${msg[1]} has ${msg[0]} elo`);
      await con.exec(`say ${msg[1]} has ${msg[0]} elo`);
      // await con.exec(`echo ${msg[1]} has ${msg[0]} elo`);
    }
=======
    await con.exec(
      `say ${singePlayer.steamusername}, MM-Rank: ${
        singePlayer.mmRank
      } / Faceit: ${
        singePlayer.elo == "no elo" ? "No Acc found" : singePlayer.elo
      }`
    );
>>>>>>> mm-ranks
  } catch (e) {}
}

listen();
