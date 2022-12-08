module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
    }, {
      paranoid: true,
    })
  
    return User
  }
  