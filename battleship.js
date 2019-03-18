var view = {
	displayMessage: function(msg) {
		document.getElementById('message').innerHTML = msg;
	},
	displayHit: function(location) {
		document.getElementById(location).setAttribute("class", "hit");
		document.getElementById(location).innerHTML= "HIT";
		this.displayMessage("Вы попали во вражеский корабль!");
	},
	displayMiss: function(location) {
		document.getElementById(location).setAttribute("class", "miss");
		document.getElementById(location).innerHTML = "MISS";
		this.displayMessage("Вы промахнулись!");
	}
};

var model = {
boardSize: 9,
numShips: 3,
shipLength: 3,
shipsSunk: 0,

hits: 0,
misses: 0,
hits_left: 9,

vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
hitted_cells: [],

ships: [{ location: [0, 0, 0], hits: ["","",""]},
		 { location: [0, 0, 0], hits: ["","",""]},
		 { location: [0, 0, 0], hits: ["","",""]}],

foe_ships: [{ location: [0, 0, 0], hits: ["","",""]},
		 	{ location: [0, 0, 0], hits: ["","",""]},
		 	{ location: [0, 0, 0], hits: ["","",""]}],

		 fire: function(guess) {
		 	for (var i = 0; i < this.numShips; i++) {
		 		var ship = this.ships[i];		 	
		 	
		 		for (var x = 0; x < this.shipLength; x++) {
		 			if (ship.location[x] === guess) {
		 			view.displayHit(ship.location[x]);
		 			ship.hits[x] = 'hit';
		 			this.hits++
		 			this.hits_left--
		 				if (this.isSunk(ship)) {
		 				view.displayMessage("Вы потопили вражеский корабль.");
		 				this.shipsSunk++;
		 				}
		 				
		 			return true;
					}
					
		 		}	
		 	}
		 view.displayMiss(guess);
		 view.displayMessage("Промах.");
		 this.misses++
		 return false;
		},

		isSunk: function(ship) {
			for (var i = 0; i < this.shipLength; i++) {
				if (ship.hits[i] !== "hit") {
					return false;
				}
			}
			return true;
		},


		// 2 арг ships или foe_ships
			deployShip: function(num, ships) {

			

			function rand_letter() {
			result =  Math.floor(Math.random() * 9);
			return result;
			}

			function rand_digit() {
			result =  Math.ceil(Math.random() * 9);
			return result;
			}

			var first = rand_letter();
			var second = rand_digit();
			var direction = Math.floor(Math.random() * 2) // 0 horizontal 1 vertical
			console.log("direction is " + direction);
			console.log(first);
			console.log(second);
			var firstLocation = this.vertical_cells[first] + second;
			console.log(firstLocation + ' is first location')
			var left_right; // 0 left 1 right
			var up_down; // 0 up 1 down
				if (direction === 1) {
					var letter = firstLocation.charAt(1);
					if (letter === "1" || letter === "2") {
						left_right = 1;
					} else if (letter === "9" || letter === "8") {
						left_right = 0;
					} else {
						console.log("random!");
						left_right = Math.floor(Math.random() * 2);
					}
				} else if (direction === 0) {
					var digit = firstLocation.charAt(0);
					if (digit === "A" || digit === "B") {						
						up_down = 1;
					} else if (digit === "I" || digit === "H") {
						up_down = 0;
					} else {
						console.log("random!");
						up_down = Math.floor(Math.random() * 2);
					}
				}
					console.log("left_right is " + left_right);
					console.log("up_down is " + up_down);	
				//запихивает корабль в локации
				cur_loc = firstLocation;
				for (i = 0; i < ships[num].location.length+1; i++){
					
					
					//проверка на совпадение локаций
					for (var y = 0; y < num; y++) {
						for (var l = 0; l < ships[y].location.length; l++) {
							console.log("Verifying location: " + ships[y].location[l] + " and current loc: " + cur_loc);
							if (ships[y].location[l] === cur_loc) {
								console.log("Colission detected!");
								x -= 1;
								return;
							}
						}
					}
					console.log("I is: " + i + " length is " + ships[num].location.length);
					if (i > ships[num].location.length - 1) {
						console.log("BREEEEEEEEEEEEEEEEAK!!!!");
						break;
					}
					console.log('Location: '+ cur_loc);
					ships[num].location[i] = cur_loc;
					//left
					if (left_right === 0) {
					cur_loc = cur_loc.charAt(0) + (parseInt(cur_loc.charAt(1)) - 1);
					}
					//right
					if (left_right === 1) {
					cur_loc = cur_loc.charAt(0) + (parseInt(cur_loc.charAt(1)) + 1);
					}
					//up
					if (up_down === 0) {
					cur_loc = this.vertical_cells[this.vertical_cells.indexOf(cur_loc.charAt(0)) - 1] + cur_loc.charAt(1);
					}
					//down
					if (up_down === 1) {
					cur_loc = this.vertical_cells[this.vertical_cells.indexOf(cur_loc.charAt(0)) + 1] + cur_loc.charAt(1);
					}					
				}
			}, // конец функции deployShip

		deployShips: function() {
		 	console.log("Starting deploying.");
			for (x = 0; x < this.numShips; x++) {
				console.log("Deploying ship: " + (x + 1));
				this.deployShip(x, this.ships);
			}
			console.log("Ending deploying...");
		},
		
	};  

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = this.parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);	
			model.hitted_cells.push(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Вы потопили все корабли.");
				var shot = document.querySelector("#shot");
				shot.setAttribute('disabled', 'disabled');
				shot.style.color = "black";
			}
		}
	
},

 	parseGuess: function(guess) {
 		guess = guess.toUpperCase();

			if (guess === null || guess.length !==2){
				alert("Неправильный ввод координат."); 
				return false;
			}

			for(var i = 0; i < model.hitted_cells.length; i++){
				if (guess === model.hitted_cells[i]) {
					alert("Вы уже стреляли в эту позицию");
					return false;
				}
			}
			for(var i = 0; i < model.vertical_cells.length; i++){
				if (model.vertical_cells[i] === guess.charAt(0)) {
 					return guess;
 				} 
 				if (i === model.vertical_cells.length-1){
 					alert("Неправильный ввод координат."); 
					return false;
 				}
			}
		},


	addEventListenerList: function(list, event, action) {
		for (var i = 0; i < list.length; i++) {
			list[i].addEventListener(event, action);
		}
	}

};

//////////////////////////
function Popup () {

this.open = function(){

}

this.close = function(){

}

}

var popUp = new Popup;
//////////////////////////

function fill_the_fields () {
	document.getElementById("total_shots").innerHTML = controller.guesses;
	document.getElementById("hits").innerHTML = model.hits;
	document.getElementById("misses").innerHTML = model.misses;
	document.getElementById("hits_left").innerHTML = model.hits_left;
}

window.onload = function() {
	model.deployShips();

	//alert("Расставьте корабли на правом поле.");



	controller.addEventListenerList(document.querySelectorAll("#enemys_field td"),'click', function(){
		this.classList.add('selected');
	});

	document.querySelector("#shot").addEventListener('click', function () {
		controller.processGuess(document.getElementById('guessInput').value);
		fill_the_fields();
		document.querySelector("#guessInput").value = ""
		})

	document.getElementById("guessInput").onkeypress = function (e) {
		if (e.keyCode === 13) {
		document.getElementById("shot").click();
		return false;
	}
	}
}