'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.trip)
      models.user.belongsToMany(models.stream, {through: "userStream"})
      models.user.hasMany(models.fish)
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'Name must be 2-25 characters long.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args:[8,99],
          msg: 'Password must be between 8 and 99 characters.'
        }
      }
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args:[5, 5],
          msg: 'Please enter a valid zip code.'
        },
        isNumeric: true
      }
    },
    style: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args:[3, 12],
          msg: 'Invalid style selection'
        }
      }
    },
    favoriteStream: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Please enter a valid favorite.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', async (pendingUser, options)=>{
    await bcrypt.hash(pendingUser.password, 10)
    .then(hashedPassword=>{
      console.log(`${pendingUser.password} became ---> ${hashedPassword}`)
      pendingUser.password = hashedPassword
    })
  })

  // ALTERNATIVE TIMING OPTION FOR ABOVE HOOK
  // user.addHook('beforeCreate', (pendingUser, options)=>{
  //   let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
  //   console.log(`${pendingUser.password} became ---> ${hashedPassword}`)
  //   pendingUser.password = hashedPassword
  // })

  // REMOVING AND PUTTING THIS ON PPCONFIG LINE 71
  // user.prototype.validPassword = async (passwordInput) => {
  //   let match = await bcrypt.compare(passwordInput, this.password)
  //   return match
  // }

  return user;

};