module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    age: {
      type: DataTypes.INTEGER
    },
    preferences: {
      // This will be multiple fields when we determine what prefs we want to ask of user
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.??? // Not sure the best way to go about this for sorting pursposes
      allowNull: true
    },
    // Passport login info
    username: DataTypes.STRING,
    hash: {
        type: DataTypes.TEXT
    },
    salt: {
        type: DataTypes.STRING
    }

  },
    {
      // We're saying that we want our User to have Posts
      classMethods: {
        associate: function(models) {
          // Associating User with Posts
          User.hasMany(models.Post, {
            // Not sure what we want for deletions, low priority (TY)
            onDelete: "cascade"
          });
        }
      }
    }
  );

  passportLocalSequelize.attachToUser(User, {
      usernameField: 'username',
      hashField: 'hash',
      saltField: 'salt'
  });

  return User;
};
