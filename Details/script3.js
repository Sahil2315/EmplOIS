let namevar;
let empidval;

let navch = document.getElementById("navch")
let navap = document.getElementById("navap")
let navse = document.getElementById("navse")
let chmenu = document.getElementById("changeinit")
let lvmenu = document.getElementById("leavesinit")
let semenu = document.getElementById("searchinit")

let space1 = document.getElementById("space1")
let actv = null;
let curmenu = null
let chtog = false
let letog = false
let setog = false

navch.addEventListener("click", () => {
  if(!chtog){
    if(actv) actv.classList.remove("active")
    if(curmenu) curmenu.style.display = "none"
    curmenu = chmenu
    curmenu.style.display = "flex"
    actv = navch
    actv.classList.add("active")
    chtog = true
    letog = false
    setog = false
  }
  else{
    actv.classList.remove("active")
    actv = null
    curmenu.style.display = "none"
    curmenu = null
    chtog = false
  }
})
navap.addEventListener("click", () => {
  if(!letog){
    if(actv) actv.classList.remove("active")
    if(curmenu) curmenu.style.display = "none"
    curmenu = lvmenu
    curmenu.style.display = "flex"
    actv = navap
    actv.classList.add("active")
    letog = true
    chtog = false
    setog = false
  }
  else{
    actv.classList.remove("active")
    actv = null
    curmenu.style.display = "none"
    curmenu = null
    letog = false
  }
})
navse.addEventListener("click", () => {
  if(!setog){
    if(actv) actv.classList.remove("active")
    if(curmenu) curmenu.style.display = "none"
    curmenu = semenu
    curmenu.style.display = "flex"
    actv = navse
    actv.classList.add("active")
    setog = true
    chtog = false
    letog = false
  }
  else{
    actv.classList.remove("active")
    actv = null
    curmenu.style.display = "none"
    curmenu = null
    setog = false
  }
})

let persapp = document.getElementById("persapp")
let persinp = document.getElementById("persinp")
let perslct = document.getElementById("perslct")

persapp.addEventListener("click", async() => {
  if(persinp.value != "" && perslct.value != ""){
    if(confirm("These Details will be directly changed in the Database\nClick OK to Continue")){
      let apply1 = await fetch("/perschange", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "empid": empidval,
          "field": perslct.value,
          "val": persinp.value 
        })
      })
      let resp1 = await apply1.json()
      if(resp1.change == "successful"){
        window.alert("Your Changes are Succesfully Applied")
        persinp.value = ""
        perslct.value = ""
      }
    }
  }  
})

let orgapp = document.getElementById("orgapp")
let orginp = document.getElementById("orginp")
let orgslct = document.getElementById("orgslct")

orgapp.addEventListener("click", async() => {
  if(orginp.value != "" && orgslct.value != ""){
    if(confirm("These Changes would be sent to the System Admin\nClick OK to Continue")){
      let apply2 = await fetch("/orgchange", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "empid": empidval,
          "field" : orgslct.value,
          "val": orginp.value
        })
      })
      let resp2 = await apply2.json()
      if(resp2.change == "sent"){
        window.alert("Change in Details went to the System Admin for Approval")
        orgslct.value = ""
        orginp.value = ""
      }
    }
  }
})

let rinp = document.getElementById("rinp")
let fdate = document.getElementById("fdate")
let tdate = document.getElementById("tdate")
let lvbtn = document.getElementById("leavapp")

let tempdate = new Date()
tempdate.setDate(tempdate.getDate() + 1)
fdate.min = tempdate.toISOString().slice(0,10)

tdate.addEventListener("click", () => {
  tdate.min = fdate.value
  tempdate.setDate(tempdate.getDate() + 14)
  tdate.max = tempdate.toISOString().slice(0,10)
})

