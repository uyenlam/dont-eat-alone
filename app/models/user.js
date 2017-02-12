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
    occupation:{
      type: DataTypes.STRING
    },
    photoLink:{
      type: DataTypes.STRING
    },
    vegetarian: {
      // This will be multiple fields when we determine what prefs we want to ask of user
      type: DataTypes.BOOLEAN
    },
    differentDiet:{
      type:DataTypes.BOOLEAN
    },
    favFood:{
      type:DataTypes.STRING
    },
    leastFood:{
      type:DataTypes.STRING
    },
    favDrink:{
      type:DataTypes.STRING
    },
    leastDrink:{
      type:DataTypes.STRING
    },
    introExtro:{
      type:DataTypes.STRING
    },
    freeTime:{
      type:DataTypes.STRING
    },
    payView:{
      type:DataTypes.STRING
    },
    cookView:{
      type:DataTypes.STRING
    },
    minAvail:{
      type:DataTypes.NUMBER
    },
    locationLat: {
      type: DataTypes.STRING,// Not sure the best way to go about this for sorting pursposes
      allowNull: true

    },

  },
    {
      // We're saying that we want our User to have Posts
      classMethods: {
        associate: function(models) {
          // Associating User with Request
          User.hasMany(models.Request, {
            // Not sure what we want for deletions, low priority (TY)
            onDelete: "cascade"
          });
        }
      }
    }
  );

  return User;
};
