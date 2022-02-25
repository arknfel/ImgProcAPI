import express from 'express';


// logger function
const stamper = function (statusCode: number, ip: string, err?: unknown, msg?: string): void {
    console.log(`[${statusCode}] req from ${ip} \@ ${Date.now()}: `);
    console.log(err);
}

// Check if all params are present
const presentParams = function (
    req: express.Request,
    res: express.Response,
    next: Function
) {
    if (
        'filename' in req.query
        && 'width' in req.query
        && 'height' in req.query
    ) { next(); } else {
        let msg = `could not parse all required params, parsed 
            ( filename: ${req.query.filename}, width: ${req.query.width}, height: ${req.query.height}`;
        res.statusCode = 400;
        res.send(msg);
        stamper(res.statusCode, req.ip, new Error(msg));
    }
};

// Checks if the filename is correct and has an extension
const validateFileName = function (
    req: express.Request,
    res: express.Response,
    next: Function
) {
    let filename = (req.query.filename as unknown) as string;
    let msg = 'missing file extension'; // err msg
    try {
        if (filename.split('.').length !== 2) {
            res.statusCode = 404;
            res.send(msg);
            stamper(res.statusCode, req.ip, new Error(msg));

        // next() must be wrapped by the else statement
        // since that incase the if statement is true, the response
        // body will be modified.
        } else {
            next();
        }
    } catch (err) {
        res.statusCode = 404;
        res.send(msg);
        stamper(res.statusCode, req.ip, err);

    }
};

// Checks if W and H are valid values (numeric and > 0)
const validateSize = function (
    req: express.Request,
    res: express.Response,
    next: Function
) {
    let width = (req.query.width as unknown) as string;
    let height = (req.query.height as unknown) as string;
    let msg = `invalid width and/or height, parsed: width=${width}, height=${height}`; // err msg
    try {
        if (
            isNaN(parseInt(width))
            || isNaN(parseInt(height))
            || parseInt(width) <= 0
            || parseInt(height) <= 0 
        ) {
            res.statusCode = 400;
            res.send(msg);
            stamper(res.statusCode, req.ip, new Error(msg));
        } else {
            next();
        }
    } catch (err) {
        res.statusCode = 400;
        res.send(msg);
        stamper(res.statusCode, req.ip, err);
    }
};

export default {
    stamper,
    presentParams,
    validateFileName,
    validateSize
};