lvbtn.addEventListener("click", async () => {
  let apply3 = await fetch("/leav", {
    'method': "POST",
    'headers': {
      'Content-Type' : 'application/json'
    },
    'body': JSON.stringify({
      'empid': empidval,
      'reason': rinp.value,
      'from': fdate.value,
      'to': tdate.value
    })
  })
  let resp3 = await apply3.json()
  if(resp3.status == 'held'){
    window.alert("Your Leave Application is waiting for your Team Lead to Approve")
    // console.log(resp3.result)
    lvmenu.innerHTML = `
    <span>You already have a Leave Application awaiting Approval</span>
    <span>Reason: ${rinp.value}</span>
    <span>From: ${fdate.value}</span>
    <span>To: ${tdate.value}</span>
    <button id = "cancellv">Cancel Application</button>
  `
  let cancelbtn = document.getElementById("cancellv")
    cancelbtn.addEventListener("click", async() => {
      if(confirm("Are You Sure You want to Cancel this Applicaiton?")){
        let cancl = await fetch("/cancellv", {
          'method': 'POST',
          'headers': {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({
            'empid': empidval
          })
        })
        let cancresp = await cancl.json()
        if(cancresp.cancellation == 'done'){
          lvmenu.innerHTML = `
            <span>Your Leave Application has been cancelled</span>
            <span>Please Relogin to Apply for Another Leave</span>
          `
        }
      }
    })
  }
  if(resp3.status == 'done'){
    window.alert("Your Leave has been Approved Automatically")
  }
})

let searchdiv = document.getElementById("searchinit")
let searchbox = document.getElementById("srchbox")
let searchbtn = document.getElementById("srchbtn")
let srchrslt = document.getElementById("searchresult")

searchbox.addEventListener("keyup", async() => {
  if(searchbox.value == ""){
    srchrslt.innerHTML = ""
  }
  else{
    let search1 = await fetch("/searchemp", {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'searchfor': searchbox.value
      })
    })
    let resp4  = await search1.json()
    if(resp4.search == 'notfound'){
      srchrslt.innerHTML = `
      <span style="font-size:20px;">There is no person with that Name / ID / Department / Job Title working in this Company</span>
      `
    }
    else{
      if(resp4.search == "successful1"){
        console.log(resp4.result)
        srchrslt.innerHTML = `
          <div class = "searchrows">
            <svg width="18%" viewBox="0 0 272 294" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="272" height="294" fill="#DADADA"/>
                <ellipse cx="136" cy="91.5" rx="54" ry="55.5" fill="#959595"/>
                <path d="M35.5 155.5L6 293L69.5 269H209L267.5 293L243.5 155.5H35.5Z" fill="#959595"/>
            </svg>
            <div class="searchcols">
                <span>Employee ID: ${resp4.result.empid}</span>
                <span>Name: ${resp4.result.name}</span>
                <span>Gender: ${resp4.result.gender}</span>
                <span>Phone Number: ${resp4.result.phone}</span>
            </div>
            <div class="searchcols">
                <span>Email ID: ${resp4.result.email}</span>
                <span>Department: ${resp4.result.dept}</span>
                <span>Title: ${resp4.result.title}</span>
                <span>Team: ${resp4.result.team}</span>
            </div>
          </div>
        `
      }
      else{
        console.log(resp4)
        srchrslt.innerHTML = ""
        for(let i=0; i < resp4.result.length; i++){
          srchrslt.innerHTML += `
            <div class = "searchrows">
              <svg width="18%" viewBox="0 0 272 294" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="272" height="294" fill="#DADADA"/>
                  <ellipse cx="136" cy="91.5" rx="54" ry="55.5" fill="#959595"/>
                  <path d="M35.5 155.5L6 293L69.5 269H209L267.5 293L243.5 155.5H35.5Z" fill="#959595"/>
              </svg>
              <div class="searchcols">
                  <span>Employee ID: ${resp4.result[i].empid}</span>
                  <span>Name: ${resp4.result[i].name}</span>
                  <span>Gender: ${resp4.result[i].gender}</span>
                  <span>Phone Number: ${resp4.result[i].phone}</span>
              </div>
              <div class="searchcols">
                  <span>Email ID: ${resp4.result[i].email}</span>
                  <span>Department: ${resp4.result[i].dept}</span>
                  <span>Title: ${resp4.result[i].title}</span>
                  <span>Team: ${resp4.result[i].team}</span>
              </div>
            </div>
            <hr>
        `
        }
      }
    }
  }
})





