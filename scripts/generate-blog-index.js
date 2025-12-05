// Simple blog index generator
// Scans public/blog/*.html (excluding index.html and post-template.html) and generates public/blog/index.html

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const BLOG_DIR = path.join(__dirname, '..', 'public', 'blog');
const TEMPLATE = path.join(BLOG_DIR, 'index.template.html');
const OUTPUT = path.join(BLOG_DIR, 'index.html');

function readHtmlFiles() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  return files.filter(f => !['index.html', 'index.template.html', 'post-template.html'].includes(f))
              .map(f => path.join(BLOG_DIR, f));
}

function extractMeta(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  const title = $('head title').first().text() || $('h1').first().text() || 'Untitled';
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';

  // Try to find date: time[datetime] inside article or JSON-LD
  let date = '';
  const timeEl = $('time[datetime]').first();
  if (timeEl && timeEl.attr('datetime')) {
    date = timeEl.attr('datetime');
  } else {
    // Try JSON-LD datePublished
    const jsonLd = $('script[type="application/ld+json"]').first().html() || '';
    try {
      const parsed = JSON.parse(jsonLd);
      if (parsed && parsed.datePublished) date = parsed.datePublished;
    } catch (e) {
      // ignore
    }
  }

  // Excerpt: first paragraph inside article
  const excerpt = $('article p').first().text().trim() || $('p').first().text().trim() || '';

  return {
    file: path.basename(filePath),
    title,
    description,
    keywords,
    canonical,
    date: date || '1970-01-01',
    excerpt
  };
}

function buildPostCard(meta) {
  const displayDate = dayjs(meta.date).format('MMM D, YYYY');
  const excerpt = meta.excerpt.length > 200 ? meta.excerpt.slice(0, 197) + '...' : meta.excerpt;
  return `
  <div class="col-md-6">
    <article class="post-card">
      <h2><a href="${meta.file}">${meta.title}</a></h2>
      <div class="meta">${displayDate} • <span class="badge bg-light text-dark">${meta.keywords.split(',')[0] || 'Post'}</span></div>
      <p class="excerpt">${excerpt}</p>
      <a href="${meta.file}" class="btn btn-sm btn-primary">Read more</a>
    </article>
  </div>
  `;
}

function generate() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error('Template not found:', TEMPLATE);
    process.exit(1);
  }
  const postFiles = readHtmlFiles();
  const metas = postFiles.map(extractMeta);
  // Sort by date desc
  metas.sort((a,b)=> dayjs(b.date).unix() - dayjs(a.date).unix());

  const cards = metas.map(buildPostCard).join('\n');

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const output = template.replace('<!-- POSTS_LIST -->', `\n<div class="row g-4">\n${cards}\n</div>\n`);
  fs.writeFileSync(OUTPUT, output, 'utf8');
  console.log('Generated', OUTPUT, 'with', metas.length, 'posts');
}

generate();
