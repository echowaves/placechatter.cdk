module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('PlacesCards', {
        cardUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        placeUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        createdBy: {
          type: Sequelize.STRING(20), //phone number
          allowNull: false,
        },
        cardTitle: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        cardText: {
          type: Sequelize.STRING(1024),
          allowNull: false,
          defaultValue: '',
        },
        photoUuid: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        sortOrder: {
          type: Sequelize.INTEGER,
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
        queryInterface.addIndex('PlacesCards', ['cardUuid'], {
          unique: true,
        }),
      )
      .then(() =>
        queryInterface.addIndex('PlacesCards', ['placeUuid', 'sortOrder'], {
          unique: true,
        }),
      )
      .then(() => queryInterface.addIndex('PlacesCards', ['placeUuid'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('PlacesCards'),
}
