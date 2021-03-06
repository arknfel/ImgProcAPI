import express from 'express';
import path from 'path';
import utils from '../../utilities/utilities';
import valid from '../../utilities/validateParams';

const imagesRoute = express.Router();

// Images base directory
const imgsPath = path.join(__dirname, '../../..', 'images');

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

    const imgPath = path.join(imgsPath, 'full', filename);
    const newPath = path.join(imgsPath, 'thumb', thumbName);
    // console.log(imgPath);

    // async wrapper for resize IMG
    async function serveReq(): Promise<void> {
      try {
        // cache
        const resizedExists = utils.checkFileExists(newPath);
        const originalExists = utils.checkFileExists(imgPath);

        if (resizedExists === false && originalExists === true) {
          await utils.sharpResize(imgPath, newPath, width, height);
        } else if (originalExists === false) {
          throw new Error('requested image not found');
        }

        res.statusCode = 200;
        res.sendFile(newPath);
        const msg = `${filename} resized @ ${newPath}`;
        valid.stamper(res.statusCode, req.ip, msg);
      } catch (err) {
        res.statusCode = 400;
        const msg = `Error: Could not locate the resources you looking for, (parsed filename: ${filename})`;
        res.send(msg);
        valid.stamper(res.statusCode, req.ip, msg);
      }
    }
    serveReq();
  }
);

export default imagesRoute;
