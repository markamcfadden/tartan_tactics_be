const format = require("pg-format");
const db = require("../connection");
const { gameweekData, playersData } = require("../data/dev-data");

const seed = ({
  usersData,
  teamsData,
  positionsData,
  gameweekData,
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
    });
};
