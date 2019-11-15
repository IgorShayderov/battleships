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
});

textPrompt.addEventListener("keyup", function(e){
	if ( e.keyCode === 13 ) {	
		!buttonForShooting.dispatchEvent(new MouseEvent('click'));
	}
	if ( this.value.length === 2 ){
		buttonForShooting.removeAttribute("disabled");
	} else {
		buttonForShooting.setAttribute("disabled", "disabled");
	}
});

window.addEventListener("load", function(){
	try {
		Data.model.createField();
		Data.model.createField("enemysField");
		Data.model.deployShips();
		Data.controller.cheat();
	} catch(e){
		console.log(e);
	}
}); 
