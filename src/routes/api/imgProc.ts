import express from "express";
import path from 'path';
import utils from "../../utilities/utilities";
import valid from "../../utilities/validateParams";


const imagesRoute = express.Router();

// Images base directory
const imgsPath = path.join(__dirname, '../../..', 'images');

// IMG processing endpoint, expects query params (filename.extn, +width, +height)
imagesRoute.get(
    '/images',
    [valid.presentParams, valid.validateFileName, valid.validateSize], // middleware
    (req: express.Request, res: express.Response) => {


    let filename = (req.query.filename as unknown) as string;

    let width = parseInt(req.query.width as string);
    let height = parseInt(req.query.height as string);
    let nameParts = filename.split('.');

    let thumbName = `${nameParts[0]}-${width}x${height}.${nameParts[1]}`;

    let imgPath = path.join(imgsPath, 'full', filename);
    let newPath = path.join(imgsPath, 'thumb', thumbName);
    // console.log(imgPath);

    // async wrapper for resize IMG
    async function serveReq(): Promise <void> {

        try{
            // cache
            let resizedExists = utils.checkFileExists(newPath);
            let originalExists = utils.checkFileExists(imgPath);


            if (
                resizedExists === false
                && originalExists === true
            ) {
                await utils.sharpResize(imgPath, newPath, width, height);
            } 
            
            else if ( originalExists === false ) {
                throw new Error("requested image not found") 
            }

            res.statusCode = 200;
            res.sendFile(newPath);
            let msg = `${filename} resized @ ${newPath}`;
            valid.stamper(res.statusCode, req.ip, msg);

        } catch (err) {
            res.statusCode = 400;
            let msg = `Error: Could not locate the resources you looking for, (parsed filename: ${filename})`;
            res.send(msg);
            valid.stamper(res.statusCode, req.ip, msg);
        }
    };
    serveReq();

});

export default imagesRoute ;