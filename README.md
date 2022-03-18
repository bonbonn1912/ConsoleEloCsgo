# Print Faceit Elo ingame
print faceit elo ingame via telnet

## Description
Gets faceit elo via the official faceit api and prints it either in your console or (team-) chat. 
This is a very early and error prone version

## Setup
    https://github.com/bonbonn1912/ConsoleEloCsgo
    cd ConsoleEloCsgo
    create .env file with your faceit api key (It is planned to use a third party api that does not require an api key)
    npm install
    node index.js
    
## Usage
    Add the following launch option to CS:GO  
     -netconport 2121  
     type "status" or "getelo" into the console so see the results. 
     
## There is no risk of being banned
