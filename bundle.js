(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Menu = /** @class */ (function () {
    function Menu() {
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        this.active = true;
        this._font = "Agency FB";
        var self = this;
        this._startButton = BABYLON.GUI.Button.CreateSimpleButton("startButton", "START");
        this._startButton.color = "white";
        this._startButton.fontFamily = this._font;
        this._startButton.fontSize = 50;
        this._startButton.height = 0.1;
        this._startButton.width = 0.1;
        this._startButton.background = "black";
        this._startButton.top = 50;
        this._advancedTexture.addControl(this._startButton);
        this._titleBack = new BABYLON.GUI.TextBlock("titleFront");
        this._titleBack.text = "3D Tetris";
        this._titleBack.color = "black";
        this._titleBack.fontSize = 275;
        this._titleBack.fontFamily = this._font;
        this._titleBack.top = -240;
        this._titleBack.left = -10;
        this._advancedTexture.addControl(this._titleBack);
        this._titleFront = new BABYLON.GUI.TextBlock("titleFront");
        this._titleFront.text = "3D Tetris";
        this._titleFront.color = "white";
        this._titleFront.fontSize = 275;
        this._titleFront.fontFamily = this._font;
        this._titleFront.top = -250;
        this._titleBack.left = 10;
        this._advancedTexture.addControl(this._titleFront);
        this._authors = new BABYLON.GUI.TextBlock("authors");
        this._authors.text = "b  y     A  n  n  a     a  n  d     R  J";
        this._authors.color = "white";
        this._authors.fontFamily = this._font;
        this._authors.fontSize = 50;
        this._authors.top = -100;
        this._advancedTexture.addControl(this._authors);
        this._line = new BABYLON.GUI.Line();
        this._line.color = "white";
        this._line.lineWidth = 20;
        this._line.x1 = 0;
        this._line.y1 = 700;
        this._line.y2 = 700;
        this._line.x2 = 2000;
        this._line.alpha = 0.2;
        this._advancedTexture.addControl(this._line);
        this._howToPlay = new BABYLON.GUI.TextBlock("howToPlay");
        this._howToPlay.text = "HOW TO PLAY:";
        this._howToPlay.fontFamily = this._font;
        this._howToPlay.fontSize = 30;
        this._howToPlay.color = "white";
        this._howToPlay.left = -600;
        this._howToPlay.top = 155;
        this._advancedTexture.addControl(this._howToPlay);
        console.log("hello");
        this._startButton.onPointerDownObservable.add(function () {
            this.active = false;
            console.log("clicked");
            while (this._startButton.alpha > 0) {
                this._startButton.alpha -= 0.01;
            }
        });
    }
    return Menu;
}());
exports.menu = Menu;

},{}],2:[function(require,module,exports){
"use strict";
// import { AdvancedDynamicTexture } from "babylonjs-gui";
// import * as GUI from 'babylonjs-gui';
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *  Copied code exactly from Babylon starter playground
 *  Placeholder for launching page
 */
var Menu_1 = require("./3DTetris/Menu");
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    //0.7 - only 70% of light source in 3d world
    var menu = new Menu_1.menu();
    return scene;
};
//host:
var canvas = document.getElementById('renderCanvas');
//casted canvas so TS knows this is a canvas element
var engine = new BABYLON.Engine(canvas, true); //turn on engine
window.addEventListener('resize', function () {
    engine.resize();
});
var scene = createScene();
engine.runRenderLoop(function () {
    scene.render();
});

},{"./3DTetris/Menu":1}]},{},[2]);
