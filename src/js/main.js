import '../scss/battleships.scss';
import * as Data from "./data.js";
"use strict";

document.querySelector(".sysInfButton").addEventListener("click", function(){
	let sysInf = document.querySelector(".sysInformation");
	if ( sysInf.getAttribute("style") ) {
		sysInf.removeAttribute("style");
	} else {
		sysInf.setAttribute("style", "display:flex;");
	}
})

window.addEventListener("load", function(){
	// view.displayMessage("Сообщения успешно выводятся на экран.");
	// Data.view.displayMessage("");
	Data.model.createField();
	Data.model.createField("enemysField");
	// Data.controller.validateInput("A3");
	Data.model.deployShips();
}); 
