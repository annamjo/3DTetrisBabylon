// import { game as Game } from './Game';
// import { menu as Menu} from './Menu';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        // create canvas, scene (has gameboard), engine?
        this._canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(engine);
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); //color of background - black
        this.gameOn = false;
        window.addEventListener("resize", function () {
            engine.resize();
        });
        this.createScene();
        engine.runRenderLoop(function () {
            _this._scene.render();
        });
        this._menu = new Menu(this._scene);
        this.gameLoop();
    }
    //Main render/game loop
    App.prototype.gameLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._scene.onBeforeRenderObservable.add(function () {
                    if (!_this._menu.isActive) { //if menu is not active...
                        //run game
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    App.prototype.createScene = function () {
        var engine = this._scene.getEngine();
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3.3, 18.4, new BABYLON.Vector3(0, 0, 0), this._scene); //camera changed
        camera.attachControl(this._canvas, true);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        light.intensity = 1;
        // var gameTest = new Game(7); //or 5
    };
    return App;
}());
// new App();
//# sourceMappingURL=App.js.map