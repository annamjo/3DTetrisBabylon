var Block = /** @class */ (function () {
    function Block(cubeNum) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        this.positions = new Array(cubeNum);
    }
    Block.prototype.createCube = function () {
        var cube = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
        cube.position.y = 5.5; //ypos
        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges
        return cube;
    };
    Object.defineProperty(Block.prototype, "position", {
        get: function () {
            return this.parentCube.position;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.rotate = function (axis, rotation) {
        switch (axis) {
            case "x":
                this.parentCube.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.WORLD);
                break;
            case "y":
                this.parentCube.rotate(BABYLON.Axis.Y, -rotation, BABYLON.Space.WORLD);
                break;
            case "z":
                this.parentCube.rotate(BABYLON.Axis.Z, -rotation, BABYLON.Space.WORLD);
                break;
        }
    };
    Block.prototype.split = function (position) {
        //each cube that makes up block will uncouple - setParent(null)
        //detatch part of block
        //use this.positions
    };
    Object.defineProperty(Block.prototype, "isActive", {
        set: function (state) {
            this.isActive = state; //used to turn off, set to false
        },
        enumerable: true,
        configurable: true
    });
    return Block;
}());
//# sourceMappingURL=Block.js.map