const db = require("../connection");
const format = require("pg-format");

const seed = ({
  teamsData,
  positionsData,
  usersData,
  gameweeksData,
  playersData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS players;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS gameweeks;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS positions;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS teams;`);
    })
    .then(() => {
      const teamsTablePromise = db.query(`
        CREATE TABLE teams (
          id SERIAL PRIMARY KEY,
          team_name VARCHAR NOT NULL
        );
      `);

      const positionsTablePromise = db.query(`
        CREATE TABLE positions (
          id SERIAL PRIMARY KEY,
          position_name VARCHAR NOT NULL
        );
      `);

      const usersTablePromise = db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          email VARCHAR UNIQUE NOT NULL,
          password VARCHAR NOT NULL,
          country VARCHAR,
          favourite_team INT REFERENCES teams(id)
        );
      `);

      const gameweeksTablePromise = db.query(`
        CREATE TABLE gameweeks (
          id SERIAL PRIMARY KEY,
          gameweek INT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL
        );
      `);

      const playersTablePromise = db.query(`
        CREATE TABLE players (
          id SERIAL PRIMARY KEY,
          name VARCHAR NOT NULL,
          team_id INT REFERENCES teams(id),
          position_id INT REFERENCES positions(id),
          price NUMERIC(5, 2),
          status VARCHAR,
          total_score INT DEFAULT 0,
          image_url VARCHAR
        );
      `);

      return Promise.all([
        teamsTablePromise,
        positionsTablePromise,
        usersTablePromise,
        gameweeksTablePromise,
        playersTablePromise,
      ]);
    })
    .then(() => {
      const insertTeamsQueryStr = format(
        "INSERT INTO teams (team_name) VALUES %L;",
        teamsData.map(({ team }) => [team])
      );
      const teamsPromise = db.query(insertTeamsQueryStr);

      const insertPositionsQueryStr = format(
        "INSERT INTO positions (position_name) VALUES %L;",
        positionsData.map(({ position }) => [position])
      );
      const positionsPromise = db.query(insertPositionsQueryStr);

      return Promise.all([teamsPromise, positionsPromise]);
    })
    .then(() => {
      const insertGameweeksQueryStr = format(
        "INSERT INTO gameweeks (gameweek, start_date, end_date) VALUES %L;",
        gameweeksData.map(({ gameweek, start_date, end_date }) => [
          gameweek,
          start_date,
          end_date,
        ])
      );
      const gameweeksPromise = db.query(insertGameweeksQueryStr);

      return gameweeksPromise;
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (first_name, last_name, email, password, country, favourite_team) VALUES %L;",
        usersData.map(
          ({
            first_name,
            last_name,
            email,
            password,
            country,
            favourite_team,
          }) => [
            first_name,
            last_name,
            email,
            password,
            country,
            favourite_team,
          ]
        )
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return usersPromise;
    })
    .then(() => {
      const insertPlayersQueryStr = format(
        "INSERT INTO players (name, team_id, position_id, price, status, total_score, image_url) VALUES %L;",
        playersData.map(
          ({
            name,
            team_id,
            position_id,
            price,
            status,
            total_score,
            image_url,
          }) => [
            name,
            team_id,
            position_id,
            price,
            status,
            total_score,
            image_url,
          ]
        )
      );
      const playersPromise = db.query(insertPlayersQueryStr);

      return playersPromise;
    })
    .then(() => {
      console.log("✅ Database seeded successfully");
    })
    .catch((error) => {
      console.error("❌ Error seeding database:", error);
    })
    .finally(() => {
      db.end();
    });
};

module.exports = seed;
