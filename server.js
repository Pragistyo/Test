const express    = require('express')
const bodyParser = require('body-parser')
const app        = express()
require('dotenv').config()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER_SQL, //process.env.USER
    password: process.env.PASS_SQL, //process.env.PASS_SQL
    database: 'qlue'
});

connection.connect((err) => {
    if (err) console.log(err)
    console.log('DATABASE MYSQL CONNECT')
})

connection.query('CREATE DATABASE IF NOT EXISTS qlue', function (err) {
    if (err) throw err;
    connection.query('USE qlue', function (err) {
        if (err) throw err;
        connection.query(`CREATE TABLE IF NOT EXISTS users(id INT NOT NULL AUTO_INCREMENT,PRIMARY KEY(id),firstname TEXT,lastname TEXT)`, function (err) {
                if (err) throw err;
            });
        // connection.query('CREATE TABLE IF NOT EXISTS users('
        //     + 'id INT NOT NULL AUTO_INCREMENT,'
        //     + 'PRIMARY KEY(id),'
        //     + 'name VARCHAR(30)'
        //     + ')', function (err) {
        //         if (err) throw err;
        //     });
    });
});

app.get('/listUser', (req,res) => {

    connection.query('SELECT * from users', function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        let sendItem = {
            response: "success",
            result: results
        }
        res.status(200).send(sendItem)
    });

})

app.post('/', (req,res) => {
    const dataFirstname = req.body.firstname
    const dataLastname  = req.body.lastname
    
    connection.query(`INSERT INTO users(firstname, lastname)VALUES('${dataFirstname}','${dataLastname}')`, (error,results, fields) => {
        if(error) throw error;
        res.status(200).send(results)
    })
})

// connection.end();

app.listen(process.env.PORT || 3000 ,(err) => {
    if(err) console.log('error CONNECTION')
    console.log('PORT 3000!')
})