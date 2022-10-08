module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;'),
  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.sequelize.query('DROP EXTENSION  IF EXISTS postgis;'),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
