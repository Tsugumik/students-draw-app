const acceptRules = document.getElementById("acceptRules");
const acceptRulesButton = document.getElementById("acceptRulesButton");

if(localStorage.getItem("rules")){
    if(localStorage.getItem("rules")=="accept"){
        acceptRules.style.display="none";
        acceptRulesButton.style.display="none";
    }
}

acceptRulesButton.addEventListener("click", ()=>{
    localStorage.setItem("rules", "accept");
    window.location.reload();
});