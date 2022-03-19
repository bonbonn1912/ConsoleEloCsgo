const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./steamid");
const faceit = require("./faceit");
const mm = require("./utils/mm");
const example = require("./example");
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
  let test = false;
  socket.on("data", async (data) => {
    const msg = data.toString("utf8");

   if (msg.includes("getelo")) {
      if(test){
        let playerList = [];
        ids = game.getSteamIds(example.statusmessage);
        let url =  mm.createUrl(ids);
        let steamusernames = game.getSteamUsername(example.statusmessage);
        let players = await mm.getMMRank(url, ids, steamusernames);
        faceit.getElo(players).then((newPlayers) => {
          for(let i = 0; i<newPlayers.length; i++){
            playerList.push(newPlayers[i]);
          } 
          initMessage(playerList, connection);
        }); 
        
      }else{
        console.log("command triggered")
        try{
          await connection.exec("status");
        }catch(e){
          console.log("error in status")
        }
      }
      
    }
    if (msg.includes("STEAM_")) {
      console.log("status triggered");
      let playerList = [];
        ids = game.getSteamIds(msg);
        let url =  mm.createUrl(ids);
        let steamusernames = game.getSteamUsername(msg);
        let players = await mm.getMMRank(url, ids, steamusernames);
        faceit.getElo(players).then((newPlayers) => {
          for(let i = 0; i<newPlayers.length; i++){
            playerList.push(newPlayers[i]);
          } 
          initMessage(playerList, connection);
        });
    }
  });
}

listen();

async function initMessage(playerList, con) {

  (function myLoop(i) {
    setTimeout(function() {
     sendMessage(con, playerList[i-1]) 
      if (--i) myLoop(i);  
    }, 700);
  })(playerList.length);    
}
async function sendMessage(con, singePlayer) {
  try {
       await con.exec(`say ${singePlayer.steamusername}, MM-Rank: ${singePlayer.mmRank} / Faceit: ${singePlayer.elo == "no elo" ? "No Acc found" : singePlayer.elo}`);
     // await con.exec(`echo ${msg[1]} has ${msg[0]} elo`);       
  } catch (e) {}
}
