module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Feedbacks', {
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },

        feedbackText: {
          type: Sequelize.STRING(2000),
          allowNull: false,
          defaultValue: '',
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex('Feedbacks', ['phoneNumber'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('Feedbacks'),
}
