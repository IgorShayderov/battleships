import '../scss/battleships.scss';
import * as Data from "./data.js";
"use strict";

let textPrompt = document.querySelector("#guessInput");
let buttonForShooting = document.querySelector(".shot");
let statisticsButton = document.querySelector(".sysInfButton");
let statistics = document.querySelector(".sysInformation");

statisticsButton.addEventListener("click", function(){
	if ( statistics.getAttribute("style") ) {
		statistics.removeAttribute("style");
	} else {
		statistics.setAttribute("style", "display:flex;");
	}
});

buttonForShooting.addEventListener("click", function(e){
	Data.controller.validateInput(textPrompt.value);
	textPrompt.value = "";
	buttonForShooting.setAttribute("disabled", "disabled");
});

textPrompt.addEventListener("keyup", function(e){
	if ( e.keyCode === 13 ) {	
		!buttonForShooting.dispatchEvent(new MouseEvent('click'));
	}
	if ( this.value.length === 2 ){
		console.log("Length is 2!");
		buttonForShooting.removeAttribute("disabled");
	} 
});

window.addEventListener("load", function(){
	try {
		// view.displayMessage("Сообщения успешно выводятся на экран.");
		// Data.view.displayMessage("");
		Data.model.createField();
		Data.model.createField("enemysField");
		// Data.controller.validateInput("A3");
		Data.model.deployShips();
	} catch(e){
		console.log(e);
	}
}); 

// Создание корабля это цикл. 
// Он выполняется до условия когда кораблю будут присвоены локации.
// Если локация не проходит валидацию, то цикл начинается снова.