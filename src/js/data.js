export * from "./data";
export const view = {
    displayMessage: function(msg) {
        document.querySelector(".sysMessage").innerHTML = msg;
    },
    renderData: function(element, data) {
        document.querySelector(element).innerHTML = data;
    },
    displayHit: function(location, field = "enemysField") {
        let hit_cell = model.field[field].get(location);
        hit_cell.classList.add("hit");
        this.displayMessage("Вы попали во вражеский корабль!");
    },
    displayMiss: function(location, field = "enemysField") {
        let miss_cell = model.field[field].get(location);
        miss_cell.classList.add("miss");
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
    },

    createShip: function(){
        let shipLocations = [];

        let randomLetter = vertical_cells[controller.rand(0, this.options.boardSize - 1)];
        let randomDigit = controller.rand(1, this.options.boardSize);
        let position = randomLetter + randomDigit;

        let directions = {
        canMoveUp: true,
        canMoveDown: true,
        canMoveLeft: true,
        canMoveRight: true
        }
        
        if ( randomLetter === "A" ){
            directions.canMoveUp = false;
        } else if ( randomLetter === (this.current_vCells()[this.options.boardSize - 1]) ){
            directions.canMoveDown = false;
        }

        if ( randomDigit === 1 ){
            directions.canMoveLeft = false;
        } else if ( randomDigit === this.options.boardSize ){
            directions.canMoveRight = false;
        }

        if ( this.options.shipLength === 3 ){
            if ( randomLetter === "B" ){
                directions.canMoveUp = false;
            } else if ( randomLetter === (this.current_vCells()[this.options.boardSize - 2]) ){
            directions.canMoveDown = false;
            }
        }

        let avaliale_directions = [];
        for ( let key in directions ){
            if ( directions[key] == true ){
                avaliale_directions.push(key);
            }
        }

        let direction = avaliable_directions[controller.rand(0, avaliale_directions.length)];
        for( i = 0; i < shipLength; i++ ){
            shipLocations.push(position);
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
        }

        return shipLocations;

    },

    deployShips: function(){
        for( let i = 0; i < this.options.numShips; i++ ){
            this.shipLocations["enemysField"].set(`ship ${i}`, this.createShip());
        }
        
    }
}

export const controller = {

    rand: function(lowest, highest){
        let range = highest - lowest + 1;
        return lowest + Math.floor(Math.random() * range);
    },

    validateInput: function(input){
        let cell = model.field["enemysField"].get(input)
        if ( cell ) {
            console.log(cell);
            return cell;
        } else {
            console.log(input);
            view.displayMessage("Неправильные координаты.")
        }
    }

}
