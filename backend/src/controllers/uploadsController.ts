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

// TODO: Attach to a cron job to wipe at ~4:00 AM daily, etc.
export const wipeUploadsDir = (req: Request, res: Response): void => {
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

  fs.readdir(uploadsDir, (err: any, files: string[]) => {
    if (err) {
      res.status(500).send('Unable to read uploads directory');
      return;
    }

    for (const file of files) {
      fs.unlink(path.join(uploadsDir, file), (err: any) => {
        if (err) {
          res.status(500).send('Error deleting files');
          return;
        }
      });
    }

    res.send('Uploads directory wiped');
  });
};
