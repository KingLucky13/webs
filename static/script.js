let regHide = document.getElementById("reg-form")
let entHide = document.getElementById("log-form");
function showReg(){
   regHide.hidden = false;
   entHide.hidden = true;
}

function showEnt(){
   regHide.hidden = true;
   entHide.hidden = false;
}