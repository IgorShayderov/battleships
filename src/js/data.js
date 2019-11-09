export * from "./data";

export const view = {
    displayMessage: function(msg) {
        document.querySelector(".sysMessage").innerHTML = msg;
    },
    renderData: function(element, data) {
        document.querySelector(element).innerHTML = data;
    },
    displayHit: function(location, field = "enemysField") {
        location.classList.add("hit");
        this.displayMessage("Вы попали во вражеский корабль!");
    },
    displayMiss: function(location, field = "enemysField") {
        location.classList.add("miss");
        this.displayMessage("Вы промахнулись!");
    }
};

export const model = {

    options: {
        boardSize: 7, // от 7 до 9
        numShips: 3,
        shipLength: 3
    },

    information: {
        total_shots: 0,
        hits: 0,
        misses: 0,
        ships_left: 0,
        shipsSunk: 0
    },

    shipLocations: {
        "yourShips": new Map(),
        "enemysShips": new Map()
    },

    field: {
        "yourField": new Map(),
        "enemysField": new Map()
    },
    
    vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],

    current_vCells: function(){
        let array = this.vertical_cells;
        array.length = this.options.boardSize;
        return array;
    },

    createField: function(field = "yourField"){
        let letter_index = 0;
        let digit_index = 0;
        let base = document.querySelector("." + field);

        for( let i = 0; i < Math.pow(this.options.boardSize, 2); i++ ){
            let cell = document.createElement("div");
            if( i % this.options.boardSize === 0 ) {
                letter_index = 0;
                digit_index++;
                var row = document.createElement("div");
                row.classList.add("newCol");
                base.appendChild(row)
            }
            let cellNum = this.vertical_cells[letter_index] + digit_index;
            this.field[field].set(cellNum, cell);
            cell.innerHTML = cellNum;
            cell.classList.add("cell");
            row.appendChild(cell);
            letter_index++;
        }

        console.log(this.field[field]);
    },

    createShip: function(){
        let shipLocations = [];

        let randomLetter = this.vertical_cells[controller.rand(0, this.options.boardSize - 1)];
        let randomDigit = controller.rand(1, this.options.boardSize);
        let position = randomLetter + randomDigit;
        console.log("Starting position: " + position);
        let directions = {
        canMoveUp: true,
        canMoveDown: true,
        canMoveLeft: true,
        canMoveRight: true
        }
        console.log("Char At 0: " + position.charAt(0));
        console.log("Char At 1: " + position.charAt(1));
        if ( position.charAt(0) === "A" ){
            directions.canMoveUp = false;
        } else if ( position.charAt(0) === (this.current_vCells()[this.options.boardSize - 1]) ){
            directions.canMoveDown = false;
        }

        if ( position.charAt(1) === "1" ){
            directions.canMoveLeft = false;
        } else if ( position.charAt(1) === `${this.options.boardSize}` ){
            directions.canMoveRight = false;
        }

        if ( this.options.shipLength === 3 ){
            if ( position.charAt(0) === "B" ){
                directions.canMoveUp = false;
            } else if ( position.charAt(0) === (this.current_vCells()[this.options.boardSize - 2]) ){
                directions.canMoveDown = false;
            }

            if( position.charAt(1) === "2" ){
                directions.canMoveLeft = false;
            } else if ( position.charAt(1) === `${(this.options.boardSize - 1)}` ){
                directions.canMoveRight = false;
            }
        }

        let avaliable_directions = [];
        for ( let key in directions ){
            if ( directions[key] == true ){
                avaliable_directions.push(key);
            }
        }
        console.log(avaliable_directions);
        let arrayItemNum = controller.rand(0, ( avaliable_directions.length - 1 ) );
        console.log("Random digit for direction is: " + arrayItemNum);
        let direction = avaliable_directions[arrayItemNum];
        console.log("Direction is: " + direction);
        console.log("Ship length: " + this.options.shipLength);
        for( let i = 0; i < this.options.shipLength; i++ ){
            shipLocations.push(position);
            if ( shipLocations.length === this.options.shipLength ) { break; }
            switch (direction){
                case "canMoveUp":
                position = this.current_vCells()[this.current_vCells().indexOf(position.charAt(0)) - 1 ] + position.charAt(1);
                break;
                case "canMoveDown":
                position = this.current_vCells()[this.current_vCells().indexOf(position.charAt(0)) + 1 ] + position.charAt(1);
                break;
                case "canMoveLeft":
                position = position.charAt(0) + (parseInt(position.charAt(1)) - 1);
                break;
                case "canMoveRight":
                position = position.charAt(0) + (parseInt(position.charAt(1)) + 1);
            }
            console.log("New position is: " + position);
        }
        shipLocations.forEach(function(elem, index){
            console.log(index + " : " + elem);
        });
        return shipLocations;

    },

    deployShips: function(){
        for( let i = 0; i < this.options.numShips; i++ ){
            this.shipLocations["enemysShips"].set(`ship ${i}`, this.createShip());


            console.log("*******************************************");
        }
        console.log(this.shipLocations);
    }
}

export const controller = {

    rand: function(lowest, highest){
        let range = highest - lowest + 1;
        return lowest + Math.floor(Math.random() * range);
    },

    validateInput: function(input){
        input = input.charAt(0).toUpperCase() + input.charAt(1);
        let cell = model.field["enemysField"].get(input); 

        if ( cell ) {
            console.log(cell);
            return this.processInput(cell);
        } else {
            console.log(input);
            view.displayMessage("Неправильные координаты.");
            throw new Error("Неправильные координаты.");
        }
    },

    processInput: function(cell){
        if ( cell ){
            view.displayMessage("Вы попали во вражеский корабль!");
            view.displayHit(cell);
        } else {
            view.displayMiss(cell);
            view.displayMessage("Промах!");
        }
    }

}

