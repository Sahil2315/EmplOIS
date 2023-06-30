const express = require('express');
const { type } = require('os');
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require('path')
const { Pool, Client } = require('pg')
require('dotenv').config()
const connectionString = process.env.Postgres_String

const db = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
})

db.connect((err) => {
  if (err) throw err
  console.log("Connected")
})

app.use(express.static(path.join(__dirname + '/Admin/')));
app.use(express.static(path.join(__dirname + '/Details/')));
app.use(express.static(path.join(__dirname + '/SignIn/')));
app.use(express.static(path.join(__dirname + '/SignUP/')));
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'SignIn/index.html'))
})
 
app.get('/gotosin', (req, res) => {
  res.sendFile(path.join(__dirname, 'SignIn/index.html'))
})

app.get('/gotosup', (req, res) => {
  res.sendFile(path.join(__dirname, 'SignUP/signup.html'))
})

io.on("connection", (socket) => {
  socket.on("newmsg", (msg) => {
    socket.broadcast.emit("nmessage", msg)
    db.query(`insert into messages(empid, ename, date, time, msgcont) values('${msg.empid}', '${msg.name}', now(), now(), '${msg.val}');`, (err,res) => {
      if(err) throw err
      console.log("Message Stored into the Database")
    })
  })
})

app.post('/getmsg', (req,res) => {
  db.query(`SELECT * FROM "messages" order by msgid DESC LIMIT 20;`, (err, reslt) => {
    if(err) throw err
    res.send({'msgs': reslt.rows})
  })
})

app.post('/signup', (req, res) => {
  db.query(`select email,title from employee where empid = '${req.body.empid}' and regkey = '${req.body.regkey}' and regport = 'no';`, (err, result) => {
    if (result.rows.length == 0) {
      res.send({ "reg": "failure" })
    }
    else {
      res.send({ "reg": "success" })
      if (result.rows[0].title == 'Admin') {
        db.query(`insert into logindet values('${req.body.empid}', '${req.body.username}', '${result.rows[0].email}', '${req.body.password}', 'yes');`)
        db.query(`update employee set regport = "yes" where empid = "${req.body.empid}"`)
      }
      else {
        db.query(`insert into logindet values('${req.body.empid}', '${req.body.username}', '${result.rows[0].email}', '${req.body.password}', 'no');`)
        db.query(`update employee set regport = 'yes' where empid = '${req.body.empid}'`)
      }
    }
  })
})

