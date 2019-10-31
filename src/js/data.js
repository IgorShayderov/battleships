const view = {
    displayMessage: function(msg) {
        document.querySelector("#buttonsContainer__guessInput").innerHTML = msg;
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

const model = {
// Размер игрового поля от 5 до 10
// Количество кораблей: 1 ячейка корабля на 7 единиц поля
    options: {
        boardSize: 5,
        numShips: 0,
        shipLength: 3,
        shipsSunk: 0,
    },

hits: 0,
misses: 0,

vertical_cells: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
hitted_cells: [],

ships: []
}