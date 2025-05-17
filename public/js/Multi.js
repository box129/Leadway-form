const forms = document.querySelectorAll(".form");
const steps = document.querySelectorAll(".step");
const progressBar = document.querySelector(".progress-bar");

let currentStep = 1;

progressBar.style.width = 10 + "%";

function goToNextStep(){
    if (currentStep < forms.length - 1) {
        forms[currentStep].classList.remove("active");
        steps[currentStep].classList.remove("active");
        currentStep++;
        forms[currentStep].classList.add("active");
        steps[currentStep].classList.add("active");

        let progress = ((currentStep + 1) / forms.length) * 100;
        progressBar.style.width = progress + "%";
    }
}

document.getElementById("next1").addEventListener("click", goToNextStep);
document.getElementById("next2").addEventListener("click", goToNextStep);
document.getElementById("next3").addEventListener("click", goToNextStep);
document.getElementById("next4").addEventListener("click", goToNextStep);
document.getElementById("next5").addEventListener("click", goToNextStep);
document.getElementById("next6").addEventListener("click", goToNextStep);



