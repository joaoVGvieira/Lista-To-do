const { Sequelize, DataTypes } = require('sequelize');

// conexao com o .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  priority: {
    type: DataTypes.STRING,
    defaultValue: 'asap' 
  }
});

module.exports = {
  sequelize,
  Task,
};