app.post('/login', (req, res) => {
  let emp;
  db.query(`select * from logindet where (username = '${req.body.username}' or email = '${req.body.username}') and password = '${req.body.password}';`, function(err, reslt) {
    if (err) throw err
    if (reslt.rows.length == 0 || reslt.rows[0] == undefined) {
      res.send({ "login": "failure" })
    }
    else {
      emp = reslt.rows[0].empid
      db.query(`select * from employee where empid = '${emp}';`, (er, result) => {
        if(er) throw er
        if (reslt.rows[0].admin == "yes") {
          db.query(`select * from employee order by "empid"`, (e, ret) => {
            db.query(`select * from change where chstat = 'Held';`, (ert, restl) => {
              res.send({
                "login": "successful",
                "admin": "yes",
                "cont": ret.rows,
                "self": {
                  "empid": result.rows[0].empid,
                  "Gdet": {
                    "Full Name": result.rows[0].name,
                    "Gender": result.rows[0].gender,
                    "Department": result.rows[0].dept,
                    "Job Title": result.rows[0].title,
                    "Team": result.rows[0].team,
                    "Company Email ID": result.rows[0].email
                  },
                  "Pdet":
                  {
                    "Date Of Birth": `${result.rows[0].dob.getDate()}-${result.rows[0].dob.getMonth()}-${result.rows[0].dob.getFullYear()}`,
                    "Phone Number": result.rows[0].phone,
                    "Current Address": result.rows[0].c_add,
                    "Permanent Address": result.rows[0].p_add,
                    "Aadhaar Card No.": result.rows[0].aadhaar,
                    "UPI ID": result.rows[0].upi
                  },
                  "Odet": {
                    "Joining Date": `${result.rows[0].doj.getDate()}-${result.rows[0].doj.getMonth()}-${result.rows[0].doj.getFullYear()}`,
                    "Salary": result.rows[0].salary, 
                    "Laptop ID": result.rows[0].laptop,
                    "Leaves Remaining": result.rows[0].leaves
                  }
                },
                "change": restl.rows
              })
            })
          })
        }
        else if(result.rows[0].title == 'Supervisor'){
          let tempd = new Date()
          let dstr = `${tempd.getFullYear()}-${tempd.getMonth() + 1}-${tempd.getDate() + 1}`
          db.query(`select * from leaves where lstat = 'Held'`, (error, resltt) => {
            if(error) throw error
            db.query(`select * from projects`, (errr, reselt) => {
              if(errr) throw errr
              res.send({
                "login": "successful",
                "admin": "no",
                "empid": result.rows[0].empid,
                "Gdet": {
                  "Full Name": result.rows[0].name,
                  "Gender": result.rows[0].gender,
                  "Department": result.rows[0].dept,
                  "Job Title": result.rows[0].title,
                  "Team": result.rows[0].team,
                  "Company Email ID": result.rows[0].email
                },
                "Pdet":
                {
                  "Date Of Birth": `${result.rows[0].dob.getDate()}-${result.rows[0].dob.getMonth()}-${result.rows[0].dob.getFullYear()}`,
                  "Phone Number": result.rows[0].phone,
                  "Current Address": result.rows[0].c_add,
                  "Permanent Address": result.rows[0].p_add,
                  "Aadhaar Card No.": result.rows[0].aadhaar,
                  "UPI ID": result.rows[0].upi
                },
                "Odet": {
                  "Joining Date": `${result.rows[0].doj.getDate()}-${result.rows[0].doj.getMonth()}-${result.rows[0].doj.getFullYear()}`,
                  "Salary": result.rows[0].salary, 
                  "Laptop ID": result.rows[0].laptop,
                  "Leaves Remaining": result.rows[0].leaves
                },
                "leaves": resltt.rows,
                "projects": reselt.rows
              })
            })
          })
        }
        else {
          res.send({
            "login": "successful",
            "admin": "no",
            "empid": result.rows[0].empid,
            "Gdet": {
              "Full Name": result.rows[0].name,
              "Gender": result.rows[0].gender,
              "Department": result.rows[0].dept,
              "Job Title": result.rows[0].title,
              "Team": result.rows[0].team,
              "Company Email ID": result.rows[0].email
            },
            "Pdet":
            {
              "Date Of Birth": `${result.rows[0].dob.getDate()}-${result.rows[0].dob.getMonth()}-${result.rows[0].dob.getFullYear()}`,
              "Phone Number": result.rows[0].phone,
              "Current Address": result.rows[0].c_add,
              "Permanent Address": result.rows[0].p_add,
              "Aadhaar Card No.": result.rows[0].aadhaar,
              "UPI ID": result.rows[0].upi
            },
            "Odet": {
              "Joining Date": `${result.rows[0].doj.getDate()}-${result.rows[0].doj.getMonth()}-${result.rows[0].doj.getFullYear()}`,
              "Salary": result.rows[0].salary, 
              "Laptop ID": result.rows[0].laptop,
              "Leaves Remaining": result.rows[0].leaves
            }
          })
        }
      })
    }
  })
})

app.get('/emplogin', (req, res) => {
    res.sendFile(path.join(__dirname, "Details/Details.html"))
})

app.get('/adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname, "Admin/admself.html"))
})

app.get('/admext', (req, res) => {
  db.query('select * from employee;', (err, result) => {
    res.send({ "body": result.rows })
  })
})

app.post("/perschange", (req, res) => {
  let value = req.body.val
  let temp = req.body.field
  let field;
  if(temp == 0) field = "phone"
  if(temp == 1) field = "c_add"
  if(temp == 2) field = "p_add"
  if(temp == 3) field = "upi"
  db.query(`update employee set "${field}" = '${value}' where empid = '${req.body.empid}';`, (err, result) => {
    if(err) throw err
    res.send({"change": "successful"})
  })
})

app.post("/orgchange", (req,res) => {
  let value = req.body.val
  let temp = req.body.field
  let field;
  if(temp == 0) field = "dept"
  if(temp == 1) field = "title"
  if(temp == 2) field = "team"
  if(temp == 3) field = "laptop"
  db.query(`insert into change values('${req.body.empid}', '${field}', '${value}');`, (err, result) => {
    if(err) throw err;
    res.send({"change": "sent"})
  })
})

app.post("/leav", (req, res) => {
  let fromdate = req.body.from
  let fromdt = new Date(fromdate.slice(0,4), fromdate.slice(5,7), fromdate.slice(8,10))
  let todate = req.body.to
  let todt = new Date(todate.slice(0,4), todate.slice(5,7), todate.slice(8,10))
  let ndays = (todt - fromdt)/(24*60*60*1000)
  db.query(`select team from employee where empid = '${req.body.empid}';`, (err, result) => {
    if(err) throw err
    if(result.rows[0].team){
      db.query(`insert into leaves values('${req.body.empid}', '${req.body.reason}', '${fromdate}', '${todate}', 'Held', '${result.rows[0].team}')`)
    }
    else{
      db.query(`insert into leaves values('${req.body.empid}', '${req.body.reason}', '${fromdate}', '${todate}'`)
    }
  })
})

