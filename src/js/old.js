
model.deployShips();
	controller.fill_the_fields();
	controller.prepareGame();
	var ships_amount = $("#your_ships").text();
//установка кораблей
	$("#enemys_field").on("click", "td[id]",function(){
		$(this).not('.placed').toggleClass('selected');
		if ($(".selected").length === 3){
			$("#confirm").css("display", "inline-block");

		};
		if ($(".selected").length !== 3){
			$("#confirm").css("display", "none");
		}
	});

//события
	$("#confirm").on("click", function(){
		if () {
			
		}
		$(".selected").addClass("placed").removeClass("selected");
		view.displayMessage("Корабль успешно установлен!");
		$("#confirm").css("display", "none");
		ships_amount--;
		$("#your_ships").text(ships_amount);
		if (ships_amount === 0){
			$(this).off("click");
			$("#enemys_field").off("click");
			controller.startGame();
		}
	})

	$("#shot").on("click", function () {
		controller.processGuess(document.getElementById('guessInput').value);
		controller.fill_the_fields();
		$("#guessInput").val("");
		});

	$("#guessInput").on("keypress", function (e) {
		if (e.keyCode === 13) {
		document.getElementById("shot").click();
		return false;
	}
	});

	var view = {
		displayMessage: function(msg) {
			$('#message').text(msg);
		},
		displayHit: function(location) {
			$("#"+location).attr("class", "hit");
			$("#"+location).text("HIT");
			this.displayMessage("Вы попали во вражеский корабль!");
		},
		displayMiss: function(location) {
			$("#"+location).attr("class", "miss");
			$("#"+location).text("MISS");
			this.displayMessage("Вы промахнулись!");
		}
	};
	
	var model = {
	boardSize: 9,
	numShips: 5,
	shipLength: 3,
	shipsSunk: 0,
	
	hits: 0,
	misses: 0,
	
	vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
	hitted_cells: [],
	
	ships: [],
	
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
	
				var firstLocation = this.vertical_cells[first] + second;
				var left_right; // 0 left 1 right
				var up_down; // 0 up 1 down
					if (direction === 1) {
						var letter = firstLocation.charAt(1);
						if (letter === "1" || letter === "2") {
							left_right = 1;
						} else if (letter === "9" || letter === "8") {
							left_right = 0;
						} else {
							left_right = Math.floor(Math.random() * 2);
						}
					} else if (direction === 0) {
						var digit = firstLocation.charAt(0);
						if (digit === "A" || digit === "B") {						
							up_down = 1;
						} else if (digit === "I" || digit === "H") {
							up_down = 0;
						} else {
							up_down = Math.floor(Math.random() * 2);
						}
					}	
					//запихивает корабль в локации
					cur_loc = firstLocation;
					for (i = 0; i < ships[num].location.length+1; i++){
						
						
						//проверка на совпадение локаций
						for (var y = 0; y < num; y++) {
							for (var l = 0; l < ships[y].location.length; l++) {
								if (ships[y].location[l] === cur_loc) {
									x -= 1;
									return;
								}
							}
						}
						if (i > ships[num].location.length - 1) {
							break;
						}
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
				for (x = 0; x < this.numShips; x++) {
					this.ships[x] = { location: [0, 0, 0], hits: ["","",""]};
					this.deployShip(x, this.ships);
				};
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
				if (guess === null || guess.length !==2 || guess.charAt(1) === "0"){
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
	
		fill_the_fields: function() {
		$("#total_shots").text(controller.guesses);
		$("#hits").text(model.hits);
		$("#misses").text(model.misses);
		$("#hits_left").text(model.numShips * 3);	
		$("#your_ships").text(model.numShips);
	},
	
		prepareGame: function(){
		$("#restart_game").attr('disabled', 'disabled').addClass('closed');
		$("label font").css("color", "black");
		$("#guessInput").attr('disabled', 'disabled').addClass('closed');
		$("#shot").attr('disabled', 'disabled').addClass('closed');
		view.displayMessage("Расставьте свои корабли на правом поле");
		},
	
		startGame: function(){
		$("#restart_game").removeAttr("disabled").removeClass('closed');
		$("label font").css("color","white");
		$("#guessInput").removeAttr('disabled').removeClass('closed');
		$("#shot").removeAttr('disabled').removeClass('closed');
		$("#your_ships").parent().css('display', 'none');
		view.displayMessage("Начало игры");
		}
	
	};
	
	
	
<tr> <td class='literal'>A</td> <td id='A1' class='field'></td> <td id='A2' class='field'></td> <td id='A3' class='field'></td> <td id='A4' class='field'></td> <td id='A5' class='field'></td> <td id='A6' class='field'></td> <td id='A7' class='field'></td> <td id='A8' class='field'></td> <td id='A9' class='field'></td> </tr>

<tr> <td class='literal'>B</td> <td id='B1' class='field'></td> <td id='B2' class='field'></td> <td id='B3' class='field'></td> <td id='B4' class='field'></td> <td id='B5' class='field'></td> <td id='B6' class='field'></td> <td id='B7' class='field'></td> <td id='B8' class='field'></td> <td id='B9' class='field'></td> </tr>

<tr> <td class='literal'>C</td> <td id='C1' class='field'></td> <td id='C2' class='field'></td> <td id='C3' class='field'></td> <td id='C4' class='field'></td> <td id='C5' class='field'></td> <td id='C6' class='field'></td> <td id='C7' class='field'></td> <td id='C8' class='field'></td> <td id='C9' class='field'></td> </tr>

<tr> <td class='literal'>D</td> <td id='D1' class='field'></td> <td id='D2' class='field'></td> <td id='D3' class='field'></td> <td id='D4' class='field'></td> <td id='D5' class='field'></td> <td id='D6' class='field'></td> <td id='D7' class='field'></td> <td id='D8' class='field'></td> <td id='D9' class='field'></td> </tr>	

<tr> <td class='literal'>E</td> <td id='E1' class='field'></td> <td id='E2' class='field'></td> <td id='E3' class='field'></td> <td id='E4' class='field'></td> <td id='E5' class='field'></td> <td id='E6' class='field'></td> <td id='E7' class='field'></td> <td id='E8' class='field'></td> <td id='E9' class='field'></td> </tr>

<tr> <td class='literal'>F</td> <td id='F1' class='field'></td> <td id='F2' class='field'></td> <td id='F3' class='field'></td> <td id='F4' class='field'></td> <td id='F5' class='field'></td> <td id='F6' class='field'></td> <td id='F7' class='field'></td> <td id='F8' class='field'></td> <td id='F9' class='field'></td> </tr>	

<tr> <td class='literal'>G</td> <td id='G1' class='field'></td> <td id='G2' class='field'></td> <td id='G3' class='field'></td> <td id='G4' class='field'></td> <td id='G5' class='field'></td> <td id='G6' class='field'></td> <td id='G7' class='field'></td> <td id='G8' class='field'></td> <td id='G9' class='field'></td> </tr>

<tr> <td class='literal'>H</td> <td id='H1' class='field'></td> <td id='H2' class='field'></td> <td id='H3' class='field'></td> <td id='H4' class='field'></td> <td id='H5' class='field'></td> <td id='H6' class='field'></td> <td id='H7' class='field'></td> <td id='H8' class='field'></td> <td id='H9' class='field'></td> </tr>

<tr> <td class='literal'>I</td> <td id='I1' class='field'></td> <td id='I2' class='field'></td> <td id='I3' class='field'></td> <td id='I4' class='field'></td> <td id='I5' class='field'></td> <td id='I6' class='field'></td> <td id='I7' class='field'></td> <td id='I8' class='field'></td> <td id='I9' class='field'></td> </tr>

<tr> <td></td> <td class='figure'>1</td> <td class='figure'>2</td> <td class='figure'>3</td> <td class='figure'>4</td> <td class='figure'>5</td> <td class='figure'>6</td> <td class='figure'>7</td> <td class='figure'>8</td> <td class='figure'>9</td> </tr>	