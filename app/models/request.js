var Sequelize = require("sequelize");

module.exports = function(db) {
  return db.define("Request", {
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unanswered",
      validate: {
        len: [1]
      }
    } //status

  } //end of first parameter of sequelize.define
    ,{
      // We're saying that we want our User to have Requests
      classMethods: {
        associate: function(models) {
          // A User (foreignKey) is required or a Request can't be made
          // Working on how to make request associate with multiple users (TY)
          Request.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return Request;
};
