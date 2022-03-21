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

    if(msg.includes("getelo")) {
      try {
        await connection.exec("status");
      } catch (e) {
        console.log("error in status");
      }
      
        if(process.env.NODE_ENV.trim() !== "production"){
         var msg = example.statusmessage4;
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
          consoleMessage(playerList, connection);
         }).catch((err) => {});
      
    
    }
    else if(msg.includes("printelo")) {
      try {
        await connection.exec("status");
      } catch (e) {
        console.log("error in status");
      }
        if(process.env.NODE_ENV.trim() !== "production"){
         var msg = example.statusmessage4;
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
          printMessage(playerList, connection);
         }).catch((err) => {});
       
      
    } 
  });
}

async function consoleMessage(playerList, con) {
  var message = "";
    for (let i = 0; i < playerList.length; i++) {
      message= message + `echo ${playerList[i].steamusername}, MM-Rank: ${
        playerList[i].mmRank
      } / Faceit: ${
        playerList[i].elo == "no elo" ? "No Acc found" : playerList[i].elo
      } \n`
      //await sendMessage(con, playerList[i]);
      //setTimeout(() => {},1000);
    }
    sendMessage(con,0, message);
    sendMessage(con,1000, "echo visit github.com/bonbonn1912/ConsoleEloCsgo for more information");

}

async function printMessage(playerList, con) {
    for (let i = 0; i < playerList.length; i++) {
      
      await sendMessage(con,1000, `say ${playerList[i].steamusername}, MM-Rank: ${
        playerList[i].mmRank
      } / Faceit: ${
        playerList[i].elo == "no elo" ? "No Acc found" : playerList[i].elo
      }`);
    }
    sendMessage(con,1000, "say visit github.com/bonbonn1912/ConsoleEloCsgo for more information");

}

async function sendMessage(con,delay,  message) {
  try {
    await con.exec(message);
    setTimeout(() => {},delay);
  } catch (e) {}
}

listen();
