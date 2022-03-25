const config = require("./config.json");
const Telnet = require("telnet-client");
const game = require("./utils/PlayerData/steamid");
const faceit = require("./utils/PlayerData/faceit");
const mm = require("./utils/PlayerData/mm");
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
  await sendMessage(connection, 0, "clear");
  await sendMessage(
    connection,
    0,
    ` echo ------------------------------------- \n
  echo |..BonBonns Rank Check Tool loaded..| \n
  echo | Available Commands in official MM | \n
  echo | [getranks] ---> prints to Console | \n
  echo | [printranks] -------> to All-Chat | \n
  echo | [teamprintranks] --> to Team-Chat | \n
  echo ------------------------------------- `
  );
  let current_cmd = "";
  let msg_log = "";
  socket.on("data", async (data) => {
    var msg = data.toString("utf8");
    if (process.env.NODE_ENV !== "production" && current_cmd != "") {
      msg = example.statusmessage6;
      msg_log = msg;
    }
    if (
      (msg.includes("STEAM_") ||
        msg.includes("# userid name uniqueid connected ping loss state rate") ||
        msg.includes("map     :")) &&
      current_cmd != "" &&
      process.env.NODE_ENV == "production"
    ) {
      msg_log = msg_log + msg + "\n";
    }
    if (
      msg.includes("#end") &&
      msg_log.includes(
        "# userid name uniqueid connected ping loss state rate"
      ) &&
      msg_log.includes("map     :") &&
      current_cmd != ""
    ) {
      let playerList = [];
      let faceitList = [];
      ids = game.getSteamIds(msg_log);
      let steamusernames = game.getSteamUsername(msg_log);
      for (let i = 0; i < ids.length; i += 10) {
        const idslice = ids.slice(i, i + 10);
        const nameslice = steamusernames.slice(i, i + 10);
        let url = mm.createUrl(idslice);

        let players = await mm.getMMRank(url, idslice, nameslice);
        faceitList = faceitList.concat(players);
      }
      faceit
        .getElo(faceitList, current_cmd, msg_log)
        .then((newPlayers) => {
          for (let i = 0; i < newPlayers.length; i++) {
            playerList.push(newPlayers[i]);
          }
          if (current_cmd == "getranks") {
            consoleMessage(playerList, connection);
            current_cmd = "";
            msg_log = "";
          }
          if (current_cmd == "printranks" || current_cmd == "teamprintranks") {
            printMessage(playerList, connection, current_cmd);
            current_cmd = "";
            msg_log = "";
          }
        })
        .catch((err) => {});
    } else if (
      msg.includes(`Unknown command "getranks"`) ||
      msg.includes("Unknown command: getranks")
    ) {
      try {
        current_cmd = "getranks";
        if (process.env.NODE_ENV == "production") {
          await connection.exec("status");
        } else {
          sendMessage(connection, 0, "echo loaded statusmessage for dev");
        }
      } catch (e) {
        console.log("status -> " + e);
      }
    } else if (
      msg.includes(`Unknown command "printranks"`) ||
      msg.includes("Unknown command: printranks")
    ) {
      try {
        current_cmd = "printranks";
        if (process.env.NODE_ENV == "production") {
          await connection.exec("status");
        } else {
          sendMessage(connection, 0, "echo loaded statusmessage for dev");
        }
      } catch (e) {
        console.log("status -> " + e);
      }
    } else if (
      msg.includes(`Unknown command "teamprintranks"`) ||
      msg.includes("Unknown command: teamprintranks")
    ) {
      try {
        current_cmd = "teamprintranks";
        if (process.env.NODE_ENV == "production") {
          await connection.exec("status");
        } else {
          sendMessage(connection, 0, "echo loaded statusmessage for dev");
        }
      } catch (e) {
        console.log("status -> " + e);
      }
    } else if (
      msg.includes(`Unknown command "teamprintelo"`) ||
      msg.includes("Unknown command: teamprintelo") ||
      msg.includes(`Unknown command "printelo"`) ||
      msg.includes("Unknown command: printelo") ||
      msg.includes(`Unknown command "getelo"`) ||
      msg.includes("Unknown command: getelo")
    ) {
      try {
        sendMessage(
          connection,
          0,
          "echo please use [ getranks | printranks | printteamranks ] from now on"
        );
      } catch (e) {
        console.log("status -> " + e);
      }
    }
  });
}

async function consoleMessage(playerList, con) {
  var message = "";
  for (let i = 0; i < playerList.length; i++) {
    message =
      message +
      `echo "${playerList[i].steamusername} -> MM-Rank: ${
        playerList[i].mmRank
      } | Faceit: ${
        playerList[i].elo == "no elo" ? "No Acc found" : playerList[i].elo
      } \n`;
  }
  await sendMessage(con, 0, "clear");
  sendMessage(con, 0, message);
  //sendMessage(con,1000, "echo visit github.com/bonbonn1912/ConsoleEloCsgo for more information");
}

async function printMessage(playerList, con, current_cmd) {
  var mode = "say";
  if (current_cmd == "teamprintranks") mode = "say_team";
  for (let i = 0; i < playerList.length; i++) {
    await sendMessage(
      con,
      0,
      `${mode} "${playerList[i].steamusername} -> MM-Rank: ${
        playerList[i].mmRank
      } | Faceit: ${
        playerList[i].elo == "no elo" ? "No Acc found" : playerList[i].elo
      } `
    );
  }
  sendMessage(
    con,
    0,
    `${mode} visit github.com/bonbonn1912/ConsoleEloCsgo for more information`
  );
}

async function sendMessage(con, delay, message) {
  try {
    await con.exec(message);
    setTimeout(() => {}, delay);
  } catch (e) {}
}

listen();
