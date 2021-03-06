export * from "./data";

export const view = {
    displayMessage: function(msg) {
        document.querySelector(".sysMessage").innerHTML = msg;
    },
    renderData: function(element, data) {
        element.innerHTML = data;
    },
    displayHit: function(location, field = "enemysField") {
        location.classList.add("hit");
    },
    displayMiss: function(location, field = "enemysField") {
        location.classList.add("miss");
    }
};

export const model = {
    options: {
        boardSize: 7, 
        numShips: 3,
        shipLength: 3
    },

    information: {
        mountedShips: 0,
        total_shots: 0,
        hits: 0,
        misses: 0,
        ships_left: 0,
        shipsSunk: 0
    },

    shipLocations: {
        "yourShips": new Map(),
        "yourOutskirts": new Map(),
        "enemysShips": new Map(),
        "enemysOutskirts": new Map()
    },

    field: {
        "yourField": new Map(),
        "enemysField": new Map()
    },

    sysInfo: {
        "accuracy": document.querySelector(".accuracy"),
        "totalHits": document.querySelector(".totalHits"),
        "totalMisses": document.querySelector(".totalMisses"),
        "totalShots": document.querySelector(".totalShots")
    },
    
    vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],

    current_vCells: function(){
        let array = this.vertical_cells;
        array.length = this.options.boardSize;
        return array;
    },

    cellRelocation: {
        up: function (position) {
            let calc = this.current_vCells()[this.current_vCells().indexOf(position.charAt(0)) - 1 ];
            if ( !(this.current_vCells().includes(calc)) ){
                return false;
            }
            return calc + position.charAt(1);
        },
        down: function (position) {
            let calc = this.current_vCells()[this.current_vCells().indexOf(position.charAt(0)) + 1 ];
            if ( !(this.current_vCells().includes(calc)) ){
                return false;
            }
            return calc + position.charAt(1);
        },
        left: function (position) {
            let calc = parseInt(position.charAt(1)) - 1;
            if ( calc === 0 ){
                return false;
            }
            return position.charAt(0) + (calc);
        },
        right: function (position) {
            let calc = parseInt(position.charAt(1)) + 1;
            if ( calc > this.options.boardSize ) {
                return false;
            }
            return position.charAt(0) + (calc);
        },
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
            if ( field === "yourField" ){
                cell.classList.add("beforePick");
            }
            row.appendChild(cell);
            letter_index++;
        }
    },

    createShip: function(){
    startShip:
        for( let i = 0; i < 15; i++ ){
            let shipLocations = [];
            let randomLetter = this.vertical_cells[controller.rand(0, this.options.boardSize - 1)];
            let randomDigit = controller.rand(1, this.options.boardSize);
            let position = randomLetter + randomDigit;

            if ( controller.validatePosition(position) ){
                continue;
            }

            let directions = {
            canMoveUp: true,
            canMoveDown: true,
            canMoveLeft: true,
            canMoveRight: true
            }

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

        startDirection:
            for( let x = 0; x < 4; x++ ){

                let arrayItemNum = controller.rand(0, ( avaliable_directions.length - 1 ) );
                let direction = avaliable_directions[arrayItemNum];

                for( let i = 0; i < this.options.shipLength; i++ ){
                    shipLocations.push(position);
                    if ( shipLocations.length === this.options.shipLength ) { break; }
                    switch (direction){
                        case "canMoveUp":
                        position = this.cellRelocation.up.call(this, position);
                        break;
                        case "canMoveDown":
                        position = this.cellRelocation.down.call(this, position);
                        break;
                        case "canMoveLeft":
                        position = this.cellRelocation.left.call(this, position);
                        break;
                        case "canMoveRight":
                        position = this.cellRelocation.right.call(this, position);
                    }
                    if ( controller.validatePosition(position) ){
                        if ( avaliable_directions.length < 0 ){
                            let indexOfDirection = avaliable_directions.indexof(direction);
                            avaliable_directions.splice(indexOfDirection, 1);
                            continue startDirection;  
                        } else {
                            continue startShip;
                        }
                    } 
                }
                return shipLocations;
            }
        }
        throw new Error("Exceed of tries to create ship.");
    },

    calcOutskirts: function(shipLocations, side="enemysShips"){ //shipLocations = array, side - корабли врага или свои
        let shipLoc = this.shipLocations[side];
        let outskirts = new Set();
        shipLocations.forEach(function(position){
            let reloc = this.cellRelocation;

            let upwardCell = reloc.up.call(this, position);
            if ( upwardCell ){       
                outskirts.add( upwardCell );
                let upwardRightCell = reloc.right.call(this, upwardCell);
                if ( upwardRightCell ){
                    outskirts.add( upwardRightCell );
                }
                let upwardLeftCell = reloc.left.call(this, upwardCell);
                if ( upwardLeftCell ){
                    outskirts.add( upwardLeftCell );
                }
            }
            let downwardCell = reloc.down.call(this, position);
            if ( downwardCell ){
                outskirts.add( downwardCell );
                let downwardRightCell = reloc.right.call(this, downwardCell);
                if ( downwardRightCell ){
                    outskirts.add( downwardRightCell );
                }
                let downwardLeftCell = reloc.left.call(this, downwardCell);
                if ( downwardLeftCell ){
                    outskirts.add( downwardLeftCell );
                }
            }
            let leftCell = reloc.left.call(this, position);
            if ( leftCell ){
                outskirts.add( leftCell );
            }
            let rightCell = reloc.right.call(this, position);
            if ( rightCell ){
                outskirts.add( rightCell );
            }
        }, this );

        shipLocations.forEach(function(position){
            if ( outskirts.has(position) ){
                outskirts.delete(position);
            }
        })
        return outskirts;
    },

    deployShips: function(){
        let shipLoc = this.shipLocations["enemysShips"];
        let shipOutskirt = this.shipLocations["enemysOutskirts"];
        
        for( let i = 0; i < this.options.numShips; i++ ){
            shipLoc.set( `ship ${i}`, this.createShip() );
            shipOutskirt.set( `outskirts ${i}`, this.calcOutskirts(shipLoc.get(`ship ${i}`)) )
        }
    },

    mountShip: function(cells, locations){
        let shipLoc = this.shipLocations["yourShips"];
        let shipOutskirt = this.shipLocations["yourOutskirts"];

        cells.forEach(function(cell){
            cell.classList.remove("picked");
            cell.classList.add("mounted");
        })
        shipLoc.set(`ship ${shipLoc.size}`, locations);
        shipOutskirt.set(`outskirts ${shipLoc.size}`, this.calcOutskirts(shipLoc.get(`ship ${shipLoc.size - 1}`), "yourShips") );
        
        model.shipLocations["yourOutskirts"].forEach( (value,key ) => {
            value.forEach( element => {
            let position = model.field["yourField"].get(element);
            position.classList.add("yourOutskirt");
            })
        })
    }
}

