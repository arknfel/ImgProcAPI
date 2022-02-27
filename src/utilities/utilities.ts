// import fs from 'fs';
import { promises as fsPromises, constants } from 'fs';
// import path from 'path';
import sharp from 'sharp';


// logger function
const stamper = function (
  statusCode: number,
  ip: string,
  err?: unknown
  // msg?: string
): void {
  console.log(`[${statusCode}] req from ${ip} @ ${Date.now()}: `);
  console.log(err);
};

async function checkFileExists(filePath: string) {
  await fsPromises.access(filePath, constants.F_OK)
    .catch((err) => {throw err}); 
}

// async wrap sharp.resize
async function sharpResize(
  imgPath: string,
  newPath: string,
  width: number,
  height: number
): Promise <void> {
  console.log('sharp ran!!');
  await sharp(imgPath)
    .resize(width, height)
    .toFile(newPath)
    // .then(() => {
    //   console.log("sharpResize Ran");
    // })
    .catch((err) => {
      // console.log("sharpResize Ran and errored");
      throw err;
    });
}

export default { checkFileExists, sharpResize, stamper };
