const sqlitedb = require('better-sqlite3');
const createTable = "CREATE TABLE IF NOT EXISTS iot ('id' integer  PRIMARY KEY AUTOINCREMENT, 'time' varchar,'mac' varchar, 'note' varchar );"

const dbutenti = './data.db';
let db = new sqlitedb(dbutenti, sqlitedb.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('table create success!!');
    verbose: console.log
});
db.exec(createTable);

const db2 = require('better-sqlite3')(dbutenti);
function getLast() {
    const stmt = db2.prepare('SELECT max(id) id,time,mac,note from iot group by mac');
    var row = stmt.all();
    console.log("getLast");
    return row;
}
function insert(time, mac, note) {
    var stmp = db2.prepare("INSERT INTO iot(time,mac,note) values(?,?,?)");
    var run = stmp.run(time, mac, note);
    return `insert data success ${run.changes}`;
}
function deleteALl() {
    var stmp = db2.prepare("Delete from iot");
    return `delete data success ${stmp.run().changes}`;
}
function all(startTime, endTime) {
    const stmt = db2.prepare('SELECT id,time,mac,note FROM iot where time>=? and time<=?');
    var row = stmt.all(startTime, endTime);
    
    return row;
}
exports.getLast = getLast
exports.all = all
exports.insert = insert
exports.deleteALl = deleteALl