import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3000);
const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');
const directory = path.dirname(fileURLToPath(import.meta.url));


//API ZAHTEVE

app.use(express.json());
app.use('/api', async (req, res) => {
  try {
    const response = await fetch(`${backendUrl}/api${req.url}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: JSON.stringify(req.body) })
    });
    const body = await response.text();
    res.status(response.status);
    if (body) res.type(response.headers.get('content-type') || 'application/json').send(body);
    else res.end();
  } catch (error) {
    res.status(502).json({ error: 'Povezava z zaledjem ni uspela.', detail: error.message });
  }
});

app.use('/slike', express.static(path.join(directory, '..', 'slike'), {
  setHeaders(res, filePath) {
    // The supplied .jpg asset is encoded as WebP despite its filename.
    if (filePath.endsWith('.jpg')) res.setHeader('Content-Type', 'image/webp');
  }
}));
app.use(express.static(path.join(directory, 'public')));
app.listen(port, () => {
  console.log(`Uporabniški vmesnik je na http://localhost:${port}`);
  console.log(`Zaledni API: ${backendUrl}/api/recepti`);
});
