import { Request, Response } from 'express';
import https from 'https';
const fs = require('fs');
const path = require('path');

export const requestWebContent = (async (req: Request, res: Response): Promise<void> => {
  const { targetUrl } = req.query;

  if (!targetUrl) {
    res.status(400).json({ error: 'Please provide a valid URL.' });
    return;
  }

  /*
   * NOTE: I am aware that it is a lot easier to just use fetch(), but I wanted to try out a different approach 🙂
   */
  try {
    // Parse the URL and extract hostname and path
    const { hostname, pathname } = new URL(targetUrl as string);
    const requestPath = pathname || '/';

    // Options for the HTTPS request
    const options = {
      hostname,
      path: requestPath,
      method: 'GET',
      headers: {
        'Connection': 'close'
      }
    };

    // Make the HTTPS request
    const request = https.request(options, (response) => {
      let responseData: Buffer[] = [];

      // Collect data chunks
      response.on('data', (chunk) => {
        responseData.push(chunk);
      });

      // Handle the end of the response
      response.on('end', () => {
        const contentType = response.headers['content-type'];

        if (contentType?.startsWith('image/')) {
          const uploadsDir = path.join(__dirname, '../../uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const imageName = `image_${Date.now()}.jpg`;
          const imagePath = path.join(uploadsDir, imageName);

          fs.writeFile(imagePath, Buffer.concat(responseData), (err: any) => {
            if (err) {
              console.error('Error saving image:', err);
              res.status(500).json({ error: 'Failed to save image.' });
              return;
            }

            res.status(200).json({ message: 'Image saved successfully.', path: imagePath });
          });
        } else {
          const buffer = Buffer.concat(responseData);
            if (contentType?.startsWith('text/') || contentType === 'application/json' || contentType === 'application/xml') {
              res.setHeader('Content-Type', contentType);
              res.status(200).end(buffer);
            } else {
              res.status(400).json({ error: 'Only text-based content is allowed.' });
            }
          res.status(200).end(buffer);
        }
      });
    });

    // Handle errors
    request.on('error', (error) => {
      console.error(error.message);
      res.status(500).json({ error: 'Failed to fetch content from the URL.' });
    });

    // End the request
    request.end();
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: 'Invalid URL or network error.' });
  }
});
