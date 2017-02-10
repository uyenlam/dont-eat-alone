module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    googleid: {
      type: DataTypes.STRING
    },
    googletoken: {
      type: DataTypes.STRING
    },
    googlename: {
      type: DataTypes.STRING
    },
    googleemail: {
      type: DataTypes.STRING
    }

  });

  return User;
};

// ,name: {
//   type: DataTypes.STRING,
// },
// age: {
//   type: DataTypes.INTEGER
// },
// preferences: {
//   // This will be multiple fields when we determine what prefs we want to ask of user
//   type: DataTypes.STRING
// },
// location: {
//   type: DataTypes.INTEGER // Not sure the best way to go about this for sorting pursposes
// }
// },
//   {
//     // We're saying that we want our User to have Posts
//     classMethods: {
//       associate: function(models) {
//         // Associating User with Posts
//         User.hasMany(models.Post, {
//           // Not sure what we want for deletions, low priority (TY)
//           onDelete: "cascade"
//         });
//       }
//     }
//   }
