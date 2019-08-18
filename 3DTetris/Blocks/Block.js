var Block = /** @class */ (function () {
    function Block(cubeNum) {
        this._isActive = true; //true when block is falling (1st contructed), false when locked in
        //or false if block not in grid (when first being spawned), true if in grid and falling
        this.positions = new Array(cubeNum);
        this.cubes = new Array(cubeNum - 1); //excluding parent cube
    }
    Block.prototype.createCube = function (ypos, xpos) {
        var cube = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene); //will scene need to be stored?
        cube.position.y = ypos; //5.5 or 6.5?, or higher, above grid?
        cube.position.x = xpos;
        cube = this.createEdges(cube);
        return cube;
    };
    Block.prototype.createEdges = function (cube) {
        cube.enableEdgesRendering();
        cube.edgesWidth = 5.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //black edges
        return cube;
    };
    Object.defineProperty(Block.prototype, "position", {
        get: function () {
            return this.parentCube.position; //may not be accurate for pivoted blocks - specific to each class?
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.rotate = function (axis) {
        var rotation = Math.PI / 2;
        if (this.type !== "big cube") {
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
        }
    };
    Block.prototype.becomeChild = function (cube /*BABYLON.InstancedMesh*/) {
        //cube = this.parentCube.createInstance("cube");
        cube = this.parentCube.clone();
        cube = this.createEdges(cube);
        // cube.parent = this.parentCube;
        return cube;
    };
    Block.prototype.uncouple = function () {
        //remove link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(null); // example: this._cube2.setParent(null);
        }
    };
    Block.prototype.recouple = function () {
        //restore link between child and parent
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].setParent(this.parentCube); //parent back
        }
    };
    Object.defineProperty(Block.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        // public split(position: BABYLON.Vector3): void { //break apart a single cube from block
        //     //each cube that makes up block will uncouple - setParent(null)
        //     //detatch part of block
        //     //use this.positions
        // }
        // public removePosition() {} //for cascade method?^
        //public removeCube() {}
        set: function (state) {
            this._isActive = state; //used to turn off, set to false
        },
        enumerable: true,
        configurable: true
    });
    return Block;
}());
//# sourceMappingURL=Block.js.map