export const controller = {
    cheat: function(){
        model.shipLocations["enemysShips"].forEach( (value, key) => {
            value.forEach( element => {
                let position = model.field["enemysField"].get(element);
                position.classList.add("cheat");
            })
        })
        model.shipLocations["enemysOutskirts"].forEach( (value,key ) => {
            value.forEach( element => {
                let position = model.field["enemysField"].get(element);
                position.classList.add("outskirt");
            })
        })
    },

    calcAccuracy: () => {
        view.renderData( model.sysInfo["accuracy"], 
        (parseFloat( model.sysInfo["totalHits"].innerHTML) / parseFloat(model.sysInfo["totalShots"].innerHTML) * 100).toFixed(0));
    },

    rand: function(lowest, highest){
        let range = highest - lowest + 1;
        return lowest + Math.floor(Math.random() * range);
    },

    validatePosition: function(position){
        let shipLoc = model.shipLocations["enemysShips"];
        let shipOutskirt = model.shipLocations["enemysOutskirts"];

        for( let [key, value] of shipLoc ){
            if ( value.some( loc => loc === position ) ){ return true; }
        }
        for ( let [key, value] of shipOutskirt ){
            if ( value.has( position ) ){ return true; }
        }
    },

    validateInput: function(input){
        input = input.charAt(0).toUpperCase() + input.charAt(1);
        let cell = model.field["enemysField"].get(input);

        if ( cell ) {
            view.renderData(model.sysInfo["totalShots"] , parseInt(model.sysInfo["totalShots"].innerHTML) + 1);
            return this.processInput(cell);
        } else {
            view.displayMessage("Неправильные координаты.");
        }
    },

    processInput: function(cell){
        let shipLoc = model.shipLocations["enemysShips"];

        for( let [key, value] of shipLoc ){ 
            if ( value.some( loc => loc === cell.innerHTML ) ){
                let indexOfLocation = shipLoc.get(key).indexOf(cell.innerHTML);
                value.splice( indexOfLocation, 1 );
                if ( value.length === 0 ){
                    view.displayMessage("Вы потопили вражеский корабль!");
                } else {
                    view.displayMessage("Вы попали во вражеский корабль!");
                }
                view.renderData(model.sysInfo["totalHits"], parseInt(model.sysInfo["totalHits"].innerHTML) + 1);       
                this.calcAccuracy();
                return view.displayHit(cell);
            } 
        }
        this.calcAccuracy();
        view.displayMessage("Промах!");
        view.renderData(model.sysInfo["totalMisses"], parseInt(model.sysInfo["totalMisses"].innerHTML) + 1);
        view.displayMiss(cell);
    },

    validatePick: function(cells){ //array
        cells.map = Array.prototype.map;

        let locations = cells.map(function(elem){
            return elem.innerHTML;
        })
        let firstElemLetter = locations[0].charAt(0);
        let firstElemDigit = locations[0].charAt(1);

        if ( ( locations.every(function(currentValue){
            return currentValue.charAt(0) === firstElemLetter;
        }) && this.checkForUnity( locations, "horizontal" ) )
          ||  ( locations.every(function(currentValue){
            return currentValue.charAt(1) === firstElemDigit;
        }) && this.checkForUnity( locations, "vertical" ) )
        ){
            model.mountShip(cells, locations);
            model.information.mountedShips++;
            if ( model.information.mountedShips === model.options.numShips ) {
                view.displayMessage("Все корабли установлены");
                return true;
            } else {
                view.displayMessage(`Корабль установлен. Осталось кораблей: ${model.options.numShips - model.information.mountedShips}`);
            }
        } else {
            cells.forEach(function(cell){
                cell.classList.remove("picked");
            })
            view.displayMessage("Неправильная расстановка корабля");
        }
    },

    checkForUnity: function(locations, dir){
        let middle = locations[1];
        let reloc = model.cellRelocation;

        if ( dir === "vertical" ){
            if ( ( reloc.up.call(model, locations[2]) === middle )
            && ( reloc.down.call(model, locations[0]) === middle ) ){
                return true;
            }
        }
        else if ( dir === "horizontal" ){
            if ( ( reloc.left.call(model, locations[2]) === middle )
            && ( reloc.right.call(model, locations[0]) === middle ) ){
                return true;
            }
        }
        else {
            return false;
        }
    }
}

