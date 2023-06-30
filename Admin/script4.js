let parnt = document.getElementById('adm')

let empidval = 'adm00001'
let namevar = "Rohan Sharma"

let chapel = document.getElementById('chapel')
let leftarw = document.getElementById('lftarrow')
let rightarw = document.getElementById('rghtarrow')

let chdisp = document.getElementById('chdisp')
let chapps = document.getElementById('chapps')
let approvch = document.getElementById('approvch')
let chbtn = document.getElementById('chapprove')

let navchap = document.getElementById('navchap')
let tog3 = false

navchap.addEventListener('click', () => {
  if(!tog3){
    approvch.style.display = 'flex'
    tog3 = true
  }
  else{
    approvch.style.display = 'none'
    tog3 = false
  }
})

window.addEventListener('load', async () => {

  let query1 = JSON.parse(localStorage.getItem('allrows'))
  let rows = query1.cont
  for (let i = 0; i < rows.length; i++) {
    let nele = document.createElement('tr')
    for ([key, value] of Object.entries(rows[i])) {
      if (key == "dob" || key == "doj") {
        let innerele = document.createElement('td')
        innerele.innerText = value.slice(0, 10)
        innerele.classList.add('admincols')
        nele.appendChild(innerele)
      }
      else {
        let innerele = document.createElement('td')
        innerele.innerText = value
        innerele.classList.add('admincols')
        nele.appendChild(innerele)
      }
    }
    nele.classList.add('adminrows')
    parnt.appendChild(nele)
  }

  btnfun = async (i) => {
    let chaprov = await fetch('/chaprov', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'empid': changerows[i].empid,
        'field': changerows[i].field
      })
    })
    let chapjson = await chaprov.json()
    if(chapjson.approval == 'successful'){
      window.alert('The Changes have been Applied')
      document.querySelectorAll('.chrows')[i].style.display = 'none'
      query1.change.splice(i,1)
      changerows.splice(i,1)
    }
  }
  btnfun2 = async (i) => {
    let chdeny = await fetch('/chdeny', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'empid': changerows[i].empid,
        'field': changerows[i].field
      })
    })
    let chdnjson = await chdeny.json()
    if(chdnjson.denial == 'successful'){
      window.alert('The Changes have been Applied')
      document.querySelectorAll('.chrows')[i].style.display = 'none'
      query1.change.splice(i,1)
      changerows.splice(i,1)
    }
  }
  let changerows = query1.change
  if(changerows.length == 0){
    chapps.innerHTML = '<h2>No changes are Pending</h2>'
  }
  else{
    for(let i=0; i<changerows.length; i++){
      chapel.innerHTML += `
        <div class = "chrows"> 
          <span>${changerows[i].empid}</span>
          <span>${changerows[i].field}</span>
          <span>${changerows[i].value}</span>
          <button class="chapbtn" onClick = "btnfun(${i})" >Approve</button> 
          <button class="chapbtn" onClick = "btnfun2(${i})" >Deny</button> 
        </div>
      `
      
    }
  }  
})

let empsrch = document.getElementById('empsrch')
let empsbtn = document.getElementById('empsbtn')
let admcont = document.querySelector('.admcont')

let labels = ['EmpID', 'Name', 'DOB', 'Email', 'Phone', 'C.Address', 'P.Address', 'Adhr Card', 'UPI', 'Dept', 'Title', 'Joined', 'Salary','', 'RegKey', 'Laptop', 'Leaves', 'Gender', 'Team']

empsbtn.addEventListener('click', () => {
  let searched = false
  let newempid = empsrch.value
  let trall = parnt.querySelectorAll('tr')
  for(let i=1; i< trall.length; i++){
    let tdall = trall[i].querySelectorAll('td')
    if(tdall[0].innerText == newempid || tdall[0].textContent == newempid){
      trall[0].style.display = 'none'
      let newgrid = document.createElement('div')
      newgrid.classList.add('newgrid')
      for(j=0; j< tdall.length; j++){
        if(j == 13) continue
        let ngitem = document.createElement('div')
        ngitem.classList.add('newgriditem')
        ngitem.innerText = `${labels[j]}: ${tdall[j].innerText}`
        newgrid.appendChild(ngitem)
      }
      admcont.removeChild(admcont.children[0])
      admcont.appendChild(newgrid)
      searched = true
    }
  }
  if(!searched){
    window.alert('No Such Items Found')
  }
})

let backaro = document.getElementById('backtonormal')

backaro.addEventListener('click', () => {
  admcont.removeChild(admcont.children[0])
  admcont.appendChild(parnt)
})