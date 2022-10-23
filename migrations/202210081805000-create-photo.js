module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Photos', {
        photoUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        createdBy: {
          // fyi only
          type: Sequelize.STRING(20), //phone number
          allowNull: false,
        },

        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })

      .then(() =>
        queryInterface.addIndex('Photos', ['photoUuid'], { unique: true }),
      ),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('Photos'),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
