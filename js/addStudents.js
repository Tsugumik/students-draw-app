const classCreationForm = document.getElementById("classCreationForm");
const studentCreationForm = document.getElementById("studentCreationForm");
const classCreationButton = document.getElementById("classCreationButton");
const classNameSelect = document.getElementById("classNameSelect");
const studentCreationButton = document.getElementById("studentCreationButton");
const studentViewForm = document.getElementById("studentViewForm");
const classNameSelectView = document.getElementById("classNameSelectView");
const studentsList = document.getElementById("studentsList");
const trashCans = document.querySelectorAll(".fa-trash");
const deleteClass = document.getElementById("deleteClass");

class SchoolClass{
    constructor(className, groupNumber){
        this.className = className;
        this.groupNumber = groupNumber;
        this.value = `${className} (${groupNumber})`;
    }
}
class Student{
    constructor(firstName, lastName, className){
        this.id=Date.now();
        this.firstName = firstName;
        this.lastName = lastName;
        this.className = className;
        this.full = `${firstName} ${lastName} ${className}`
    }
}
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

updateSelect();

async function getStudentData(){
    const firstName = studentCreationForm.firstName.value;
    const lastName = studentCreationForm.lastName.value;
    const className = studentCreationForm.classNameSelect.value;

    const student = new Student(firstName, lastName, className);
    return student;
}

async function getClassData(){
    const className = classCreationForm.className.value;
    const groupNumber = classCreationForm.groupNumber.value;
    
    const schoolClass = new SchoolClass(className, groupNumber);

    return schoolClass;
}

async function getStudents(classNameValue){
    const result = await studentsArray.filter(e=>{
        return e.className==classNameValue;
    });
    return result;
}

function syncLocalStorage(itemName){
    switch(itemName){
        case "students":{
            localStorage.setItem("students", JSON.stringify(studentsArray));
            break;
        }
        case "classes":{
            localStorage.setItem("classes", JSON.stringify(classesArray));
            updateSelect();
            break;
        }
    }
}

function updateSelect(){
    if(classNameSelectView){
        classNameSelectView.innerHTML="";
        const defaultOption = new Option("Choose a class", "");
        classNameSelectView.appendChild(defaultOption);
        classesArray.forEach(e=>{
            const className = e.value;
            const classOption = new Option(className, className);
            classNameSelectView.appendChild(classOption);
        });

        return;
    }
    classNameSelect.innerHTML="";
    const defaultOption = new Option("Choose a class", "");
    classNameSelect.appendChild(defaultOption);

    if(classesArray.length > 0){
        const defaultOption = new Option("Choose a class", ""); 
    }

    classesArray.forEach(e=>{
        const className = e.value;
        const classOption = new Option(className, className);
        classNameSelect.appendChild(classOption);
    });
}

function showConfirmation(which){
    switch(which){
        case "class":{
            document.querySelector(".classCreationConfirm").style.animation="opacityto1 3s ease"
            setTimeout(() => {
                document.querySelector(".classCreationConfirm").style.animation="";
            }, 3000);
            break;
        }
        case "student":{
            document.querySelector(".studentCreationConfirm").style.animation="opacityto1 3s ease"
            setTimeout(() => {
                document.querySelector(".studentCreationConfirm").style.animation="";
            }, 3000);
            break;
        }
    }
}

if(studentCreationForm){
    studentCreationForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        getStudentData().then(result=>{
            studentsArray.push(result);
            syncLocalStorage("students");
        });
        showConfirmation("student");
        studentCreationForm.reset();
    
    });
}

if(classCreationForm){
    classCreationForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        getClassData().then(result=>{
            classesArray.push(result);
            syncLocalStorage("classes");
        })
        showConfirmation("class");
        classCreationForm.reset();
    });
}

if(classNameSelectView){
    classNameSelectView.addEventListener("change", event=>{
        const classNameValue = event.target.value;
        studentsList.innerHTML="";
        getStudents(classNameValue).then(result=>{
            result.forEach(e=>{
                const li = document.createElement("li");
                const i = document.createElement("i");
                i.classList.add("fa-trash");
                i.classList.add("fa-solid");
                li.setAttribute("objectId", e.id);
                const liString = `${e.firstName} ${e.lastName} ${e.className}`;
                li.appendChild(document.createTextNode(liString));
                i.addEventListener("click", (event)=>{
                    const objId = event.target.parentElement.getAttribute("objectId");
                    studentsArray.splice(studentsArray.findIndex(el => e.id == el.id),1);
                    syncLocalStorage("students");
                    i.parentElement.remove();
                });
                li.appendChild(i);
                studentsList.appendChild(li);
            });
        })
        
    });
};

if(studentViewForm){
    studentViewForm.addEventListener("submit", event=>{
        event.preventDefault();
        const className  = event.target.classNameSelectView.value;
        classesArray.splice(studentsArray.findIndex(el=> el.value == className), 1);
        const studentsToDelete = studentsArray.filter(el=>{
            return el.className == className;
        });
        studentsToDelete.forEach(f => studentsArray.splice(studentsArray.findIndex(e => e.className == f.className)));
        syncLocalStorage("classes");
        syncLocalStorage("students");
        window.location.reload();
    });
}
