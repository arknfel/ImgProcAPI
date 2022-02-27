import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { promises as fsPromises, constants } from 'fs';
import utils from '../../utilities/utilities';
import valid from '../../utilities/validateParams';
import thumbPath from '../../../images/thumb/imgThumb';
import fullImgPath from '../../../images/full/imgFull';


const imagesRoute = express.Router();

// IMG processing endpoint, expects query params (filename.extn, +width, +height)
imagesRoute.get(
  '/images',
  [valid.presentParams, valid.validateFileName, valid.validateSize], // middleware
  (req: express.Request, res: express.Response): void => {
    const filename = req.query.filename as unknown as string;

    const width = parseInt(req.query.width as string);
    const height = parseInt(req.query.height as string);
    const nameParts = filename.split('.');

    const thumbName = `${nameParts[0]}-${width}x${height}.${nameParts[1]}`;
    const imgPath = path.join(fullImgPath, filename);
    const newPath = path.join(thumbPath, thumbName);
    // console.log(imgPath);

    // async wrapper for resize IMG
    async function serveReq(): Promise<void> {

      try {
        // If requested resized img already chached, serve img
        await utils.checkFileExists(newPath)
          .then(async () => {
            res.statusCode = 200;
            res.sendFile(newPath);
            const msg = `${filename} cached @ ${newPath}`;
            valid.stamper(res.statusCode, req.ip, msg);
          }).catch(async () => {
              // Requested resized does not exist,
              // If original exists, resize and serve resized img
              await utils.checkFileExists(imgPath)
              .then(async () => {
                await utils.sharpResize(imgPath, newPath, width, height)
                res.statusCode = 200;
                res.sendFile(newPath);
                const msg = `${filename} resized @ ${newPath}`;
                valid.stamper(res.statusCode, req.ip, msg);
              })
              .catch((err) => {throw err});
          });
      } catch (err) {
        res.statusCode = 400;
        const msg = `Error: Could not locate the resources you looking for, (parsed filename: '${filename}')`;
        res.send(msg);
        valid.stamper(res.statusCode, req.ip, msg);
      }
    };
    serveReq();
  }
);

export default imagesRoute;
