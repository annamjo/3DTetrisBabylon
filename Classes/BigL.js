/*
 *  Subclass of Piece for BigL
 *  Taller versions of MiniL
 *  BigLs are purple
 *  TO-DO: When rotated and odd grid, block is not locked. The y-position is up by +0.5
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
var BigL = /** @class */ (function (_super) {
    __extends(BigL, _super);
    function BigL(name, isActive, offsetW, offsetH, ground) {
        var _this = _super.call(this, name, isActive, offsetW, offsetH, ground) || this;
        //setting starting position
        //coordinates are set as so: (x, 0, y) --> must set Z later
        _this._startingPosition = [
            new BABYLON.Vector3(0 - _this._shift, 0, 0),
            new BABYLON.Vector3(0 - _this._shift, 0, 3),
            new BABYLON.Vector3(1 - _this._shift, 0, 3),
            new BABYLON.Vector3(1 - _this._shift, 0, 1),
            new BABYLON.Vector3(2 - _this._shift, 0, 1),
            new BABYLON.Vector3(2 - _this._shift, 0, 0) //bottom right corner
        ];
        _this.flipCounter = 0;
        //properties specific to BigL
        _this._color = "purple";
        _this._depth = 1;
        //creating physical block; note, need sideOridentation for "solid" block
        _this._bigL = BABYLON.MeshBuilder.CreatePolygon("bigL", { shape: _this._startingPosition, depth: _this._depth, updatable: true, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        _this._bigL.position.z -= _this._shift;
        if (offsetH) { //if odd number of height, will shift block half step down
            _this._bigL.position.y -= _this._shift;
        }
        //sets L upright
        _this._startingRotation = (3 * Math.PI) / 2;
        _this._bigL.rotation.x = _this._startingRotation;
        //adding color purple to block material
        _this._bigLMaterial = new BABYLON.StandardMaterial("bigLMat", scene);
        _this._bigLMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5); //r: 0.5, g: 0, b: 0.5
        _this._bigL.material = _this._bigLMaterial;
        return _this;
    }
    Object.defineProperty(BigL.prototype, "piece", {
        //accessor
        get: function () {
            return this._bigL;
        },
        enumerable: true,
        configurable: true
    });
    /*
     *  For BigL, there are 4 rotations for the protruding cube, similar to the MiniL. The protruding cube can
     *  be on the right, back, left, or front.
     *
     *  The flip method toggles whether the protruding cube is at the bottom (L) or top (upside-down L).
     *
     *  For further explanation, see MiniL class as the code is identical :)
     */
    BigL.prototype.rotate = function (mesh) {
        if (this.flipCounter === 0) { //L shaped
            mesh.rotation.y -= this._rotation;
            mesh.locallyTranslate(new BABYLON.Vector3(this._shift, this._shift, 0));
        }
        else { //upside down L
            mesh.rotation.y -= this._rotation;
            mesh.locallyTranslate(new BABYLON.Vector3(-this._shift, this._shift, 0));
        }
    };
    BigL.prototype.flip = function (mesh) {
        //case 0: protruding cube is lower --> flips down
        if (this.flipCounter === 0) {
            mesh.rotation.x += Math.PI;
            mesh.locallyTranslate(new BABYLON.Vector3(0, 1, -1));
            this.flipCounter = 1;
            //case 1: protruding cube is higher --> flips up
        }
        else {
            mesh.rotation.x -= Math.PI;
            mesh.locallyTranslate(new BABYLON.Vector3(0, 1, -1));
            this.flipCounter = 0;
        }
    };
    return BigL;
}(Piece));
//# sourceMappingURL=BigL.js.map