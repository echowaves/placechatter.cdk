module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable("ActivationRequests", {
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        smsCode: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: "none",
        },
        confirmed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        confirmedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex("ActivationRequests", ["uuid"]))
      .then(() =>
        queryInterface.addIndex("ActivationRequests", ["phoneNumber,"]),
      ),
  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable("ActivationRequests"),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
