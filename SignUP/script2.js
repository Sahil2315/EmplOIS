let rkey = document.getElementById('rkey')
let empid = document.getElementById('empid')
let username2 = document.getElementById('username2')
let password2 = document.getElementById('password2')
let cpassword2 = document.getElementById('cpassword2')

let approved = true

empid.addEventListener('keyup', () => {
    if (empid.value.length != 8){
        empid.classList.add('no-match')
        approved = false
    }
    else{
        empid.classList.remove('no-match')
        approved = true
    }
})


cpassword2.addEventListener('keyup', () => {
    if (cpassword2.value != password2.value){
        cpassword2.classList.add('no-match')
        approved = false
    }
    else{
        cpassword2.classList.remove('no-match')
        approved = true
    }
})

let rbtn = document.getElementById('regbutton')

rbtn.addEventListener('click', async () => {
    if(approved){   
        let resp = await fetch('/signup', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "regkey": rkey.value,
                "empid": empid.value,
                "username": username2.value,
                "password": password2.value
            })
        })
        let reged = resp.json()
        if (reged.reg == "failure"){
            window.alert("Your Registration Process didn't go Correctly")
        }
        else{
            window.alert("You have Registered Successfully\nYou can Login now")
        }
    }
    else{
        window.alert("Please Recheck the Entry Format")
    }
})