app.post("/searchemp", (req, res) => {
  db.query(`select empid,name,gender,phone,email,dept,title,team from employee where name ilike '${req.body.searchfor}%' or empid ilike '${req.body.searchfor}%' or dept ilike '${req.body.searchfor}%' or title ilike '${req.body.searchfor}%' order by name;`, (err, result) => {
    if(err) throw err
    if(result.rowCount == 0){
      res.send({'search': 'notfound'})
    }
    else{
      if(result.rowCount == 1){
        res.send({'search': 'successful1', 'result': result.rows[0]})
      }
      else{
        res.send({'search': 'successful2', 'result': result.rows})
      }
    }
  })
})

app.post("/checklv", (req,res) => {
  let tod = new Date()
  db.query(`select * from leaves where empid = '${req.body.empid}'`, (err, result) => {
    if(err) throw err
    if(result.rowCount == 0){
      res.send({'result': 'noleaves'})
    }
    else{
      let tod = new Date()
      if(tod > result.rows[0].from){
        db.query(`delete from leaves where empid = '${req.body.empid}'`, (er, rslt) => {
          res.send({'result': 'noleaves'})
        })
      }
      else{
        res.send({'result': 'lvfound', 'query': result.rows[0]})
      }
    }
  })
})

app.post("/cancellv", (req,res) => {
  db.query(`delete from leaves where empid = '${req.body.empid}'`, (err, result) => {
    if(err) throw err
    res.send({'cancellation': 'done'})
  })
})

app.post("/checkch", (req,res) => {
  db.query(`select * from change where empid = '${req.body.empid}'`, (err, result) => {
    if(err) throw err
    if(result.rowCount == 0){
      res.send({'changes': 'none'})
    }
    else{
      db.query(`delete from change where empid = '${req.body.empid}' and chstat = 'Applied' or chstat = 'Denied'`)
      res.send({'changes': 'found', 'reslt': result.rows})
    }
  })
})

app.post('/addemp', (req,res) => {
  if(req.body.det[17] == 0){
    db.query(`insert into employee(empid, name, dob, email, phone, c_add, p_add, aadhaar, upi, dept, title, doj, salary, regkey, laptop, leaves, gender) values('${req.body.det[0]}', '${req.body.det[1]}', '${req.body.det[2]}', '${req.body.det[3]}', '${req.body.det[4]}', '${req.body.det[5]}', '${req.body.det[6]}', '${req.body.det[7]}', '${req.body.det[8]}', '${req.body.det[9]}', '${req.body.det[10]}', '${req.body.det[11]}', '${req.body.det[12]}', '${req.body.det[13]}', '${req.body.det[14]}', '${req.body.det[15]}', '${req.body.det[16]}')`, (err, result) => {
      if(err){
        res.send({'adding': 'failed'})
        throw err
      }
      else{
        res.send({'adding': 'passed'})
      }
    })
  }
  else{
    db.query(`insert into employee(empid, name, dob, email, phone, c_add, p_add, aadhaar, upi, dept, title, doj, salary, regkey, laptop, leaves, gender, team) values('${req.body.det[0]}', '${req.body.det[1]}', '${req.body.det[2]}', '${req.body.det[3]}', '${req.body.det[4]}', '${req.body.det[5]}', '${req.body.det[6]}', '${req.body.det[7]}', '${req.body.det[8]}', '${req.body.det[9]}', '${req.body.det[10]}', '${req.body.det[11]}', '${req.body.det[12]}', '${req.body.det[13]}', '${req.body.det[14]}', '${req.body.det[15]}', '${req.body.det[16]}', '${req.body.det[17]}')`, (err, result) => {
      if(err){
        res.send({'adding': 'failed'})
        throw err
      }
      else{
        res.send({'adding': 'passed'})
      }
    })
  }
})

app.post('/lvaprov', (req,res) => {
  db.query(`update leaves set lstat = 'Approved' where empid = '${req.body.empid}'`, (err, result) => {
    if(err) throw err
    res.send({'approval': 'successful'})
  })
})

app.post('/lvdeny', (req,res) => {
  db.query(`update leaves set lstat = 'Denied' where empid = '${req.body.empid}'`, (err, result) => {
    if(err) throw err
    res.send({'denial': 'successful'})
  })
})

app.post('/chaprov', (req, res) => {
  db.query(`select*from change where empid = '${req.body.empid}' and field = '${req.body.field}'`, (err, result) => {
    let ch = result.rows[0]
    db.query(`update employee set "${ch.field}" = '${ch.value}' where empid = '${req.body.empid}'`, (er, rslt) => {
      if(er) throw er
      db.query(`update change set chstat = 'Approved' where empid = '${req.body.empid}' and field = '${req.body.field}'`)
      res.send({'approval': 'successful'})
    })
  })
})
app.post('/chdeny', (req, res) => {
  db.query(`select*from change where empid = '${req.body.empid}' and field = '${req.body.field}'`, (err, result) => {
    db.query(`update change set chstat = 'Denied' where empid = '${req.body.empid}' and field = '${req.body.field}'`)
    res.send({'denial': 'successful'})
  })
})


server.listen(5000, () => {
  console.log("Server Running on Port 5000")
})