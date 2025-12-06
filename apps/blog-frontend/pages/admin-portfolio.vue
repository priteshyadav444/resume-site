<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="container">
        <h1 class="admin-title">Portfolio Admin Panel</h1>
        <p class="admin-subtitle">Manage your portfolio items and SEO settings</p>
      </div>
    </div>

    <div class="container py-5">
      <div v-if="!token" class="login-prompt">
        <div class="alert alert-warning">
          <p>Please <NuxtLink to="/admin">login via /admin</NuxtLink> first.</p>
        </div>
      </div>

      <div v-else>
        <div class="admin-actions mb-4">
          <button class="btn btn-secondary" @click="logout">Logout</button>
          <NuxtLink to="/admin" class="btn btn-outline">Manage Blog</NuxtLink>
          <NuxtLink to="/admin-menu" class="btn btn-outline">Manage Menu</NuxtLink>
        </div>

        <!-- Create/Edit Form -->
        <div class="admin-card mb-5">
          <h2 class="card-title">{{ editing ? 'Edit Portfolio Item' : 'Create New Portfolio Item' }}</h2>
          <form @submit.prevent="editing ? updateItem() : createItem()" class="portfolio-form">
            <div class="row">
              <div class="col-md-8">
                <div class="form-group">
                  <label for="title">Title *</label>
                  <input 
                    id="title"
                    v-model="title" 
                    class="form-control" 
                    placeholder="Project title" 
                    required
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="slug">Slug *</label>
                  <input 
                    id="slug"
                    v-model="slug" 
                    class="form-control" 
                    placeholder="url-friendly-slug" 
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="category">Category</label>
                  <input 
                    id="category"
                    v-model="category" 
                    class="form-control" 
                    placeholder="e.g., Web Development, Mobile App"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="externalUrl">External URL</label>
                  <input 
                    id="externalUrl"
                    v-model="externalUrl" 
                    class="form-control" 
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="shortDescription">Short Description</label>
              <textarea 
                id="shortDescription"
                v-model="shortDescription" 
                class="form-control" 
                rows="3"
                placeholder="Brief description for preview cards"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="content">Content (HTML)</label>
              <textarea 
                id="content"
                v-model="content" 
                class="form-control" 
                rows="10"
                placeholder="Full project description in HTML"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="imagesRaw">Image URLs (comma separated)</label>
              <textarea 
                id="imagesRaw"
                v-model="imagesRaw" 
                class="form-control" 
                rows="3"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              ></textarea>
              <small class="form-help">Enter image URLs separated by commas</small>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="featured" />
                <span>Featured Project</span>
              </label>
            </div>

            <!-- SEO Section -->
            <div class="seo-section">
              <h3 class="seo-title">SEO Settings</h3>
              <div class="form-group">
                <label for="metaTitle">Meta Title</label>
                <input 
                  id="metaTitle"
                  v-model="metaTitle" 
                  class="form-control" 
                  placeholder="SEO title (defaults to project title)"
                />
                <small class="form-help">Recommended: 50-60 characters</small>
              </div>

              <div class="form-group">
                <label for="metaDescription">Meta Description</label>
                <textarea 
                  id="metaDescription"
                  v-model="metaDescription" 
                  class="form-control" 
                  rows="3"
                  placeholder="SEO description"
                ></textarea>
                <small class="form-help">Recommended: 150-160 characters</small>
              </div>

              <div class="form-group">
                <label for="ogImage">OG Image URL</label>
                <input 
                  id="ogImage"
                  v-model="ogImage" 
                  class="form-control" 
                  placeholder="https://example.com/og-image.jpg"
                />
                <small class="form-help">Open Graph image for social sharing (1200x630px recommended)</small>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-success">
                {{ editing ? 'Update Item' : 'Create Item' }}
              </button>
              <button 
                v-if="editing"
                type="button" 
                class="btn btn-secondary" 
                @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </form>
          <div v-if="message" class="alert mt-3" :class="messageType">{{ message }}</div>
        </div>

        <!-- Existing Items List -->
        <div class="admin-card">
          <h2 class="card-title">Existing Portfolio Items</h2>
          <div v-if="itemsLoading" class="text-center py-4">
            <div class="spinner"></div>
          </div>
          <div v-else-if="items.length === 0" class="text-center py-4 text-muted">
            <p>No portfolio items yet. Create your first item above!</p>
          </div>
          <div v-else class="portfolio-grid">
            <div v-for="it in items" :key="it.id" class="portfolio-item-card">
              <div v-if="it.images && it.images.length" class="item-image">
                <img :src="it.images[0]" :alt="it.title" />
              </div>
              <div class="item-content">
                <div class="item-header">
                  <h4 class="item-title">{{ it.title }}</h4>
                  <span v-if="it.featured" class="featured-badge">Featured</span>
                </div>
                <div class="item-meta">
                  <span class="item-category">{{ it.category || 'Uncategorized' }}</span>
                  <span class="item-date">{{ formatDate(it.createdAt) }}</span>
                </div>
                <p class="item-description">{{ it.shortDescription || 'No description' }}</p>
                <div class="item-actions">
                  <button class="btn btn-sm btn-primary" @click="edit(it)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="remove(it.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGqlClient } from '~/composables/gqlClient'
const { gql } = useGqlClient()
const token = ref(typeof window !== 'undefined' ? localStorage.getItem('blog_token') || '' : '')

const title = ref('')
const slug = ref('')
const category = ref('')
const shortDescription = ref('')
const imagesRaw = ref('')
const featured = ref(false)
const externalUrl = ref('')
const metaTitle = ref('')
const metaDescription = ref('')
const ogImage = ref('')
const content = ref('')

const items = ref<any[]>([])
const message = ref('')
const messageType = ref('alert-info')
const editing = ref(false)
const editingId = ref<number | null>(null)
const itemsLoading = ref(false)

