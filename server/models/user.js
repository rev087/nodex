module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: { notEmpty: { msg: 'A valid username is required' } }
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: { msg: 'A valid e-mail is required' }
				}
			},
			passHash: {
				type: DataTypes.STRING,
				allowNull: false
			},
			loginToken: {
				type: DataTypes.STRING
			}
		}, {
			tableName: 'users',
			classMethods: {
				associate: function(models) {
					User.hasMany(models.Page);
				}
			}
	});

	return User;
}