/**
 * @description sequelize instance
 * @author wurui
 */

const Sequelize = require('sequelize');
const { MYSQL_CONF } = require('../conf/db');
const {host, user, password, database} = MYSQL_CONF;
const { isProd, isTest } = require('../utils/env');

const conf = {
    host: host,
    dialect: 'mysql'
}

//test env
if(isTest) {
    conf.logging = () => {}
}

if(isProd) {
    conf.pool = {
        max: 5, // max connection
        min: 0, // min connection
        idle: 10000 // max waiting time
    }
}


const seq = new Sequelize(
    database,
    user,
    password,
    conf
)


module.exports = seq;