let gendet = document.getElementById('generaldet')
let perdet = document.getElementById('personaldet')
let orgdet = document.getElementById('orgdet')



let lvapdiv = document.getElementById('approvlv')
let lvdisp = document.getElementById('lvdisp')
let lvapps = document.getElementById('lvapps')
let arrow3 = document.getElementById('arrow3')

toglvlv = false

lvdisp.addEventListener('click', () => {
  if(!toglvlv){
    lvapdiv.style.width = '700px'
    arrow3.style.transform = 'rotate(180deg)'
    toglvlv = true
  }
  else{
    lvapdiv.style.width = '50px'
    arrow3.style.transform = 'rotate(0deg)'
    toglvlv = false
  }
})


let message_area = document.getElementById('messages')

let lvapel = document.getElementById('lvapel')
let leftarw = document.getElementById('lftarrow')
let rightarw = document.getElementById('rghtarrow')

let projdiv = document.getElementById('projs')
let projdisp = document.getElementById('projdisp')
let arrowpr = document.getElementById('projarw')
togproj = false

projdisp.addEventListener('click', () => {
  if(!togproj){
    projdiv.style.width = '900px'
    projstable.style.display = "flex"
    projarw.style.transform = 'rotate(180deg)'
    togproj = true
  }
  else{
    projdiv.style.width = '40px'
    projstable.style.display = 'none'
    projarw.style.transform = 'rotate(0deg)'
    togproj = false
  }
})

let projstable = document.getElementById('projstable')

let aprovbtn = document.getElementById('lvapprove')
let denybtn = document.getElementById('lvdeny')

