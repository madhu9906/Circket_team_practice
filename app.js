const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const port = 3000;

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const InitializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};

InitializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;
  const playerArray = await db.all(getPlayersQuery);
  response.send(playerArray);
});
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  //console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayersQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES('${playerName}','${jerseyNumber}','${role}')`;
  const dbResponse = await db.run(addPlayersQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const playerArray = await db.get(getPlayerQuery);
  response.send(playerArray);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `UPDATE cricket_team SET player_name= '${playerName}',
  jersey_number = '${jerseyNumber}',
  role = '${role}' WHERE player_id = ${playerId}
  `;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const DeletePlayerDetails = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(DeletePlayerDetails);
  response.send("Player Removed");
});

module.exports = app;
