import * as Data from "../src/js/data.js";

let assert = require("chai").assert;

describe("Data.model", function(){

	describe("current_vCells", function(){
		it("Функция должна возвращать массив ячеек", function(){
			assert.isArray(Data.model.current_vCells(), "Массив ячеек");
		})
		it("количество ячеек должно быть равно options.boardSize", function(){
			assert.equal(Data.model.current_vCells().length, Data.model.options.boardSize);
		})
	})

	describe("cellRelocation", function(){
		it("Позиция должна переместиться на одну ячейку вверх", function(){
			assert.equal(Data.model.cellRelocation.up.call(Data.model ,"B1"), "A1");
		})
		it("Позиция должна переместиться на одну ячейку вниз", function(){
			assert.equal(Data.model.cellRelocation.down.call(Data.model ,"A1"), "B1");
		})
		it("Позиция должна переместиться на одну ячейку влево", function(){
			assert.equal(Data.model.cellRelocation.left.call(Data.model ,"A2"), "A1");
		})
		it("Позиция должна переместиться на одну ячейку вправо", function(){
			assert.equal(Data.model.cellRelocation.right.call(Data.model ,"A1"), "A2");
		})
	})

	describe("createShip", function(){
		it("Функция должна возвращать массив локаций для корабля", function(){
			assert.isArray(Data.model.createShip(), "Массив локаций для корабля");
		})
		it(`В массиве должно быть ${Data.model.options.shipLength} элемента (в зависимости от опции длины корабля)`, function(){
			assert.equal(Data.model.createShip().length, Data.model.options.shipLength);
		})
	})

});

describe("Data.controller", function(){
	describe("validatePosition", function(){
		before(function(){
			Data.model.deployShips();
		});
		it("Есть ли введенная позиция в массиве позиций корабля или в наборе(set) ", function(){
			let exactPosition = Data.model.shipLocations["enemysShips"].get("ship 0")[0];
			assert.isTrue(Data.controller.validatePosition(exactPosition));
		})
	})

	describe("checkForUnity", function(){
		it("Являются ли координаты целостными (близкими друг к другу). Горизонтальные координаты.", function(){
			assert.isTrue(Data.controller.checkForUnity(["A1", "A2", "A3"], "horizontal"))
		})
		it("Являются ли координаты целостными (близкими друг к другу). Вертикальные координаты.", function(){
			assert.isTrue(Data.controller.checkForUnity(["A1", "B1", "C1"], "vertical"))
		})
	})
});