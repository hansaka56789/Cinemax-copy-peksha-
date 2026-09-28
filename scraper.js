const cheerio = require('cheerio');
const fs = require('fs');

const PAGES = {
  home: 'https://cinemaxlk.vercel.app/index.html',
  discover: 'https://cinemaxlk.vercel.app/discover.html',
};

(async () => {
  for (const [name, url] of Object.entries(PAGES)) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(await res.text());
    const movies = [];

    $('h3').each((_, el) => {
      const title = $(el).text().trim();
      const meta = $(el).next('p').text().trim();
      const img = $(el).prev('img').attr('src') || null;
      if (title) movies.push({ title, meta, img });
    });

    fs.writeFileSync(`data/${name}.json`, JSON.stringify({
      source: url,
      scraped_at: new Date().toISOString(),
      count: movies.length,
      results: movies,
    }, null, 2));

    console.log(`${name}: ${movies.length} items`);
  }
})();
