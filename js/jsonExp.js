const dataForm = document.getElementById("dataForm");
const jsonFileInput = document.getElementById("jsonFileInput");
const jsonFileInputButton = document.getElementById("jsonFileInputButton");
const dataImportForm = document.getElementById("dataImportForm");

const classesArray  = new Array();
const studentsArray = new Array();

if(localStorage.getItem("classes")){
    classesArray.push(...JSON.parse(localStorage.getItem("classes")));
} else {
    syncLocalStorage("classes");
    classesArray.push(...JSON.parse(localStorage.getItem("classes")));
}
if(localStorage.getItem("students")){
    studentsArray.push(...JSON.parse(localStorage.getItem("students")));
} else {
    syncLocalStorage("students");
    studentsArray.push(...JSON.parse(localStorage.getItem("students")));
}

const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
};

function syncLocalStorage(itemName){
    switch(itemName){
        case "students":{
            localStorage.setItem("students", JSON.stringify(studentsArray));
            break;
        }
        case "classes":{
            localStorage.setItem("classes", JSON.stringify(classesArray));
            break;
        }
    }
}

dataForm.addEventListener("submit", event=>{
    event.preventDefault();
    const dateObj = new Date();
    let dateString = `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
    const type = event.target.dataFormSelect.value;
    switch(type){
        case "all":{
            dateString+="-all.json";
            const allArray = new Array(classesArray, studentsArray);
            allArray.unshift({"type": "tsugumi.studentsRand/all"});
            saveTemplateAsFile(dateString, allArray);
            break;
        }
        case "students":{
            dateString+="-students.json";
            studentsArray.unshift({"type": "tsugumi.studentsRand/students"});
            saveTemplateAsFile(dateString, studentsArray);
            break;
        }
        case "classes":{
            dateString+="-classes.json";
            classesArray.unshift({"type": "tsugumi.studentsRand/classes"});
            saveTemplateAsFile(dateString, classesArray);
            break;
        }
    }
});

jsonFileInput.addEventListener("change", event=>{
    const fileToRead = event.target.files[0];
    const fileRead = new FileReader();
    fileRead.onload = function(e){
        const content = e.target.result;
        let loadedData;
        try{
            loadedData = JSON.parse(content);
        } catch(error){
            if(error="TypeError"){
                jsonFileInputButton.disabled = true;
            } else {
                jsonFileInputButton.disabled = true;
            }
            return;
        }
        
        if(loadedData[0].type){
            if(loadedData[0].type=="tsugumi.studentsRand/all" || loadedData[0].type=="tsugumi.studentsRand/students" || loadedData[0].type=="tsugumi.studentsRand/classes"){
                jsonFileInputButton.disabled=false;
            } else {
                jsonFileInputButton.disabled=true;
            }
        } else {
            jsonFileInputButton.disabled=true;
        }
    };
    fileRead.readAsText(fileToRead);
});

dataImportForm.addEventListener("submit", event=>{
    event.preventDefault();
    const fileToRead = event.target.jsonFileInput.files[0];
    const fileRead = new FileReader();
    fileRead.onload = function(e){
        const content = e.target.result;
        const loadedData = JSON.parse(content);
        const type = loadedData[0].type;
        loadedData.shift();
        switch(type){
            case "tsugumi.studentsRand/all":{
                studentsArray.push(...loadedData[1]);
                classesArray.push(...loadedData[0]);
                syncLocalStorage("students");
                syncLocalStorage("classes");
                break;
            }
            case "tsugumi.studentsRand/students":{
                studentsArray.push(...loadedData);
                syncLocalStorage("students");
                break;
            }
            case "tsugumi.studentsRand/classes":{
                classesArray.push(...loadedData);
                syncLocalStorage("classes");
                break;
            }
        }
        showConfirmation();
        event.target.reset();

    };
    fileRead.readAsText(fileToRead);
});

function showConfirmation(){
    document.querySelector(".importConfirmation").style.animation="opacityto1 3s ease";
    setTimeout(() => {
        document.querySelector(".importConfirmation").style.animation="";
    }, 3000);
}