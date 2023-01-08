module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('Promotions', {
        promotionUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        placeUuid: {
          type: Sequelize.UUID,
          allowNull: false,
        },

        expiresAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
      .then(() =>
        queryInterface.createTable('PromotionsCards', {
          promotionUuid: {
            type: Sequelize.UUID,
            allowNull: false,
          },

          promotionsCardUuid: {
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
        }),
      )
      .then(() =>
        queryInterface.createTable('PromotionsCardsPunches', {
          promotionsCardUuid: {
            type: Sequelize.UUID,
            allowNull: false,
          },

          promotionsCardsPunchesUuid: {
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
        }),
      )

      .then(() => queryInterface.addIndex('Promotions', ['promotionUuid']))
      .then(() => queryInterface.addIndex('Promotions', ['createdAt'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) =>
    queryInterface
      .dropTable('Promotions')
      .then(() => queryInterface.dropTable('PromotionsCards'))
      .then(() => queryInterface.dropTable('PromotionsCardsPunches')),
}
