'use strict';
module.exports = function(sequelize, DataTypes) {
  var Career = sequelize.define('Career', {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Career;
};