window.addEventListener('load', async () => {
  let query = JSON.parse(sessionStorage.getItem("query"))
  if(query.projects){
    projdiv.style.display = "flex"
    for(let i=0; i<query.projects.length; i++){
      projstable.innerHTML += `
        <div class="projstat">
          <div class="upperprojstat">
            <span>Team: ${query.projects[i].team}</span>
            <span>Project: ${query.projects[i].name}</span>
            <span>Deadline: ${query.projects[i].deadline.slice(0, 10)}</span>
          </div>
          <div class="lowerprojstat">
            <span>Completed: ${query.projects[i].statpercentage}%</span>
            <span>Status: ${query.projects[i].status}</span>
          </div>
        </div>
      `
    }
  }
  if(query.leaves && query.leaves.length == 0){
    lvapel.innerHTML = "No Leave Applications are Currently Awaiting Approvals"
  }
  if(query.leaves && query.leaves.length != 0){

    lvapdiv.style.display = "flex"
    i=0
    lvapel.innerHTML = `
        <span>EMP ID: ${query.leaves[i].empid}</span>
        <span>Reason: ${query.leaves[i].Reason}</span>
        <span>From: ${query.leaves[i].from.slice(0,10)}</span>
        <span>To: ${query.leaves[i].to.slice(0,10)}</span>
        <span>Team: ${query.leaves[i].team}</span>
    `
    leftarw.addEventListener("click", () => {
      if(i>0){
        i -= 1
      }
      else{
        i = query.leaves.length - 1
      }
      lvapel.innerHTML = `
        <span>EMP ID: ${query.leaves[i].empid}</span>
        <span>Reason: ${query.leaves[i].Reason}</span>
        <span>From: ${query.leaves[i].from.slice(0,10)}</span>
        <span>To: ${query.leaves[i].to.slice(0,10)}</span>
        <span>Team: ${query.leaves[i].team}</span>
      `
    })
    rightarw.addEventListener('click', () => {
      i = (i+1)%(query.leaves.length)
      lvapel.innerHTML = `
        <span>EMP ID: ${query.leaves[i].empid}</span>
        <span>Reason: ${query.leaves[i].Reason}</span>
        <span>From: ${query.leaves[i].from.slice(0,10)}</span>
        <span>To: ${query.leaves[i].to.slice(0,10)}</span>
        <span>Team: ${query.leaves[i].team}</span>
      `
    })
    aprovbtn.addEventListener('click', async () => {
      let lvapproval = await fetch('/lvaprov', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify({'empid' : query.leaves[i].empid})
      })
      let aprovresp = await lvapproval.json()
      if(aprovresp.approval == 'successful'){
        window.alert("Leave Approval Registered on the Server")
        query.leaves.splice(i, 1)
        i = (i+1)%(query.leaves.length)
        lvapel.innerHTML = `
          <span>EMP ID: ${query.leaves[i].empid}</span>
          <span>Reason: ${query.leaves[i].Reason}</span>
          <span>From: ${query.leaves[i].from.slice(0,10)}</span>
          <span>To: ${query.leaves[i].to.slice(0,10)}</span>
          <span>Team: ${query.leaves[i].team}</span>
        `
      }
    })
    denybtn.addEventListener('click', async () => {
      let lvdenial = await fetch('/lvdeny', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify({'empid' : query.leaves[i].empid})
      })
      let denresp = await lvdenial.json()
      if(denresp.denial == 'successful'){
        window.alert("Leave Denial Registered on the Server")
        query.leaves.splice(i, 1)
        i = (i+1)%(query.leaves.length)
        lvapel.innerHTML = `
          <span>EMP ID: ${query.leaves[i].empid}</span>
          <span>Reason: ${query.leaves[i].Reason}</span>
          <span>From: ${query.leaves[i].from.slice(0,10)}</span>
          <span>To: ${query.leaves[i].to.slice(0,10)}</span>
          <span>Team: ${query.leaves[i].team}</span>
        `
      }
    })
  }  

  empid.innerText += query.empid
  empidval = query.empid
  for ([key, value] of Object.entries(query.Gdet)) {
    if(key == "Full Name"){
      namevar = value
    }
    let field = document.createElement('div')
    field.classList.add('keyvalpair1')
    field.innerHTML = `
      <div class="label1"> ${key}</div>
      <div class="value1"> ${value} </div>
    `
    gendet.appendChild(field)
  }
  for ([key, value] of Object.entries(query.Odet)) {
    let field = document.createElement('div')
    field.classList.add('keyvalpair3')
    field.innerHTML = `
      <span class="label1"> ${key}</span>
      <span class="value1"> ${value} </span>
    `
    orgdet.appendChild(field)
  }
  for ([key, value] of Object.entries(query.Pdet)) {
    let field = document.createElement('div')
    field.classList.add('keyvalpair2')
    field.innerHTML = `
      <span class="label1"> ${key}</span>
      <span class="value1"> ${value} </span>
    `
    perdet.appendChild(field)
  }
  let lastmsgs = await fetch('/getmsg', {
    "method": 'POST',
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      'empid': empidval
    })
  })
  let msgstoshow = await lastmsgs.json()
  for(let i = (msgstoshow.msgs.length-1); i>=0; i--){
    let curdate = msgstoshow.msgs[i].date
    if(msgstoshow.msgs[i].empid == empidval){
      messages.insertAdjacentHTML('beforeend', `
      <div class="wholemsg">
        <div class="timings">${curdate.slice(0,10)}</div>
        <div class="msgs">${msgstoshow.msgs[i].msgcont}</div>
      </div>
      `)
    }
    else{
      messages.insertAdjacentHTML('beforeend', `
      <div class="wholemsg">
        <div class="msgo">
          <div class="msginfo">
          ${msgstoshow.msgs[i].ename}| ${msgstoshow.msgs[i].empid}
          </div>
          <div class="actmsg">
          ${msgstoshow.msgs[i].msgcont}
          </div>
        </div>
        <div class="timings">${curdate.slice(0,10)}</div>
      </div>
      `)
    }
  }
  message_area.scrollTop = message_area.scrollHeight;

  let checkch = await fetch("/checkch", {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'empid': empidval
    })
  })
  let chchresp = await checkch.json()
  if(chchresp.changes == 'found'){
    let tabch = document.createElement('table')
    let trh = document.createElement('tr')
    trh.innerHTML = `
      <td>Field</td>
      <td>Value</td>
      <td>Status</td>
    `
    tabch.appendChild(trh)
    let cptn = document.createElement('caption')
    cptn.innerText = "Your have Applied for the Following Changes"
    tabch.appendChild(cptn)

    for(let i=0; i<chchresp.reslt.length; i++){
      let trch = document.createElement('tr')
      trch.innerHTML = `
        <td>${chchresp.reslt[i].field}</td>
        <td>${chchresp.reslt[i].value}</td>
        <td>${chchresp.reslt[i].chstat}</td>
      `
      tabch.appendChild(trch)
    }
    chmenu.appendChild(tabch)
  }


  let checklv = await fetch("/checklv", {
    'method': "POST",
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'empid': empidval
    })
  })

  let lvresp = await checklv.json()
  if(lvresp.result == 'lvfound'){
    lvmenu.innerHTML = `
      <span>You already have a Leave Application Approved/Pending/Denied</span>
      <span>Reason: ${lvresp.query.Reason}</span>
      <span>From: ${lvresp.query.from.slice(0, 10)}</span>
      <span>To: ${lvresp.query.to.slice(0, 10)}</span>
      <span>Status: ${lvresp.query.lstat}</span>      
      <button id = "cancellv">Cancel Application</button>
    `
    let cancelbtn = document.getElementById("cancellv")
    cancelbtn.addEventListener("click", async() => {
      if(confirm("Are You Sure You want to Cancel this Applicaiton?")){
        let cancl = await fetch("/cancellv", {
          'method': 'POST',
          'headers': {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({
            'empid': empidval
          })
        })
        let cancresp = await cancl.json()
        if(cancresp.cancellation == 'done'){
          lvmenu.innerHTML = `
          <span>Your Leave Application has been cancelled</span>
          <span>Please Relogin to Apply for Another Leave</span>
          `
        }
      }
    })
  }
})

