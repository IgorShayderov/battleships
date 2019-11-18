import '../scss/battleships.scss';
import * as Data from "./data.js";
"use strict";

let textPrompt = document.querySelector("#guessInput");
let buttonForShooting = document.querySelector(".shot");
let statisticsButton = document.querySelector(".sysInfButton");
let statistics = document.querySelector(".sysInformation");
let yourField = document.querySelector(".yourField");
let confirm = document.querySelector(".confirm");

let canPickShip = true;
let pickedCells = document.querySelectorAll(".yourField div.picked");
// let shipsAmount = Data.model.options.numShips;

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

yourField.addEventListener("click",function(e){

	if ( e.target.classList.contains("cell") && 
	!(e.target.classList.contains("mounted") ||
	e.target.classList.contains("yourOutskirt") 
	) ){
		if ( e.target.classList.contains("picked") ){
			e.target.classList.remove("picked");
		} else if ( canPickShip ){
			e.target.classList.add("picked");
		}
	}
	pickedCells = document.querySelectorAll(".yourField div.picked");

	if ( pickedCells.length === 3 ){
		canPickShip = false;
		confirm.removeAttribute("disabled");
	} else if ( pickedCells.length < 3 ){
		canPickShip = true;
		confirm.setAttribute("disabled", "disabled");
	}	
})

confirm.addEventListener("click", function(){
	Data.controller.validatePick(pickedCells);
	confirm.setAttribute("disabled", "disabled");
})

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
