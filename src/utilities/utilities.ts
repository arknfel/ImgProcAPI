// import fs from 'fs';
import { promises as fsPromises, constants } from 'fs';
// import path from 'path';
import sharp from 'sharp';


// async function checkFileExists(filePath: string): Promise <void> {
//   try {
//     fsPromises.access(filePath, constants.F_OK);
//     console.log("RETURN TRUE");
//   } catch (err) {
//     throw new Error(`File "${filePath}" not found`);
//   }
// } 

async function checkFileExists(filePath: string) {
  await fsPromises.access(filePath, constants.F_OK)
    .catch((err) => {throw err}); 
}
// function checkFileExists(filePath: string) {
//   if (fs.existsSync(filePath)) {
//     return true;
//   } else {
//     return false;
//   }
// }

// Using sharp to resize IMG
// Wrapping sharp() in an async function
// which fixes the issue where I had to use setTimeout
// to prevent res.sendFile from running
// before the file is generated.
async function sharpResize(
  imgPath: string,
  newPath: string,
  width: number,
  height: number
): Promise <void> {
  await sharp(imgPath)
    .resize(width, height)
    .toFile(newPath)
    .then(function () {
      // console.log("sharpResize Ran");
      // return true;
    })
    .catch(function (err) {
      // console.log("sharpResize Ran and errored");
      // return `${err}`;
      throw err;
    });
  // return resized;
}

export default { checkFileExists, sharpResize };
