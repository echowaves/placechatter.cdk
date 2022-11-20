module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('PlacesChats', {
        placeUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        chatUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        chatName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        defaultChat: {
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
        queryInterface.addIndex('PlacesChats', ['chatUuid'], {
          unique: true,
        }),
      )
      .then(() =>
        queryInterface.addIndex('PlacesChats', ['placeUuid', 'chatName'], {
          unique: true,
        }),
      ),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('PlacesChats'),
}
