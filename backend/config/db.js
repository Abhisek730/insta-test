const {Sequelize} = require("sequelize");

const sequelize = new Sequelize({
    dialect:"sqlite",
    storage:"./data/test_db.sqlite",
    logging:false
})

module.exports = sequelize 