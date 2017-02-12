var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', email: 'jack@example.com' }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', email: 'jill@example.com' }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}


// name: {
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
