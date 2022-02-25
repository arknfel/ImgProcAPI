import express from 'express';
// import valid from '../../utilities/validateParams';

describe("test module validateParams", () => {

    describe("test presentParams", () => {
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
            ) {
                return res.statusCode = 200;
                // next();
            } else {
                let msg = `could not parse all required params, parsed 
                    ( filename: ${req.query.filename}, width: ${req.query.width}, height: ${req.query.height}`;
                return res.statusCode = 400;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, new Error(msg));
            }
        };

        it("params? filename&width&height are present in the query", () => {
            let req = express.request;
            let res = express.response;
            req.query = {filename: 'test.png', width: '200', height: '200'};
            const presentParamsTest = presentParams(req, res, ()=>{});
            expect((presentParamsTest as unknown) as number).toEqual(200);
        });

        it("missing filename, presentParams should alter the res code to 400", () => {
            let req = express.request;
            let res = express.response;
            req.query = {width: '200', height: '200'};
            const present = presentParams(req, res, ()=>{});
            expect(res.statusCode).toEqual(400);
        });

        it("missing width, presentParams should alter the res code to 400", () => {
            let req = express.request;
            let res = express.response;
            req.query = {filename: 'test.png', height: '200'};
            const present = presentParams(req, res, ()=>{});
            expect(res.statusCode).toEqual(400);
        });

        it("missing height, presentParams should alter the res code to 400", () => {
            let req = express.request;
            let res = express.response;
            req.query = {filename: 'test.png', width: '200'};
            const present = presentParams(req, res, ()=>{});
            expect(res.statusCode).toEqual(400);
        });
    });

    describe("test validateFileName", () => {
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
                    // stamper(res.statusCode, req.ip, new Error(msg));

                } else {
                    res.statusCode = 200;
                    return res.statusCode
                    // next();
                }
            } catch (err) {
                res.statusCode = 404;
                return res.statusCode;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, err);

            }
        };

        it("Valid file name", () => {
            let req = express.request;
            let res = express.response;
            req.query = {filename: 'name.extn'};
            const validateFileNameTest = validateFileName(req, res, ()=> {});
            expect((validateFileNameTest as unknown) as number).toEqual(200);
        });

        it("Invalid file name", () => {
            let req = express.request;
            let res = express.response;
            req.query = {filename: 'myimage.png.png'};
            let validateFileNameTest = validateFileName(req, res, ()=> {});
            expect(res.statusCode).toEqual(404);

            req = express.request;
            res = express.response;
            req.query = {filename: 'myimage'};
            validateFileNameTest = validateFileName(req, res, ()=> {});
            expect(res.statusCode).toEqual(404);
        });
    });

    describe("test validateSize", () => {
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
                    return res.statusCode = 400;
                    // res.send(msg);
                    // stamper(res.statusCode, req.ip, new Error(msg));
                } else {
                    return res.statusCode = 200;
                    // next();
                }
            } catch (err) {
                return res.statusCode = 400;
                // res.send(msg);
                // stamper(res.statusCode, req.ip, err);
            }
        };

        it("valid width and height", () => {
            let req = express.request;
            let res = express.response;
            req.query = {width: '200', height: '200'};
            const validateSizeTest = validateSize(req, res, () => {});
            expect(res.statusCode).toEqual(200);
        });

        it("non-numiric or negative values", () => {
            let req = express.request;
            let res = express.response;
            req.query = {width: 'jaz', height: '200'};
            let validateSizeTest = validateSize(req, res, () => {});
            expect(res.statusCode).toEqual(400);

            req = express.request;
            res = express.response;
            req.query = {width: '200', height: 'jaz'};
            validateSizeTest = validateSize(req, res, () => {});
            expect(res.statusCode).toEqual(400);

            req = express.request;
            res = express.response;
            req.query = {width: '-200', height: '200'};
            validateSizeTest = validateSize(req, res, () => {});
            expect(res.statusCode).toEqual(400);

            req = express.request;
            res = express.response;
            req.query = {width: '200', height: '-200'};
            validateSizeTest = validateSize(req, res, () => {});
            expect(res.statusCode).toEqual(400);
        });
    });
});