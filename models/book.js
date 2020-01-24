'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({ 

    title: {
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'Title must not be blank',
            },
            notEmpty: {
                msg: 'Title must not be blank'         
            }      
        },
    },

    author: {  
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
          notNull: {
              msg: 'Author must not be blank',
          },
          notEmpty: { 
              msg: 'Author must not be blank'
          }      
        },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
    
    }, { sequelize });

  return Book;
};