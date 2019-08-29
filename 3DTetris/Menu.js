// import * as GUI from 'babylonjs-gui';
var Menu = /** @class */ (function () {
    function Menu(scene) {
        var _this = this;
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.active = true;
        this._font = "Agency FB";
        this._scene = scene;
        this._start = new BABYLON.GUI.TextBlock("start");
        this._start.text = "C L I C K    A N Y W H E R E    T O    S T A R T";
        this._start.color = "white";
        this._start.fontFamily = this._font;
        this._start.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._start.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._start.fontSize = 30;
        this._advancedTexture.addControl(this._start);
        this._titleBack = new BABYLON.GUI.TextBlock("titleFront");
        this._titleBack.text = "3D Tetris";
        this._titleBack.color = "purple";
        this._titleBack.fontSize = 275;
        this._titleBack.fontFamily = this._font;
        this._titleBack.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._titleBack.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._titleBack.top = -240;
        this._titleBack.left = -10;
        this._advancedTexture.addControl(this._titleBack);
        this._titleFront = new BABYLON.GUI.TextBlock("titleFront");
        this._titleFront.text = "3D Tetris";
        this._titleFront.color = "white";
        this._titleFront.fontSize = 275;
        this._titleFront.fontFamily = this._font;
        this._titleFront.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._titleFront.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._titleFront.top = -250;
        this._titleBack.left = 10;
        this._advancedTexture.addControl(this._titleFront);
        this._authors = new BABYLON.GUI.TextBlock("authors");
        this._authors.text = "b  y     A  n  n  a     a  n  d     R  J";
        this._authors.color = "white";
        this._authors.fontFamily = this._font;
        this._authors.fontSize = 50;
        this._authors.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._authors.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._authors.top = -100;
        this._advancedTexture.addControl(this._authors);
        this._line = new BABYLON.GUI.Line();
        this._line.color = "white";
        this._line.lineWidth = 20;
        this._line.x1 = 0;
        this._line.y1 = 700;
        this._line.x2 = 2000;
        this._line.y2 = 700;
        this._line.alpha = 0.2;
        this._advancedTexture.addControl(this._line);
        this._howToPlay = new BABYLON.GUI.TextBlock("howToPlay");
        this._howToPlay.text = "HOW TO PLAY:";
        this._howToPlay.fontFamily = this._font;
        this._howToPlay.fontSize = 30;
        this._howToPlay.color = "white";
        this._howToPlay.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._howToPlay.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._howToPlay.left = 200;
        this._howToPlay.top = -370;
        this._advancedTexture.addControl(this._howToPlay);
        var pointerDown = this._scene.onPointerObservable.add(function (pointerInfo) {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    console.log("POINTER DOWN");
                    _this._scene.onPointerObservable.remove(pointerDown);
                    _this.active = false;
                    _this.hide();
                    break;
            }
        });
    }
    Object.defineProperty(Menu.prototype, "isActive", {
        get: function () {
            return this.active;
        },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.hide = function () {
        if (!this.active) { //if no longer active...
            this._titleFront.dispose();
            this._titleBack.dispose();
            this._authors.dispose();
            this._howToPlay.dispose();
            this._start.dispose();
            // this._instructions.dispose();
            this._line.dispose();
            // this._scene.dispose();
        }
    };
    return Menu;
}());
//# sourceMappingURL=Menu.js.map