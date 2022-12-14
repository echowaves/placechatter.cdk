module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Phones', {
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        nickName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING(256),
          allowNull: false,
          defaultValue: 'none',
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
      .then(() => queryInterface.addIndex('Phones', ['uuid'], { unique: true }))
      .then(() =>
        queryInterface.addIndex('Phones', ['phoneNumber'], { unique: true }),
      )
      .then(() =>
        queryInterface.addIndex('Phones', ['nickName'], { unique: true }),
      )
      .then(() =>
        queryInterface.addIndex('Phones', ['token'], { unique: true }),
      ),
  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('Phones'),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
