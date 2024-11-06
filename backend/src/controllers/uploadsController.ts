import { Request, Response } from 'express';
const fs = require('fs');
const path = require('path');

export const getLocalImage = (req: Request, res: Response): void => {
  const { imageName } = req.query;

  const imagePath = path.join(__dirname, '..', '..', 'uploads', imageName as string);

  fs.access(imagePath, fs.constants.F_OK, (err: any) => {
    if (err) {
      res.status(404).send('Image not found');
      return;
    }

    res.sendFile(imagePath);
  });
};
