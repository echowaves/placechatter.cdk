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
        optIn: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        lastReadAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex('ChatsPhones', ['chatUuid', 'phoneNumber'], {
          unique: true,
        }),
      ),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('ChatsPhones'),
}
