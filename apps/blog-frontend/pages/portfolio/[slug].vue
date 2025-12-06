<template>
  <article class="portfolio-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
      
      <div v-if="itemLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading project...</p>
      </div>

      <div v-else-if="!item" class="error-state">
        <h1>Project Not Found</h1>
        <p>The project you're looking for doesn't exist.</p>
        <NuxtLink to="/" class="btn btn-primary">Go Home</NuxtLink>
      </div>

      <div v-else class="portfolio-content">
        <header class="portfolio-header">
          <div class="portfolio-meta">
            <span class="portfolio-category">{{ item.category || 'Project' }}</span>
            <time :datetime="item.createdAt" class="portfolio-date">
              {{ formatDate(item.createdAt) }}
            </time>
          </div>
          <h1 class="portfolio-title">{{ item.title }}</h1>
          <p v-if="item.shortDescription" class="portfolio-description">{{ item.shortDescription }}</p>
        </header>

        <div v-if="item.ogImage || (item.images && item.images.length)" class="portfolio-featured-image">
          <img :src="item.ogImage || item.images[0]" :alt="item.title" />
        </div>

        <div v-if="item.images && item.images.length > 1" class="portfolio-gallery">
          <h2>Gallery</h2>
          <div class="gallery-grid">
            <div v-for="(image, index) in item.images" :key="index" class="gallery-item">
              <img :src="image" :alt="`${item.title} - Image ${index + 1}`" />
            </div>
          </div>
        </div>

        <div v-if="item.content" class="portfolio-body" v-html="item.content"></div>

        <div v-if="item.externalUrl" class="portfolio-actions">
          <a :href="item.externalUrl" target="_blank" rel="noopener" class="btn btn-primary">
            View Live Project →
          </a>
        </div>

        <footer class="portfolio-footer">
          <div class="portfolio-footer-content">
            <NuxtLink to="/" class="btn btn-outline">← Back to Home</NuxtLink>
            <div class="portfolio-share">
              <span class="share-label">Share:</span>
              <a 
                :href="twitterShareUrl"
                target="_blank"
                rel="noopener"
                class="share-link"
              >
                Twitter
              </a>
              <a 
                :href="linkedinShareUrl"
                target="_blank"
                rel="noopener"
                class="share-link"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import { useRoute } from 'vue-router'
import { useGqlClient } from '~/composables/gqlClient'
const route = useRoute()
const config = useRuntimeConfig()


const slug = route.params.slug as string
const { data: itemData, pending: itemLoading } = await useAsyncData(`portfolio-${slug}`, async () => {
  const query = `query ($slug:String!){ 
    portfolioBySlug(slug:$slug){ 
      id 
      title 
      slug 
      category 
      shortDescription 
      content 
      images 
      metaTitle 
      metaDescription 
      ogImage 
      externalUrl 
      createdAt 
    } 
  }`
  const { gql } = useGqlClient()
  const res = await gql(query, { slug })
  return res.data?.portfolioBySlug || null
})

const item = itemData

const shareUrl = computed(() => {
  if (!item.value) return ''
  return `${config.public.siteUrl}/portfolio/${item.value.slug}`
})

const twitterShareUrl = computed(() => {
  if (!item.value) return ''
  const title = item.value.title || ''
  const url = shareUrl.value
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
})

const linkedinShareUrl = computed(() => {
  if (!item.value) return ''
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
})

useHead(() => {
  if (!item.value) return { title: 'Portfolio item' }
  
  const title = item.value.metaTitle || item.value.title
  const description = item.value.metaDescription || item.value.shortDescription || ''
  const canonical = `${config.public.siteUrl}/portfolio/${item.value.slug}`
  const ogImage = item.value.ogImage || (item.value.images && item.value.images[0]) || ''
  
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : [])
    ],
    link: [{ rel: 'canonical', href: canonical }]
  }
})

function formatDate(value?: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.portfolio-page {
  min-height: 60vh;
  padding: 2rem 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #764ba2;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.portfolio-content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.portfolio-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.portfolio-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.portfolio-category {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.portfolio-date {
  color: #718096;
  font-size: 0.9rem;
}

.portfolio-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.portfolio-description {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  font-weight: 400;
}

.portfolio-featured-image {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
}

.portfolio-featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

.portfolio-gallery {
  margin: 3rem 0;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.portfolio-gallery h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #f7fafc;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.portfolio-body {
  margin-top: 2rem;
  line-height: 1.8;
  color: #2d3748;
  font-size: 1.1rem;
}

.portfolio-body :deep(h1),
.portfolio-body :deep(h2),
.portfolio-body :deep(h3),
.portfolio-body :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a202c;
  font-weight: 700;
}

.portfolio-body :deep(h1) {
  font-size: 2rem;
}

.portfolio-body :deep(h2) {
  font-size: 1.75rem;
}

.portfolio-body :deep(h3) {
  font-size: 1.5rem;
}

.portfolio-body :deep(p) {
  margin-bottom: 1.5rem;
}

.portfolio-body :deep(ul),
.portfolio-body :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.portfolio-body :deep(li) {
  margin-bottom: 0.5rem;
}

.portfolio-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid #667eea;
  transition: color 0.2s ease;
}

.portfolio-body :deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

.portfolio-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.portfolio-actions {
  margin: 3rem 0;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
  text-align: center;
}

.portfolio-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.portfolio-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.portfolio-share {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.share-label {
  color: #718096;
  font-weight: 600;
}

.share-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.share-link:hover {
  color: #764ba2;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .portfolio-content {
    padding: 1.5rem;
  }

  .portfolio-title {
    font-size: 2rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .portfolio-footer-content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
