import express from 'express';
import path from 'path';
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

    let msg: string;


    // async wrapper for resize IMG
    async function serveImg(): Promise<void> {
      try {

        // step1: check if requested img has a resized cached one
        await utils.checkFileExists(newPath)

          // step1: if cached exists, proceed to send it (last step)
          .then(async (): Promise <void> => {
            msg = `${filename} cached @ ${newPath}`;
            res.status(200);
          })

          // step1: if cached does not exist,
          .catch(async (): Promise <void> => {

            // step2: check if requested original img exists
            await utils.checkFileExists(imgPath)

              // step2: if yes, resize it
              .then(async (): Promise <void> => {

                // step3: resizing
                await utils.sharpResize(imgPath, newPath, width, height)

                  // step3: if resized successfully, will
                  // proceed to (last step) to send it
                  .then((): void => {
                    msg = `${filename} resized @ ${newPath}`;
                    res.status(200);
                  })

                  // step3: if could not resize it, go to (last step) with code 500
                  .catch((err): void => {
                    msg = `Could not resize your img ${filename}`;
                    res.status(500);
                    throw err;
                  });
              })
              // step2: if original requested img does not exist,
              // go to last step with code 404
              .catch((err): void => {
                res.status(404);
                msg = `Could not find requested img ${filename}`;
                throw err;
              });
          })

          // last step: send img with code 200
          .then((): void => {
            res.sendFile(newPath);
            utils.stamper(res.statusCode, req.ip, msg);
          });
      }
      // Any exceptions from the above promises
      // will propagate to this catch to log it,
      // and respond with the corresponding message
      catch (err) {
        res.send(msg);
        utils.stamper(res.statusCode, req.ip, err);
      }
    }; // serveImg definition ends

    // back to imagesRoute.get() callback scope
    serveImg();
  }
);

export default imagesRoute;