// Use GraphQL client for backend operations
async function apiCallGraphQL(query: string, variables: any = {}, useToken = true) {
  return gql(query, variables, useToken ? token.value : undefined)
}

function logout() {
  token.value = ''
  if (typeof window !== 'undefined') {
    localStorage.removeItem('blog_token')
  }
  editing.value = false
  resetForm()
}

async function load() {
  itemsLoading.value = true
  try {
    const query = `query { portfolioItems { id title slug category shortDescription images featured externalUrl createdAt } }`
    const res = await apiCallGraphQL(query, {}, false)
    items.value = res.data?.portfolioItems || []
  } catch (error: any) {
    message.value = 'Error loading items: ' + (error.message || 'Unknown error')
    messageType.value = 'alert-danger'
    items.value = []
  } finally {
    itemsLoading.value = false
  }
}

onMounted(() => {
  if (token.value) {
    load()
  }
})

async function createItem() {
  const images = imagesRaw.value.split(',').map((s: any) => s.trim()).filter(Boolean)
  const input: any = {
    title: title.value,
    slug: slug.value,
    category: category.value || undefined,
    shortDescription: shortDescription.value || undefined,
    images: images.length > 0 ? images : [],
    featured: featured.value,
    externalUrl: externalUrl.value || undefined,
    metaTitle: metaTitle.value || undefined,
    metaDescription: metaDescription.value || undefined,
    ogImage: ogImage.value || undefined,
    content: content.value || undefined
  }
  
  try {
    const mutation = `mutation($input:CreatePortfolioInput!){ createPortfolioItem(input:$input){ id title slug } }`
    const res = await apiCallGraphQL(mutation, { input })
    const created = res.data?.createPortfolioItem
    message.value = created ? 'Portfolio item created successfully!' : 'Portfolio item created'
    messageType.value = 'alert-success'
    resetForm()
    await load()
  } catch (error: any) {
    message.value = 'Error creating item: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function edit(it: any) {
  editing.value = true
  editingId.value = it.id
  title.value = it.title
  slug.value = it.slug
  category.value = it.category || ''
  shortDescription.value = it.shortDescription || ''
  imagesRaw.value = (it.images || []).join(', ')
  featured.value = !!it.featured
  externalUrl.value = it.externalUrl || ''
  metaTitle.value = it.metaTitle || ''
  metaDescription.value = it.metaDescription || ''
  ogImage.value = it.ogImage || ''
  content.value = it.content || ''
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editing.value = false
  editingId.value = null
  resetForm()
}

async function updateItem() {
  if (!editingId.value) return
  const images = imagesRaw.value.split(',').map((s: any) => s.trim()).filter(Boolean)
  const input: any = {
    title: title.value,
    slug: slug.value,
    category: category.value || undefined,
    shortDescription: shortDescription.value || undefined,
    images: images.length > 0 ? images : [],
    featured: featured.value,
    externalUrl: externalUrl.value || undefined,
    metaTitle: metaTitle.value || undefined,
    metaDescription: metaDescription.value || undefined,
    ogImage: ogImage.value || undefined,
    content: content.value || undefined
  }
  
  try {
    const mutation = `mutation($input:UpdatePortfolioInput!){ updatePortfolioItem(input:$input){ id title slug } }`
    await apiCallGraphQL(mutation, { input: { id: editingId.value, ...input } })
    message.value = 'Portfolio item updated successfully!'
    messageType.value = 'alert-success'
    editing.value = false
    editingId.value = null
    await load()
  } catch (error: any) {
    message.value = 'Error updating item: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

async function remove(id: number) {
  if (!confirm('Are you sure you want to delete this portfolio item?')) return
  
  try {
    const mutation = `mutation($id:Int!){ deletePortfolioItem(id:$id) }`
    await apiCallGraphQL(mutation, { id })
    message.value = 'Portfolio item deleted successfully'
    messageType.value = 'alert-success'
    await load()
  } catch (error: any) {
    message.value = 'Error deleting item: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function resetForm() {
  title.value = ''
  slug.value = ''
  category.value = ''
  shortDescription.value = ''
  imagesRaw.value = ''
  featured.value = false
  externalUrl.value = ''
  metaTitle.value = ''
  metaDescription.value = ''
  ogImage.value = ''
  content.value = ''
}

function formatDate(value?: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f7fafc;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.login-prompt {
  margin-top: 2rem;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.alert-warning {
  background: #fef5e7;
  color: #744210;
  border: 1px solid #f6e05e;
}

.alert-warning a {
  color: #667eea;
  font-weight: 600;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.portfolio-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-help {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #718096;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.seo-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.seo-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-success {
  background: #48bb78;
  color: white;
}

.btn-success:hover {
  background: #38a169;
}

.btn-secondary {
  background: #718096;
  color: white;
}

.btn-secondary:hover {
  background: #4a5568;
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover {
  background: #e53e3e;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.alert-info {
  background: #bee3f8;
  color: #2c5282;
}

.alert-success {
  background: #c6f6d5;
  color: #22543d;
}

.alert-danger {
  background: #fed7d7;
  color: #742a2a;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.portfolio-item-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.portfolio-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f7fafc;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  padding: 1.25rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  flex: 1;
}

.featured-badge {
  background: #fef5e7;
  color: #744210;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.item-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
}

.item-category {
  color: #667eea;
  font-weight: 600;
}

.item-date {
  color: #718096;
}

.item-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
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

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.col-md-4, .col-md-6, .col-md-8 {
  padding: 0 10px;
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 33.333333%;
  }
  .col-md-6 {
    flex: 0 0 50%;
  }
  .col-md-8 {
    flex: 0 0 66.666667%;
  }
}
</style>
