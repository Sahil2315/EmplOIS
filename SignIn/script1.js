const username = document.getElementById('username1')
const password = document.getElementById('password1')

username.addEventListener('click', () => {
  username.style.border = "2px solid #909090"
})

password.addEventListener('click', () => {
  password.style.border = "2px solid #909090"
})

let clrbtn = document.getElementById('clearinp')
clrbtn.addEventListener('click', () => {
  username.value = ""
  password.value = ""
})

let loginfunction = async () => {
  let response = await fetch('/login', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
    },
    "body": JSON.stringify({
      "username": username.value,
      "password": password.value
    })
  })
  let admauth = await response.json()
  if (admauth.login == "failure") {
    window.alert('Wrong Credentials Entered')
    username.style.border = "3px solid red"
    password.style.border = "3px solid red"
  }
  else {
    sessionStorage.setItem("user", username.value);
    sessionStorage.setItem("pass", password.value);
    if (admauth.admin == "no") {
      window.location.href = window.location.origin + "/emplogin"
      sessionStorage.setItem("query", JSON.stringify(admauth))
    }
    else {
      window.location.href = window.location.origin + "/adminlogin"
      sessionStorage.setItem('obj', JSON.stringify(admauth))
    }
  }
}

const loginbtn = document.getElementById('loginbtn')

loginbtn.addEventListener('click', loginfunction)
window.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    loginfunction()
  }
})

const normauto = document.getElementById('normauto')
const admauto = document.getElementById('admauto')

normauto.addEventListener('click', () => {
  username.value = "RahulT224"
  password.value = "123RahulT"
})

admauto.addEventListener('click', () => {
  username.value = "RohanS148"
  password.value = "123RohanS"
})