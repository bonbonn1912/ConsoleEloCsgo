const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./utils/PlayerData/steamid");
const faceit = require("./utils/PlayerData/faceit");
const mm = require("./utils/PlayerData/mm");
const example = require("./utils/example");
const message = require("./utils/Messages/messageBuilder");
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
       var msg = example.statusmessage3;
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
       }).catch((err) => {});
    }else if(msg.includes("getelo")) {
      try {
        await connection.exec("status");
      } catch (e) {
        console.log("error in status");
      }
    } 
  });
}

async function initMessage(playerList, con) {
    for (let i = 0; i < playerList.length; i++) {
      await sendMessage(con, playerList[i]);
      setTimeout(() => {},550);
    }
   try {
    await con.exec("say visit github.com/bonbonn1912/ConsoleEloCsgo for more information");
   }catch(e){}

}

async function sendMessage(con, singlePlayer) {
  try {
    await con.exec(
      `${message.buildOutput(singlePlayer, "tsay", "full")}`
    );
  } catch (e) {}
}

listen();
