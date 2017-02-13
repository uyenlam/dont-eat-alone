
var Sequelize = require("sequelize")

module.exports = function(db){
  return db.define("user",{
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    age: {
      type: Sequelize.INTEGER
    },
    occupation:{
      type: Sequelize.STRING
    },
    photoLink:{
      type: Sequelize.STRING
    },
    vegetarian: {
      // This will be multiple fields when we determine what prefs we want to ask of user
      type: Sequelize.BOOLEAN
    },
    differentDiet:{
      type:Sequelize.BOOLEAN
    },
    favFood:{
      type:Sequelize.STRING
    },
    leastFood:{
      type:Sequelize.STRING
    },
    favDrink:{
      type:Sequelize.STRING
    },
    leastDrink:{
      type:Sequelize.STRING
    },
    introExtro:{
      type:Sequelize.STRING
    },
    freeTime:{
      type:Sequelize.STRING
    },
    payView:{
      type:Sequelize.STRING
    },
    cookView:{
      type:Sequelize.STRING
    },
    minAvail:{
      type:Sequelize.NUMBER
    },
    locationLat: {
      type: Sequelize.STRING,// Not sure the best way to go about this for sorting pursposes
      allowNull: true
    },
    locationLong: {
      type: Sequelize.STRING,
    },
    locationName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    online:{
      type: Sequelize.BOOLEAN,
      default: false,
    }
    // {
    //   // We're saying that we want our User to have Posts
    //   classMethods: {
    //     associate: function(models) {
    //       // Associating User with Request
    //       User.hasMany(models.Request, {
    //         // Not sure what we want for deletions, low priority (TY)
    //         onDelete: "cascade"
    //       });
    //     }
    //   }
    // }

  })
};
