var sqlite = require('./berrer-sqlite3.js');
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
app.get("/", (req, res) => res.json(sqlite.getLast()));
app.post('/list', (req, res) => {
    var start = req.query.start;
    var stop = req.query.stop;
    if (isEmptyStr(start) || isEmptyStr(stop)) {
        start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
        stop = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
        console.log('start or stop undefined...')
    }
    res.json(sqlite.all(start, stop))
});
app.get('/clear', (req, res) => res.end(sqlite.deleteALl()));
app.post('/insert', (req, res) => {
    var mac = req.query.mac;
    var note = req.query.note;
    console.log(mac, note);
    if (!isEmptyStr(mac) && !isEmptyStr(note)) res.end(sqlite.insert(Math.floor(Date.now()), mac, note))
    else res.end(`param is empty`);
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server app listening at http://%s:%s', host, port);
});
