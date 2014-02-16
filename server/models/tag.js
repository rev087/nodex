module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    tableName: 'tags',
    classMethods: {
      associate: function(models) {
        Tag.belongsTo(models.Page);
      }
    }
  })
 
  return Tag
}