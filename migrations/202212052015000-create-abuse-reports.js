module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('AbuseReports', {
        messageUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        createdBy: {
          type: Sequelize.STRING(20), //phone number
          allowNull: false,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex('AbuseReports', ['messageUuid']))
      .then(() => queryInterface.addIndex('AbuseReports', ['createdAt'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) => queryInterface.dropTable('AbuseReports'),
}
