export * from "./data";
export const view = {
    displayMessage: function(msg) {
        document.querySelector(".sysMessage").innerHTML = msg;
    },
    renderData: function(element, data) {
        document.querySelector(element).innerHTML = data;
    }
    // displayHit: function(location) {
    //     $("#"+location).attr("class", "hit");
    //     $("#"+location).text("HIT");
    //     this.displayMessage("Вы попали во вражеский корабль!");
    // },
    // displayMiss: function(location) {
    //     $("#"+location).attr("class", "miss");
    //     $("#"+location).text("MISS");
    //     this.displayMessage("Вы промахнулись!");
    // }
};

export const model = {
    options: {
        boardSize: 7,
        numShips: 0,
        shipLength: 3,
        shipsSunk: 0,
    },

    information: {
        total_shots: 0,
        hits: 0,
        misses: 0,
        hits_left: 0
    },

    field: {
        "yourField": new Map(),
        "enemysField": new Map()
    },
    
    vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],

    create: function(baseElement = "yourField"){
        let letter_index = 0;
        let digit_index = 0;
        let base = document.querySelector("." + baseElement);

        for( let i = 0; i < Math.pow(this.options.boardSize, 2); i++ ){
            let cell = document.createElement("div");
            if( i % this.options.boardSize === 0 ) {
                letter_index = 0;
                digit_index++;
                var row = document.createElement("div");
                row.classList.add("newRow");
                base.appendChild(row)
            }
            let cellNum = this.vertical_cells[letter_index] + digit_index;
            this.field[baseElement].set(cellNum, cell);
            cell.innerHTML = cellNum;
            cell.classList.add("cell");
            row.appendChild(cell);
            letter_index++;
        }
    }
}

export const controller = {

    validateInput: function(){
        
    }

}