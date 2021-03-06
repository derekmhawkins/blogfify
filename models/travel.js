'use strict';
module.exports = function(sequelize, DataTypes) {
  var Travel = sequelize.define('Travel', {
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
  return Travel;
};