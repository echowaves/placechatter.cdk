module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('ChatsUpdates', {
        chatUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },

        lastReadAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex('ChatsUpdates', ['chatUuid', 'phoneNumber'], {
          unique: true,
        }),
      ),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('ChatsUpdates'),
}
