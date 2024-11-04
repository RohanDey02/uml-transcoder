import { Request, Response } from 'express';
import https from 'https';

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
          res.setHeader('Content-Type', contentType);
          const buffer = Buffer.concat(responseData);
          res.status(200).end(buffer);
        } else {
          const buffer = Buffer.concat(responseData);
          res.setHeader('Content-Type', contentType ?? 'application/octet-stream');
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