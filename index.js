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
        sendElo(elos, connection);
      });
    }
  });
}

listen();

async function sendElo(elo, con) {
  try {
    let sayString = "";
    elo.forEach((entry) => {
      sayString += `${entry[1]} |`;
    });
    let echo = "";
    elo.forEach((entry) => {
      echo += `${entry[0]} : ${entry[1]} |`;
    });
     await con.exec(`say ${sayString}; echo ${echo}`);
  } catch (e) {
    console.log(e);
  }
}
