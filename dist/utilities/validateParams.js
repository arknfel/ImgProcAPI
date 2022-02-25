"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger function
var stamper = function (statusCode, ip, err, msg) {
    console.log("[".concat(statusCode, "] req from ").concat(ip, " @ ").concat(Date.now(), ": "));
    console.log(err);
};
// Check if all params are present
var presentParams = function (req, res, next) {
    if ('filename' in req.query
        && 'width' in req.query
        && 'height' in req.query) {
        next();
    }
    else {
        var msg = "could not parse all required params, parsed \n            ( filename: ".concat(req.query.filename, ", width: ").concat(req.query.width, ", height: ").concat(req.query.height);
        res.statusCode = 400;
        res.send(msg);
        stamper(res.statusCode, req.ip, new Error(msg));
    }
};
// Checks if the filename is correct and has an extension
var validateFileName = function (req, res, next) {
    var filename = req.query.filename;
    var msg = 'missing file extension'; // err msg
    try {
        if (filename.split('.').length !== 2) {
            res.statusCode = 404;
            res.send(msg);
            stamper(res.statusCode, req.ip, new Error(msg));
            // next() must be wrapped by the else statement
            // since that incase the if statement is true, the response
            // body will be modified.
        }
        else {
            next();
        }
    }
    catch (err) {
        res.statusCode = 404;
        res.send(msg);
        stamper(res.statusCode, req.ip, err);
    }
};
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
            res.statusCode = 400;
            res.send(msg);
            stamper(res.statusCode, req.ip, new Error(msg));
        }
        else {
            next();
        }
    }
    catch (err) {
        res.statusCode = 400;
        res.send(msg);
        stamper(res.statusCode, req.ip, err);
    }
};
exports.default = {
    stamper: stamper,
    presentParams: presentParams,
    validateFileName: validateFileName,
    validateSize: validateSize
};
