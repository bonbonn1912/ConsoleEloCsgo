function buildOutput(player, outputParameter, type){
   let output = "echo";
   switch(outputParameter){
        case "say": output = "say"; break;
        case "echo": output = "echo"; break;
        case "tsay": output = "say_team"; break;
   }
   switch(type){
        case "full": return `${output}  ${player.steamusername}, MM-Rank: ${player.mmRank} / Faceit: ${ player.elo == "no elo" ? "No Acc found" : player.elo}`; break;
        case "mm": return `${output}  ${player.steamusername}: ${player.mmRank}`; break;
        case "elo": return `${output}  ${player.steamusername}, Faceit-Elo:  ${player.elo == "no elo" ? "No Acc found" : player.elo}`; break;
   }
  //  return `${output} ${player.steamusername}, MM-Rank: ${player.mmRank} / Faceit: ${ player.elo == "no elo" ? "No Acc found" : player.elo}`;
}

module.exports = {
    buildOutput
}