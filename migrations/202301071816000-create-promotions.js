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

        promotionText: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },
        requiredEventCounts: {
          // how many events should happen to fullfill the promotion
          type: Sequelize.INTEGER,
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
      .then(() =>
        queryInterface.createTable('PromotionsEvents', {
          promotionUuid: {
            type: Sequelize.UUID,
            allowNull: false,
          },

          eventUuid: {
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
      .then(() => queryInterface.addIndex('Promotions', ['placeUuid']))
      .then(() => queryInterface.addIndex('Promotions', ['createdAt']))
      .then(() =>
        queryInterface.addIndex('PromotionsEvents', [
          'promotionUuid',
          'createdBy',
        ]),
      )
      .then(() => queryInterface.addIndex('PromotionsEvents', ['createdAt'])),

  down: (
    queryInterface,
    Sequelize, // eslint-disable-line no-unused-vars
  ) =>
    queryInterface
      .dropTable('Promotions')
      .then(() => queryInterface.dropTable('PromotionsEvents')),
}
