// CHANGE PINS HERE
const ADMIN_PIN = "1234";
const STAFF_PIN = "5678";

function login(){
  const pin = document.getElementById("pin").value;
  const error = document.getElementById("error");

  if(pin === ADMIN_PIN){
    localStorage.setItem("role","admin");
    window.location.href = "dashboard.html";
  }
  else if(pin === STAFF_PIN){
    localStorage.setItem("role","staff");
    window.location.href = "dashboard.html";
  }
  else{
    error.style.display = "block";
  }
}
