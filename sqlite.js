const e = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database("./data.db");
db.run("CREATE TABLE IF NOT EXISTS iot ('id' integer  PRIMARY KEY AUTOINCREMENT, 'time' varchar,'mac' varchar, 'temp' varchar,'hum' varchar );", function (err, data) {
    if (err) {
        console.log(err);
    } else console.log("iot table create success!!");
});
db.run("CREATE TABLE IF NOT EXISTS iot_note ('id' integer  PRIMARY KEY AUTOINCREMENT,'mac' varchar, 'note' varchar);", function (err, data) {
    if (err) {
        console.log(err);
    } else console.log("iot_note table create success!!");
});
function getLast(res) {
    var sql = "SELECT max(id) id,time,mac,temp,hum from iot group by mac;";
    db.serialize(function () {
        db.all(sql,
            function (err, rows) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err);
                } else {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.json(rows);
                }
            });
    });
}
function insert(res, time, mac, temp, hum) {
    var sql = `insert into iot (time, mac,temp,hum) VALUES (?, ?, ?, ?);`;
    var values = [time, mac, temp, hum];
    db.serialize(function () {
        db.run(sql, values, function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            else {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end('insert success');
            }
        });
    });
}
function deleteALl(res,mac) {
    var sql = `delete from  iot where mac=?;`;
    var value = [mac]
    db.serialize(function () {
        db.run(sql, value, function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            } else {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send("delete all data success");
            }
        });
    });
}
function all(res, startTime, endTime) {
    var sql = "select * from iot where time>=? and time<=?;";
    var values = [startTime, endTime];
    db.serialize(function () {
        db.all(sql, values, function (err, rows) {
            if (err) {
                console.error(err);
                res.status(200).send(err);
            } else {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.json(rows);
            }
        });
    });
}
exports.getLast = getLast
exports.all = all
exports.insert = insert
exports.deleteALl = deleteALl