//${msgstoshow.msgs[i].msgcont}

let chead = document.getElementById('chead')
let chat = document.getElementById('chat')
let nmsg = document.getElementById('nmsg')
let droparrow2 = document.getElementById('droparrow2')

let tog2 = true

chead.addEventListener('click', () => {
  if (tog2) {
    chat.style.height = "50%"
    chat.style.minHeight = "500px"
    nmsg.style.display = "flex"
    droparrow2.style.transform = 'rotate(0deg)'
    tog2 = false
  }
  else {
    chat.style.height = "34px"
    chat.style.minHeight = "34px"
    droparrow2.style.transform = 'rotate(180deg)'
    nmsg.style.display = "none"
    tog2 = true
  }
})


const socket = io.connect('https://emploi-web-app.onrender.com', { transports : ['websocket'] });

const msginput = document.getElementById('msginput')
const mbtn = document.getElementById('mbtn')

mbtn.addEventListener("click", () => {
  let curdate = new Date()
  if(msginput.value != ""){
    socket.emit("newmsg", { 'val':msginput.value, 'empid': empidval, 'name': namevar})
    message_area.insertAdjacentHTML("beforeend", `
    <div class="wholemsg">
      <div class="timings">${curdate.getFullYear()}-${curdate.getMonth()+1}-${curdate.getDate()}</div>
      <div class="msgs">${msginput.value}</div>
    </div>
    `)
    msginput.value = ""
    message_area.scrollTop = message_area.scrollHeight;
  }
})

socket.on("nmessage", (msg) => {
  let curdate = new Date()
  message_area.insertAdjacentHTML("beforeend", `
    <div class="wholemsg">
      <div class="msgo">
        <div class="msginfo">
          ${msg.name} | ${msg.empid}
        </div>
      <div class="actmsg">
        ${msg.val}
      </div>
      </div>
      <div class="timings">${curdate.getFullYear()}-${curdate.getMonth()+1}-${curdate.getDate()}</div>
    </div>
  `)
  message_area.scrollTop = message_area.scrollHeight;
})
