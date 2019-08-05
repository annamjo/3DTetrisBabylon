/*
 *  Subclass for 1 by 3 shorter tower
 *  TO-DO: When rotating tower and grid is odd, block is no longer locked to grid. The y-position is +0.5
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ShortTower = /** @class */ (function (_super) {
    __extends(ShortTower, _super);
    function ShortTower(name, isActive, offset) {
        var _this = _super.call(this, name, isActive, offset) || this;
        //setting starting positions
        _this._xStartPosition = 0.5 - _this._shift;
        _this._yStartPosition = 1;
        _this._zStartPosition = 0.5 - _this._shift;
        //properties specific to ShortTower
        _this._width = 1;
        _this._height = 2;
        _this._length = 1;
        _this._color = "blue";
        //creating physical short tower
        _this._shortTower = BABYLON.MeshBuilder.CreateBox("shortTower", { width: _this._width, height: _this._height, depth: _this._length }, scene);
        //setting start position
        _this._shortTower.position.x = _this._xStartPosition;
        _this._shortTower.position.y = _this._yStartPosition;
        _this._shortTower.position.z = _this._zStartPosition;
        //setting color to blue
        _this._shortTowerMaterial = new BABYLON.StandardMaterial('smallCubeMat', scene);
        _this._shortTowerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        //ugly grid on block
        // this._shortTowerMaterial = new BABYLON.GridMaterial("shortTowerGrid", scene);
        // this._shortTowerMaterial.lineColor = BABYLON.Color3.White();
        // this._shortTowerMaterial.mainColor = BABYLON.Color3.Blue();
        //TO-DO: Create material for prettier grid
        _this._shortTower.material = _this._shortTowerMaterial;
        return _this;
    }
    Object.defineProperty(ShortTower.prototype, "piece", {
        get: function () {
            return this._shortTower;
        },
        enumerable: true,
        configurable: true
    });
    //changeState function will change the block to active or unactive depending on the state when initiailly called
    ShortTower.prototype.changeState = function () {
        this._isActive = !this._isActive;
        //for debugging and keeping track
        if (this._isActive) {
            console.log("Block is active");
        }
        else {
            console.log("Block is unactive");
        }
    };
    return ShortTower;
}(Piece));
//# sourceMappingURL=ShortTower.js.map