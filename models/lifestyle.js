'use strict';
module.exports = function(sequelize, DataTypes) {
  var Lifestyle = sequelize.define('Lifestyle', {
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
  return Lifestyle;
};