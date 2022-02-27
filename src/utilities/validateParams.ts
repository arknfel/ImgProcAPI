import express from 'express';
import utils from '../utilities/utilities';

// Check if all params are present
const presentParams = function (
  req: express.Request,
  res: express.Response,
  next: Function
): void {
  if (
    'filename' in req.query &&
    'width' in req.query &&
    'height' in req.query
  ) {
    next();
  } else {
    const msg = `could not parse all required params, parsed 
            ( filename: ${req.query.filename}, width: ${req.query.width}, height: ${req.query.height}`;
    res.status(400).send(msg);
    utils.stamper(res.statusCode, req.ip, new Error(msg));
  }
};

// Checks if the filename is correct and has an extension
const validateFileName = function (
  req: express.Request,
  res: express.Response,
  next: Function
): void {
  const filename = req.query.filename as unknown as string;
  const msg = 'missing file extension'; // err msg
  try {
    if (filename.split('.').length !== 2) {
      res.status(404).send(msg);
      utils.stamper(res.statusCode, req.ip, new Error(msg));

      // next() must be wrapped by the else statement
      // since that incase the if statement is true, the response
      // body will be modified.
    } else {
      next();
    }
  } catch (err) {
    res.status(404).send(msg);
    utils.stamper(res.statusCode, req.ip, err);
  }
};

// Checks if W and H are valid values (numeric and > 0)
const validateSize = function (
  req: express.Request,
  res: express.Response,
  next: Function
): void {
  const width = req.query.width as unknown as string;
  const height = req.query.height as unknown as string;
  const msg = `invalid width and/or height, parsed: width=${width}, height=${height}`; // err msg
  try {
    if (
      isNaN(parseInt(width)) ||
      isNaN(parseInt(height)) ||
      parseInt(width) <= 0 ||
      parseInt(height) <= 0
    ) {
      res.status(400).send(msg);
      utils.stamper(res.statusCode, req.ip, new Error(msg));
    } else {
      next();
    }
  } catch (err) {
    res.status(400).send(msg);
    utils.stamper(res.statusCode, req.ip, err);
  }
};

export default {
  presentParams,
  validateFileName,
  validateSize
};
