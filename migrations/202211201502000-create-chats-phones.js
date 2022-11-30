module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('ChatsPhones', {
        chatUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        unreadCounts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        lastReadAt: {
          allowNull: false,
          type: Sequelize.DATE,
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
        queryInterface.addIndex('ChatsPhones', ['chatUuid', 'phoneNumber'], {
          unique: true,
        }),
      )
      .then(() => queryInterface.addIndex('ChatsPhones', ['updatedAt'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('ChatsPhones'),
}
