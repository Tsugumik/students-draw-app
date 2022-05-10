if(localStorage.getItem("rules")){
    if(!(localStorage.getItem("rules")=="accept")){
        window.location.replace("./information.html");
    }
} else {
    window.location.replace("./information.html");
}