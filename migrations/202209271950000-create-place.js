module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Places', {
        placeUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        placeName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        placeDescription: {
          type: Sequelize.STRING(1024),
          allowNull: false,
          defaultValue: '',
        },
        streetAddress1: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        streetAddress2: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        district: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        isoCountryCode: {
          type: Sequelize.STRING(3),
          allowNull: false,
        },
        postalCode: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        region: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        subregion: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        timezone: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },

        location: {
          type: Sequelize.GEOMETRY('POINT'),
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
      })
      .then(() =>
        queryInterface.createTable('PlaceRoles', {
          placeUuid: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          phoneNumber: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          role: {
            type: Sequelize.STRING(50), // ["owner, "admin"]
            allowNull: false,
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }),
      )

      .then(() => queryInterface.addIndex('Places', ['placeUuid']))
      .then(() => queryInterface.addIndex('Places', ['placeName']))
      .then(() => queryInterface.addIndex('Places', ['location']))
      .then(() => queryInterface.addIndex('PlaceRoles', ['placeUuid']))
      .then(() => queryInterface.addIndex('PlaceRoles', ['phoneNumber'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) =>
    queryInterface
      .dropTable('PlaceRoles')
      .then(() => queryInterface.dropTable('Places')),
}
// https://gis.stackexchange.com/questions/159434/resolving-postgis-type-geometry-does-not-exist-issue-on-installing-tiger-geoco
// https://stackoverflow.com/questions/28417409/type-geometry-does-not-exists
