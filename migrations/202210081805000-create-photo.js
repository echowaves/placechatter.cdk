module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Photos', {
        photoUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(20),
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
      })
      .then(() =>
        queryInterface.createTable('PlacesPhotos', {
          placeUuid: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          photoUuid: {
            type: Sequelize.TEXT,
            allowNull: false,
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }),
      )

      .then(() =>
        queryInterface.addIndex('Photos', ['photoUuid'], { unique: true }),
      )
      .then(() => queryInterface.addIndex('Photos', ['phoneNumber']))

      .then(() =>
        queryInterface.addIndex('PlacesPhotos', ['placeUuid', 'photoUuid'], {
          unique: true,
        }),
      )
      .then(() => queryInterface.addIndex('PlacesPhotos', ['updatedAt'])),
  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) =>
    queryInterface
      .dropTable('PlacesPhotos')
      .then(() => queryInterface.dropTable('Photos')),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
