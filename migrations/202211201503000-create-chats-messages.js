module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('ChatsMessages', {
        chatUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        messageUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        createdBy: {
          type: Sequelize.STRING(20), //phone number
          allowNull: false,
        },
        messageText: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },

        deleted: {
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
      .then(() => queryInterface.addIndex('ChatsMessages', ['chatUuid']))
      .then(() =>
        queryInterface.addIndex('ChatsMessages', ['messageUuid'], {
          unique: true,
        }),
      )
      .then(() =>
        queryInterface.addIndex('ChatsMessages', ['createdAt'], {
          unique: true,
        }),
      ),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('ChatsMessages'),
}
