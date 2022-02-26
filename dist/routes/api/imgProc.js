"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var utilities_1 = __importDefault(require("../../utilities/utilities"));
var validateParams_1 = __importDefault(require("../../utilities/validateParams"));
var imagesRoute = express_1.default.Router();
// Images base directory
var imgsPath = path_1.default.join(__dirname, '../../..', 'images');
// IMG processing endpoint, expects query params (filename.extn, +width, +height)
imagesRoute.get('/images', [validateParams_1.default.presentParams, validateParams_1.default.validateFileName, validateParams_1.default.validateSize], // middleware
function (req, res) {
    var filename = req.query.filename;
    var width = parseInt(req.query.width);
    var height = parseInt(req.query.height);
    var nameParts = filename.split('.');
    var thumbName = "".concat(nameParts[0], "-").concat(width, "x").concat(height, ".").concat(nameParts[1]);
    var imgPath = path_1.default.join(imgsPath, 'full', filename);
    var newPath = path_1.default.join(imgsPath, 'thumb', thumbName);
    // console.log(imgPath);
    // async wrapper for resize IMG
    function serveReq() {
        return __awaiter(this, void 0, void 0, function () {
            var resizedExists, originalExists, msg, err_1, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        resizedExists = utilities_1.default.checkFileExists(newPath);
                        originalExists = utilities_1.default.checkFileExists(imgPath);
                        if (!(resizedExists === false
                            && originalExists === true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, utilities_1.default.sharpResize(imgPath, newPath, width, height)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (originalExists === false) {
                            throw new Error("requested image not found");
                        }
                        _a.label = 3;
                    case 3:
                        res.statusCode = 200;
                        res.sendFile(newPath);
                        msg = "".concat(filename, " resized @ ").concat(newPath);
                        validateParams_1.default.stamper(res.statusCode, req.ip, msg);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        res.statusCode = 400;
                        msg = "Error: Could not locate the resources you looking for, (parsed filename: ".concat(filename, ")");
                        res.send(msg);
                        validateParams_1.default.stamper(res.statusCode, req.ip, msg);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    ;
    serveReq();
});
exports.default = imagesRoute;
