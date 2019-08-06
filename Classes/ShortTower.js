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
    function ShortTower(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        //setting starting positions
        _this._xStartPosition = 0.5 - _this._shift;
        _this._yStartPosition = 1;
        if (offsetH) {
            _this._yStartPosition -= _this._shift;
        }
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
        //this._shortTowerMaterial.wireframe = true;
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
    /*
     *  this.blockRotationZ is a counter that keeps track of ShortTower's rotation on the z-axis.
     *  For short tower, the two different z-rotations are PI/2 and 0 (upright and sideways)
     *
     *  Everytime the block rotates, we must shift the piece by 0.5 (half-step), so that it stays
     *  locked within the grid.
     *
     *  This function must be implemented in each subclass. Notice that every time it rotates, the
     *  shifts cancel each other (+0.5 and -0.5).
     *
     *  The functions all work in the same way for this block, just acting on different axes.
     */
    ShortTower.prototype.rotateMoveZ = function () {
        if (this.blockRotationZ === this._rotation) { //if the counter is equal to Math.PI/2, then...
            this._shortTower.position.y -= this._shift; //...shift the piece down half a step
            this._shortTower.position.x -= this._shift; //AND to the left half a step
            this.blockRotationZ = 0; //reset the counter back to 0 because this block only has 2 rotations
        }
        else { //if the counter is 0, then...
            this._shortTower.position.y += this._shift; //...shift the piece up half a step
            this._shortTower.position.x += this._shift; //AND to the right half a step
            this.blockRotationZ += this._rotation; //add Math.PI/2 to counter
        }
    };
    ShortTower.prototype.rotateMoveX = function () {
        if (this.blockRotationX === this._rotation) { //if the counter is equal to Math.PI/2, then...
            this._shortTower.position.y -= this._shift; //...shift the piece down half a step
            this._shortTower.position.z -= this._shift; //AND back half a step
            this.blockRotationX = 0; //reset the counter back to 0 because this block only has 2 rotations
        }
        else { //if the counter is 0, then...
            this._shortTower.position.y += this._shift; //...shift the piece up half a step
            this._shortTower.position.z += this._shift; //AND forward half a step
            this.blockRotationX += this._rotation; //add Math.PI/2 to counter
        }
    };
    ShortTower.prototype.rotateMoveY = function () {
    };
    return ShortTower;
}(Piece));
//# sourceMappingURL=ShortTower.js.map