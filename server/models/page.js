module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    tableName: 'pages',
    classMethods: {
      associate: function(models) {
        Page.belongsTo(models.User);
        Page.hasMany(models.Tag);
      }
    }
  })
 
  return Page
}