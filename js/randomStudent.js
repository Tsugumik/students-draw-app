const randomStudentForm = document.getElementById("randomStudentForm");
const randomStudentSelect = document.getElementById("randomStudentSelect");
const randomStudentName = document.getElementById("randomStudentName");
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

async function getRandomStudent(classNameValue){
    const students = await studentsArray.filter(e=>{
        return e.className == classNameValue;
    });
    const totalNumberOfStudents = students.length;
    if(totalNumberOfStudents > 1){
        const uri = `https://www.random.org/integers/?num=1&min=0&max=${totalNumberOfStudents-1}&col=1&base=10&format=plain&rnd=new`;
        const response = await fetch(uri);
        const studentNumber = await response.text();
        const studentInt = parseInt(studentNumber);
        console.log(studentInt);
        return students[studentInt].full;
    } else if(totalNumberOfStudents == 1){
        return students[0].full;
    } else {
        return "Choose a class with at least one student!";
    }
    
}

function updateSelect(){
    if(randomStudentSelect){
        randomStudentSelect.innerHTML="";
        const defaultOption = new Option("Choose a class", "");
        randomStudentSelect.appendChild(defaultOption);
        classesArray.forEach(e=>{
            const className = e.value;
            const classOption = new Option(className, className);
            randomStudentSelect.appendChild(classOption);
        });

        return;
    }
}
updateSelect();

randomStudentForm.addEventListener("submit", event=>{
    event.preventDefault();
    randomStudentName.innerText="Wait..."
    const classNameValue = event.target.randomStudentSelect.value;
    getRandomStudent(classNameValue).then(result=>{
        randomStudentName.innerText=result;
    });
});