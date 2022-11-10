var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='myTable'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select myTable_id, myTable_txt from myTable`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table myTable (
                     myTable_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     myTable_txt text NOT NULL);

                      insert into myTable (myTable_txt)
                      values ('What a cool blog website!'),
                             ('Man this is way better than Facebook or Twitter!');`,
              () => {
                db.all(` select myTable_id, myTable_txt from myTable`, (err, rows) => {
                  res.render('index', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      if (req.body.myTable.toLowerCase().includes("drop") || req.body.myTable.toLowerCase().includes("delete")){
        console.log("Nice try buddy, not on my watch!");
        db.exec(`insert into myTable ( myTable_txt)
                values ('Nuh uh uh!');`)
      }else{
        console.log("inserting " + req.body.myTable);
        db.exec(`insert into myTable ( myTable_txt)
                  values ('${req.body.myTable}');`)
      }
      
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      if (req.body.myTable.toLowerCase().includes("drop") || req.body.myTable.toLowerCase().includes("delete")){
        console.log("Nice try buddy, not on my watch!");
        db.exec(`insert into myTable ( myTable_txt)
                values ('Nuh uh uh!');`)
      }else{
        console.log("inserting " + req.body.myTable);
        db.exec(`delete from myTable where myTable_id='${req.body.myTable}';`);  
      }
         
      res.redirect('/');
    }
  );
})

module.exports = router;
