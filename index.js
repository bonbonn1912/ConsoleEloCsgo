const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./steamid");
const faceit = require("./faceit");
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
    let ids = [];
    const msg = data.toString("utf8");
    if (msg.includes("getelo")) {
      await connection.exec("status");
    }
    if (msg.includes("STEAM_")) {
      ids = await game.getSteam64Ids(msg);
      faceit.getElo(ids, connection).then((elos) => {
        initMessage(elos, connection);
      });
    }
  });
}

listen();

async function initMessage(elo, con) {

  (function myLoop(i) {
    setTimeout(function() {
     sendMessage(con, elo[i-1]) 
      if (--i) myLoop(i);  
    }, 700);
  })(elo.length);    
}

async function sendMessage(con, msg) {
  try {
   
    if(msg[1] != "invalid user" && msg[0] != "no elo") {
      console.log(`say ${msg[1]} has ${msg[0]} elo`);
      await con.exec(`say ${msg[1]} has ${msg[0]} elo`);
     // await con.exec(`echo ${msg[1]} has ${msg[0]} elo`);
      
    }
    
  } catch (e) {}
}
