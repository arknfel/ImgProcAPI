"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// import valid from '../../utilities/validateParams';
describe("test module validateParams", function () {
    describe("test presentParams", function () {
        // Check if all params are present
        var presentParams = function (req, res, next) {
            if ('filename' in req.query
                && 'width' in req.query
                && 'height' in req.query) {
                return res.statusCode = 200;
                // next();
            }
            else {
                var msg = "could not parse all required params, parsed \n                    ( filename: ".concat(req.query.filename, ", width: ").concat(req.query.width, ", height: ").concat(req.query.height);
                return res.statusCode = 400;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, new Error(msg));
            }
        };
        it("params? filename&width&height are present in the query", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { filename: 'test.png', width: '200', height: '200' };
            var presentParamsTest = presentParams(req, res, function () { });
            expect(presentParamsTest).toEqual(200);
        });
        it("missing filename, presentParams should alter the res code to 400", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { width: '200', height: '200' };
            var present = presentParams(req, res, function () { });
            expect(res.statusCode).toEqual(400);
        });
        it("missing width, presentParams should alter the res code to 400", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { filename: 'test.png', height: '200' };
            var present = presentParams(req, res, function () { });
            expect(res.statusCode).toEqual(400);
        });
        it("missing height, presentParams should alter the res code to 400", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { filename: 'test.png', width: '200' };
            var present = presentParams(req, res, function () { });
            expect(res.statusCode).toEqual(400);
        });
    });
    describe("test validateFileName", function () {
        // Checks if the filename is correct and has an extension
        var validateFileName = function (req, res, next) {
            var filename = req.query.filename;
            var msg = 'missing file extension'; // err msg
            try {
                if (filename.split('.').length !== 2) {
                    res.statusCode = 404;
                    res.send(msg);
                    // stamper(res.statusCode, req.ip, new Error(msg));
                }
                else {
                    res.statusCode = 200;
                    return res.statusCode;
                    // next();
                }
            }
            catch (err) {
                res.statusCode = 404;
                return res.statusCode;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, err);
            }
        };
        it("Valid file name", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { filename: 'name.extn' };
            var validateFileNameTest = validateFileName(req, res, function () { });
            expect(validateFileNameTest).toEqual(200);
        });
        it("Invalid file name", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { filename: 'myimage.png.png' };
            var validateFileNameTest = validateFileName(req, res, function () { });
            expect(res.statusCode).toEqual(404);
            req = express_1.default.request;
            res = express_1.default.response;
            req.query = { filename: 'myimage' };
            validateFileNameTest = validateFileName(req, res, function () { });
            expect(res.statusCode).toEqual(404);
        });
    });
    describe("test validateSize", function () {
        // Checks if W and H are valid values (numeric and > 0)
        var validateSize = function (req, res, next) {
            var width = req.query.width;
            var height = req.query.height;
            var msg = "invalid width and/or height, parsed: width=".concat(width, ", height=").concat(height); // err msg
            try {
                if (isNaN(parseInt(width))
                    || isNaN(parseInt(height))
                    || parseInt(width) <= 0
                    || parseInt(height) <= 0) {
                    return res.statusCode = 400;
                    // res.send(msg);
                    // stamper(res.statusCode, req.ip, new Error(msg));
                }
                else {
                    return res.statusCode = 200;
                    // next();
                }
            }
            catch (err) {
                return res.statusCode = 400;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, err);
            }
        };
        it("valid width and height", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { width: '200', height: '200' };
            var validateSizeTest = validateSize(req, res, function () { });
            expect(res.statusCode).toEqual(200);
        });
        it("non-numiric or negative values", function () {
            var req = express_1.default.request;
            var res = express_1.default.response;
            req.query = { width: 'jaz', height: '200' };
            var validateSizeTest = validateSize(req, res, function () { });
            expect(res.statusCode).toEqual(400);
            req = express_1.default.request;
            res = express_1.default.response;
            req.query = { width: '200', height: 'jaz' };
            validateSizeTest = validateSize(req, res, function () { });
            expect(res.statusCode).toEqual(400);
            req = express_1.default.request;
            res = express_1.default.response;
            req.query = { width: '-200', height: '200' };
            validateSizeTest = validateSize(req, res, function () { });
            expect(res.statusCode).toEqual(400);
            req = express_1.default.request;
            res = express_1.default.response;
            req.query = { width: '200', height: '-200' };
            validateSizeTest = validateSize(req, res, function () { });
            expect(res.statusCode).toEqual(400);
        });
    });
});
