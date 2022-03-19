const puppeteer = require("puppeteer");
var player = require("./player");

function createUrl(steamIDs) {
  let basisUrl = "https://csgostats.gg/player/multi?";

  for (let i = 0; i < steamIDs.length; i++) {
    let sanitzedID = steamIDs[i].replaceAll(":", "%3A");
    basisUrl += "&data%5B" + i + "%5D%5B1%5D=" + sanitzedID;
  }

  return basisUrl;
}

async function getMMRank(url, steamIDs, steamusernames) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  await page.goto(url);
  const images = await page.$$eval("img", (anchors) =>
    [].map.call(anchors, (img) => img.src)
  );
  let srcList = [];
  let players = [];
  let idCount = 0;
  for (var i = 0; i < images.length; i++) {
    if (images[i] != undefined && images[i].includes("rank")) {
      let regex = /\d+/g;
      let rankNumber = images[i].match(regex);
      let rank = numberToRank(parseInt(rankNumber));
      srcList.push(rank);
    }
  }

  let realRanks = srcList.slice(srcList.length - steamIDs.length);
  for (let i = 0; i < realRanks.length; i++) {
    players.push(new player(steamIDs[i], realRanks[i], steamusernames[i]));
    idCount++;
  }
  await browser.close();
  return new Promise((resolve, reject) => {
    resolve(players);
  });
}
function numberToRank(rankNumber) {
  switch (rankNumber) {
    case 0:
      return "unranked";
    case 1:
      return "S1";
    case 2:
      return "S2";
    case 3:
      return "S3";
    case 4:
      return "S4";
    case 5:
      return "SE";
    case 6:
      return "SEM";
    case 7:
      return "GN1";
    case 8:
      return "GN2";
    case 9:
      return "GN3";
    case 10:
      return "GN4";
    case 11:
      return "MG1";
    case 12:
      return "MG2";
    case 13:
      return "MGE";
    case 14:
      return "DMG";
    case 15:
      return "LE";
    case 16:
      return "LEM";
    case 17:
      return "Supreme";
    case 18:
      return " Global Elite";
  }
}
module.exports = {
  createUrl,
  getMMRank,
};
