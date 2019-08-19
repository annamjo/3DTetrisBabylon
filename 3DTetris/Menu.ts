// import { PointerInfoPre } from "babylonjs";

class Menu {
    private _advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
    private _titleFront : BABYLON.GUI.TextBlock;
    private _titleBack : BABYLON.GUI.TextBlock;
    private _authors : BABYLON.GUI.TextBlock;
    private _howToPlay : BABYLON.GUI.TextBlock;
    private _instructions : BABYLON.GUI.TextBlock;
    private _score : BABYLON.GUI.TextBlock;
    private _line : BABYLON.GUI.Line;
    private _font : string;
    private _scene : BABYLON.Scene;
    private _start : BABYLON.GUI.TextBlock;

    private active : boolean;   //true means on, false means hidden

    constructor(scene : BABYLON.Scene) { //menu, ui
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
            this._howToPlay.text = "HOW TO PLAY:"
            this._howToPlay.fontFamily = this._font;
            this._howToPlay.fontSize = 30;
            this._howToPlay.color = "white";
            this._howToPlay.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._howToPlay.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            this._howToPlay.left = 200;
            this._howToPlay.top = -370;
            this._advancedTexture.addControl(this._howToPlay);

        this._score = new BABYLON.GUI.TextBlock("score");
            this._score.text = "Score : 0";
            this._score.fontFamily = this._font;
            this._score.color = "white";
            this._score.fontSize = 50;
            this._score.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this._score.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this._score.left = -20;
            this._score.top = 20;
            this._advancedTexture.addControl(this._score);

        let pointerDown = this._scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    console.log("POINTER DOWN");
                    this._scene.onPointerObservable.remove(pointerDown);
                    this.active = false;
                    this.hide();
                    break;
            }
        });
    }

    public get isActive() {
        return this.active;
    }

    public updateScore(newScore : number) {
        this._score.text = "Score : " + newScore;
    }

    private hide() {    //gets rid of GUI
        if(!this.active) { //if no longer active...
            this._titleFront.dispose();
            this._titleBack.dispose();
            this._authors.dispose();
            this._howToPlay.dispose();
            this._start.dispose();
            // this._instructions.dispose();
            this._line.dispose();
        }
    }
}

// export { Menu as menu };