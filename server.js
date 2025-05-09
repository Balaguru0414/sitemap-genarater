

// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');
// const generateSitemap = require('./generateSitemap');

// const app = express();
// const PORT = 3000;

// app.use(express.static('public'));
// app.use(bodyParser.json());

// app.post('/generate-sitemap', async (req, res) => {
//   const { url } = req.body;

//   if (!url || !url.startsWith('http')) {
//     return res.status(400).json({ message: 'Invalid URL.' });
//   }

//   try {
//     const hostname = new URL(url).hostname.replace('www.', '');
//     const folderPath = path.join(__dirname, 'sitemaps', hostname);
//     const filePath = path.join(folderPath, 'sitemap.xml');

//     // Ensure directory exists
//     fs.mkdirSync(folderPath, { recursive: true });

//     await generateSitemap(url, filePath);

//     res.json({ message: `Sitemap generated at /sitemaps/${hostname}/sitemap.xml` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to generate sitemap.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const generateSitemap = require('./generateSitemap');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/sitemaps', express.static(path.join(__dirname, 'sitemaps')));
app.use(bodyParser.json());

app.post('/generate-sitemap', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid URL.' });
  }

  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const folderPath = path.join(__dirname, 'sitemaps', hostname);
    const filePath = path.join(folderPath, 'sitemap.xml');

    fs.mkdirSync(folderPath, { recursive: true });

    await generateSitemap(url, filePath);

    const sitemapPath = `/sitemaps/${hostname}/sitemap.xml`;
    res.json({ message: 'Sitemap generated successfully.', path: sitemapPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate sitemap.' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
