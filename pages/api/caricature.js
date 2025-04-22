import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      const imageFile = files.image;
      const imageData = fs.readFileSync(imageFile.filepath);
      const base64Image = imageData.toString('base64');

      const response = await fetch('https://api.lightxeditor.com/external/api/v1/caricature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.LIGHTX_API_KEY,
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          textPrompt: 'cartoon caricature',
        }),
      });

      const result = await response.json();
      res.status(200).json({ caricatureUrl: result.imageUrl });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}