<template>
  <article class="post-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
      
      <div v-if="postLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading post...</p>
      </div>

      <div v-else-if="!post" class="error-state">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <NuxtLink to="/" class="btn btn-primary">Go Home</NuxtLink>
      </div>

      <div v-else class="post-content">
        <header class="post-header">
          <div class="post-meta">
            <time :datetime="post.publishedAt || post.createdAt" class="post-date">
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </time>
            <div v-if="post.tags && post.tags.length" class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
        </header>

        <div v-if="post.ogImage" class="post-featured-image">
          <img :src="post.ogImage" :alt="post.title" />
        </div>

        <div class="post-body" v-html="post.content"></div>

        <footer class="post-footer">
          <div class="post-footer-content">
            <NuxtLink to="/" class="btn btn-outline">← Back to Home</NuxtLink>
            <div class="post-share">
              <span class="share-label">Share:</span>
              <a 
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener"
                class="share-link"
              >
                Twitter
              </a>
              <a 
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`"
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
import { useHead, useRuntimeConfig } from '#imports'
const route = useRoute()
const config = useRuntimeConfig()

async function gql(query: string, variables = {}, token?: string) {
  const headers: any = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
}

const id = parseInt(route.params.id as string)
const { data: postData, pending: postLoading } = await useAsyncData(`post-${id}`, async () => {
  const query = `query ($id:Int!){ 
    postById(id:$id){ 
      id 
      title 
      slug 
      content 
      excerpt 
      tags 
      publishedAt 
      createdAt 
      metaTitle 
      metaDescription 
      ogImage 
    } 
  }`
  const res = await gql(query, { id })
  return res.data?.postById || null
})

const post = postData

const shareUrl = computed(() => {
  if (!post.value) return ''
  return `${config.public.siteUrl}/post/${post.value.id}`
})

useHead(() => {
  if (!post.value) return { title: 'Post' }
  
  const title = post.value.metaTitle || post.value.title
  const description = post.value.metaDescription || post.value.excerpt || stripHtml(post.value.content).slice(0, 160)
  const canonical = `${config.public.siteUrl}/post/${post.value.id}`
  const ogImage = post.value.ogImage || ''
  
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
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

function stripHtml(html: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

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
.post-page {
  min-height: 60vh;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
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

.post-content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.post-date {
  color: #718096;
  font-size: 0.9rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #e6fffa;
  color: #234e52;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.post-excerpt {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  font-weight: 400;
}

.post-featured-image {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
}

.post-featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-body {
  margin-top: 2rem;
  line-height: 1.8;
  color: #2d3748;
  font-size: 1.1rem;
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3),
.post-body :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a202c;
  font-weight: 700;
}

.post-body :deep(h1) {
  font-size: 2rem;
}

.post-body :deep(h2) {
  font-size: 1.75rem;
}

.post-body :deep(h3) {
  font-size: 1.5rem;
}

.post-body :deep(p) {
  margin-bottom: 1.5rem;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.post-body :deep(li) {
  margin-bottom: 0.5rem;
}

.post-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid #667eea;
  transition: color 0.2s ease;
}

.post-body :deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.post-body :deep(code) {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.post-body :deep(pre) {
  background: #1a202c;
  color: #cbd5e1;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.post-body :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #4a5568;
  font-style: italic;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.post-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.post-share {
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
  .post-content {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 2rem;
  }

  .post-footer-content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
