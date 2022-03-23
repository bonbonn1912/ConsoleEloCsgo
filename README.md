# Print MM Ranks and FaceIT elo ingame
This tool uses telnet to interact with the console in CS:GO

## Description
Gets faceit elo via the official faceit api and the last known Matchmaking rank from csgostats.gg and prints them either in your console or chat. 
This is a very early and error prone version. <br>

## Prerequisites
NodeJs needs to be installed on your PC (check with node -v in your cmd) <br>
Get the latest version of NodeJs here: https://nodejs.org/en/download/
 
## Setup
 - install NodeJs if its not installed 
 - download the repository from https://github.com/bonbonn1912/ConsoleEloCsgo
 - open windows command line
 - maneuver to the location of the repository `cd <xxx>/<xxx>/ConsoleEloCsgo` <br>
 - run `npm install` to install all the needed dependencies <br>
 - add the following launch option to CS:GO:  *-netconport 2121*  
 - go into the "launcher" folder and start *csgo_elo.bat* or *csgo_elo_hide.vbs* 
 - the game launches with the rank check tool running in the background
 - (optionally the tool can also be launched with `npm run build` after CS:GO has been started)
    
## Usage  
type **getelo** into the console to see the results written in the console. <br>
type **printelo** into the console to see the results written in chat.

#
**there is no risk of being banned!**
