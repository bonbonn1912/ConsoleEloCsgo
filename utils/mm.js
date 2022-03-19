
function createUrl(steamIDs) {
    console.log("in create URL");
  let basisUrl = "https://csgostats.gg/player/multi?";

  for (let i = 0; i < steamIDs.length; i++) {
    let sanitzedID = steamIDs[i].replaceAll(":", "%3A");
    basisUrl += "&data%5B" + i + "%5D%5B1%5D=" + sanitzedID;
  }

  return basisUrl;
}

module.exports = {
    createUrl,
};