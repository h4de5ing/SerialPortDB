var sqlite = require('./sqlite.js');
var express = require('express');
var querystring = require('querystring');
var app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

function isEmptyStr(s) {
    if (s == undefined || s == null || s == '') {
        return true
    }
    return false
}
app.get("/", (req, res) => sqlite.getLast(res));
app.post('/list', (req, res) => {
    req.addListener('data', function (data) {
        var start = querystring.parse('' + data).start;
        var stop = querystring.parse('' + data).stop;
        console.log("start:", start,stop);
        if (isEmptyStr(start) || isEmptyStr(stop)) {
            start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
            stop = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
            console.log('start or stop undefined...')
        }
        sqlite.all(res, start, stop);
    });
});
app.get('/clear', (req, res) => {
    req.addListener('data', function (data) {
        var mac = querystring.parse('' + data).mac;
        console.log("mac:", mac);
        if (!isEmptyStr(mac)) sqlite.deleteALl(res, mac);
        else res.send(`clear nothing`);
    });
});
app.post('/insert', (req, res) => {
    req.addListener('data', function (data) {
        var mac = querystring.parse('' + data).mac;
        var temp = querystring.parse('' + data).temp;
        var hum = querystring.parse('' + data).hum;
        console.log(mac, temp, hum);
        if (!isEmptyStr(mac) && !isEmptyStr(temp) && !isEmptyStr(hum)) sqlite.insert(res, Math.floor(Date.now()), mac, temp, hum)
        else res.status(200).end(`param error`);
    });
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server app listening at http://%s:%s', host, port);
});
