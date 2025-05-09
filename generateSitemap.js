// const puppeteer = require('puppeteer');
// const { SitemapStream, streamToPromise } = require('sitemap');
// const { createWriteStream } = require('fs');

// async function getAllInternalLinks(url) {
//   const browser = await puppeteer.launch({ headless: 'new' });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const links = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll('a[href]'))
//       .map(a => a.getAttribute('href'))
//       .filter(href =>
//         href &&
//         href.startsWith('/') &&
//         !href.startsWith('//') &&
//         !href.includes('#') &&
//         !href.startsWith('mailto:')
//       );
//   });

//   await browser.close();
//   return Array.from(new Set(links)).sort();
// }

// async function generateSitemap(baseUrl, outputPath) {
//   const links = await getAllInternalLinks(baseUrl);

//   if (links.length === 0) {
//     throw new Error('No internal links found. Site may be blocking crawlers.');
//   }

//   const sitemapStream = new SitemapStream({ hostname: baseUrl });
//   const writeStream = createWriteStream(outputPath);
//   sitemapStream.pipe(writeStream);

//   links.forEach(link => {
//     sitemapStream.write({ url: link, changefreq: 'weekly', priority: 0.7 });
//   });

//   sitemapStream.end();
//   await streamToPromise(sitemapStream);
// }

// module.exports = generateSitemap;
const puppeteer = require('puppeteer');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

async function getAllInternalLinks(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'networkidle2' });

  // ✅ Use this instead of page.waitForTimeout()
  await new Promise(resolve => setTimeout(resolve, 3000));

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.getAttribute('href'))
      .filter(href =>
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.includes('#') &&
        !href.startsWith('mailto:')
      );
  });

  await browser.close();
  return Array.from(new Set(links)).sort();
}

async function generateSitemap(baseUrl, outputPath) {
  const links = await getAllInternalLinks(baseUrl);

  if (links.length === 0) {
    throw new Error('No internal links found. Site may be blocking crawlers.');
  }

  const sitemapStream = new SitemapStream({ hostname: baseUrl });
  const writeStream = createWriteStream(outputPath);
  sitemapStream.pipe(writeStream);

  links.forEach(link => {
    sitemapStream.write({
      url: link,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  sitemapStream.end();
  await streamToPromise(sitemapStream);
}

module.exports = generateSitemap;
