const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./steamid");
const faceit = require("./faceit");
const { default: axios } = require("axios");
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
    const msg = data.toString("utf8");
    if(msg.includes("STEAM_")){
      var id = await game.getSteam64Ids(msg);
      faceit.getElo(id, connection).then((elos) => {
        var res = elos.join(" |  ");
        console.log(res);
        sendElo(res, connection);
       
      });
    };
    
  });
}

listen();



async function sendElo(elo, con) {
    try{
      await con.exec(`say ${elo}`);
     //  await con.exec(`echo ${elo}`);
       
    }catch(e){
        console.log(e);
    }
 
}


