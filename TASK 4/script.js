function showRegister(){
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('registerBox').classList.remove('hidden');
}
function showLogin(){
    document.getElementById('registerBox').classList.add('hidden');
    document.getElementById('loginBox').classList.remove('hidden');
}

function register(){
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    const pass2 = document.getElementById("regPassword2").value;
    const msg = document.getElementById("regMsg");

    if(pass !== pass2){
        msg.textContent = "Passwords do not match";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "{}");
    if(users[email]){
        msg.textContent = "User already exists!";
        return;
    }

    users[email] = {password:pass};
    localStorage.setItem("users", JSON.stringify(users));
    
    msg.style.color = "lightgreen";
    msg.textContent = "Registered successfully! Redirecting...";

    setTimeout(()=> showLogin(), 1000);
}

function login(){
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");

    let users = JSON.parse(localStorage.getItem("users") || "{}");

    if(!users[email]){
        msg.textContent = "User not found!";
        return;
    }
    if(users[email].password !== pass){
        msg.textContent = "Incorrect password!";
        return;
    }

    msg.style.color = "lightgreen";
    msg.textContent = "Login successful! Redirecting...";

    localStorage.setItem("authUser", email);

    setTimeout(()=> window.location = "dashboard.html", 800);
}
