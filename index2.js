var sqlite = require('./sqlite.js');
var express = require('express');
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
    var start = req.query.start;
    var stop = req.query.stop;
    if (isEmptyStr(start) || isEmptyStr(stop)) {
        start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
        stop = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
        console.log('start or stop undefined...')
    }
    sqlite.all(res, start, stop);
});
app.get('/clear', (req, res) => sqlite.deleteALl(res));
app.post('/insert', (req, res) => {
    var mac = req.query.mac;
    var temp = req.query.temp;
    var hum = req.query.hum;
    console.log(mac, temp,hum);
    if (!isEmptyStr(mac) && !isEmptyStr(temp) && !isEmptyStr(hum)) sqlite.insert(res,Math.floor(Date.now()), mac, temp,hum)
    else res.status(500).end(`param error`);
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server app listening at http://%s:%s', host, port);
});
