import fs from 'fs';
import sharp from 'sharp';

function checkFileExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
}

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
): Promise<string | boolean> {
  const resized = await sharp(imgPath)
    .resize(width, height)
    .toFile(newPath)
    .then(function (): boolean {
      // console.log("sharpResize Ran");
      return true;
    })
    .catch(function (err): string {
      // console.log("sharpResize Ran and errored");
      return `${err}`;
    });
  return resized;
}

export default { checkFileExists, sharpResize };
