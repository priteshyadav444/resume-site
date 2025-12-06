<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Welcome to My Portfolio & Blog</h1>
        <p class="hero-subtitle">Explore my projects and read my latest articles</p>
      </div>
    </section>

    <!-- Featured Portfolio Section -->
    <section class="portfolio-section py-5">
      <div class="container">
        <div class="section-header mb-5">
          <h2 class="section-title">Featured Projects</h2>
          <div class="title-underline"></div>
        </div>
        <div v-if="portfolioLoading" class="text-center py-5">
          <div class="spinner"></div>
        </div>
        <div v-else-if="portfolioItems.length === 0" class="text-center py-5 text-muted">
          <p>No featured projects yet.</p>
        </div>
        <div v-else class="row g-4">
          <div v-for="item in portfolioItems" :key="item.id" class="col-lg-4 col-md-6">
            <div class="portfolio-card">
              <div v-if="item.images && item.images.length" class="portfolio-image">
                <img :src="item.images[0]" :alt="item.title" />
              </div>
              <div class="portfolio-content">
                <div class="portfolio-category">{{ item.category }}</div>
                <h3 class="portfolio-title">
                  <NuxtLink :to="`/portfolio/${item.slug}`">{{ item.title }}</NuxtLink>
                </h3>
                <p class="portfolio-description">{{ item.shortDescription }}</p>
                <NuxtLink :to="`/portfolio/${item.slug}`" class="btn-read-more">View Project →</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
    <section class="blog-section py-5 bg-light">
      <div class="container">
        <div class="section-header mb-5">
          <h2 class="section-title">Latest Blog Posts</h2>
          <div class="title-underline"></div>
        </div>
        <div v-if="postsLoading" class="text-center py-5">
          <div class="spinner"></div>
        </div>
        <div v-else-if="posts.length === 0" class="text-center py-5 text-muted">
          <p>No blog posts yet.</p>
        </div>
        <div v-else class="row g-4">
          <div v-for="post in posts" :key="post.id" class="col-lg-4 col-md-6">
            <article class="blog-card">
              <div v-if="post.ogImage" class="blog-image">
                <img :src="post.ogImage" :alt="post.title" />
              </div>
              <div class="blog-content">
                <div class="blog-meta">
                  <span class="blog-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                  <span v-if="post.tags && post.tags.length" class="blog-tags">
                    <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                  </span>
                </div>
                <h3 class="blog-title">
                  <NuxtLink :to="`/post/${post.id}`">{{ post.title }}</NuxtLink>
                </h3>
                <p class="blog-excerpt">{{ post.excerpt || truncateText(post.content, 120) }}</p>
                <NuxtLink :to="`/post/${post.id}`" class="btn-read-more">Read More →</NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead, useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

async function gql(query: string, variables = {}) {
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })
}

const { data: portfolioData, pending: portfolioLoading } = await useAsyncData('featured-portfolio', async () => {
  const query = `query { 
    featuredPortfolio { 
      id 
      title 
      slug 
      category 
      shortDescription 
      images 
      createdAt 
    } 
  }`
  const res = await gql(query)
  return res.data?.featuredPortfolio || []
})

const { data: postsData, pending: postsLoading } = await useAsyncData('posts', async () => {
  const query = `query { 
    posts { 
      id 
      title 
      slug 
      excerpt 
      content 
      tags 
      publishedAt 
      createdAt 
      ogImage 
    } 
  }`
  const res = await gql(query)
  return res.data?.posts || []
})

const portfolioItems = portfolioData
const posts = postsData

useHead({
  title: 'Home — Portfolio & Blog',
  meta: [
    { name: 'description', content: 'Explore featured projects and latest blog posts.' }
  ]
})

function formatDate(value?: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function truncateText(html: string, length: number) {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length > length ? text.slice(0, length) + '...' : text
}
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto;
  border-radius: 2px;
}

/* Portfolio Cards */
.portfolio-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.portfolio-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f7fafc;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio-card:hover .portfolio-image img {
  transform: scale(1.05);
}

.portfolio-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.portfolio-category {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.portfolio-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.portfolio-title a {
  color: #1a202c;
  text-decoration: none;
  transition: color 0.2s ease;
}

.portfolio-title a:hover {
  color: #667eea;
}

.portfolio-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

/* Blog Cards */
.blog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.blog-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f7fafc;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-image img {
  transform: scale(1.05);
}

.blog-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.blog-date {
  font-size: 0.875rem;
  color: #718096;
}

.blog-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 4px;
}

.blog-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.blog-title a {
  color: #1a202c;
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-title a:hover {
  color: #667eea;
}

.blog-excerpt {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.btn-read-more {
  display: inline-block;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-top: auto;
}

.btn-read-more:hover {
  color: #764ba2;
}

.bg-light {
  background-color: #f7fafc;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.text-muted {
  color: #718096;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
