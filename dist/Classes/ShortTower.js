/*
 *  Subclass for 1 by 3 shorter tower
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
        _this._xStartPosition = 0.5;
        _this._yStartPosition = 1;
        _this._zStartPosition = 0.5;
        if (offsetW) {
            _this._xStartPosition -= _this._shift;
            _this._zStartPosition -= _this._shift;
        }
        if (offsetH) {
            _this._yStartPosition -= _this._shift;
        }
        _this.rotationCounter = 0;
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
     *  Instead of allowing users to rotate by axes, we have defined set rotations that the block can
     *  cycle through. For ShortTower, there are three unique rotations: upright, sideways, and laid-down.
     *
     *  View if looking straight on (x, y)
     *      0.) upright: (1, 2)
     *      1.) sideways: (2, 1)
     *      2.) laid-down: (1, 1)
     *
     *  What's Happening?
     *      Essentially, the piece is starting in case 0 (upright). The first time we rotate, we will increment
     *      the rotationCounter by 1 so that it rotates to case 1 (sideways). The shifts on the x and y
     *      positions account for any discrepancies where the block is between squares of the grid. The next
     *      time the piece is rotated, rotationCounter is incremented taking us to case 2 (laid-down), once
     *      again accounting for the shift. Here, we set rotationCounter to -1 because we want the next case to
     *      be case 0. -1 is incremented to 0, allowing us to enter case 0 (upright). There, we just undo the
     *      previous rotations and shifts.
     */
    ShortTower.prototype.rotate = function (mesh) {
        this.rotationCounter++; //increment at start because rotationCounter is initialized to 0 (case 0)
        //upright rotation (case 0)
        if (this.rotationCounter === 0) {
            //essentially undoing the previous two rotations
            mesh.rotate(BABYLON.Axis.Y, -this._rotation, BABYLON.Space.WORLD);
            mesh.rotate(BABYLON.Axis.Z, -this._rotation, BABYLON.Space.WORLD);
            mesh.position.z += this._shift;
            mesh.position.y -= this._shift;
            //sideways rotation (case 1)
        }
        else if (this.rotationCounter === 1) {
            mesh.rotate(BABYLON.Axis.Z, this._rotation, BABYLON.Space.WORLD);
            mesh.position.y += this._shift; //Shift the piece up half a step
            mesh.position.x += this._shift; //AND to the right half a step
            //laid-down rotation (case 2)
        }
        else {
            mesh.rotate(BABYLON.Axis.Y, this._rotation, BABYLON.Space.WORLD);
            mesh.position.x -= this._shift; //Shift the piece to the left half a step
            mesh.position.z -= this._shift;
            this.rotationCounter = -1; //set to -1 because will get incremented
        }
    };
    ShortTower.prototype.flip = function (mesh) {
        //Code does nothing; just need to have because Piece movement() calls this function for ALL subclasses
    };
    return ShortTower;
}(Piece));
//# sourceMappingURL=ShortTower.js.map