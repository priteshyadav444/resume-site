<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="container">
        <h1 class="admin-title">Blog Admin Panel</h1>
        <p class="admin-subtitle">Manage your blog posts and SEO settings</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Login Section -->
      <div v-if="!token" class="login-section">
        <div class="login-card">
          <h2 class="login-title">Admin Login</h2>
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email"
                v-model="email" 
                type="email"
                class="form-control" 
                placeholder="admin@local" 
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="password" 
                type="password" 
                class="form-control" 
                placeholder="Enter password" 
                required
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block">Login</button>
          </form>
          <div v-if="message" class="alert" :class="messageType">{{ message }}</div>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div v-else>
        <div class="admin-actions mb-4">
          <button class="btn btn-secondary" @click="logout">Logout</button>
          <NuxtLink to="/admin-portfolio" class="btn btn-outline">Manage Portfolio</NuxtLink>
          <NuxtLink to="/admin-menu" class="btn btn-outline">Manage Menu</NuxtLink>
        </div>

        <!-- Create/Edit Post Form -->
        <div class="admin-card mb-5">
          <h2 class="card-title">{{ editingPost ? 'Edit Post' : 'Create New Post' }}</h2>
          <form @submit.prevent="editingPost ? updatePost() : createPost()" class="post-form">
            <div class="row">
              <div class="col-md-8">
                <div class="form-group">
                  <label for="title">Title *</label>
                  <input 
                    id="title"
                    v-model="title" 
                    class="form-control" 
                    placeholder="Post title" 
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

            <div class="form-group">
              <label for="excerpt">Excerpt</label>
              <textarea 
                id="excerpt"
                v-model="excerpt" 
                class="form-control" 
                rows="3"
                placeholder="Short description for preview"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="content">Content (HTML) *</label>
              <textarea 
                id="content"
                v-model="content" 
                class="form-control" 
                rows="12"
                placeholder="HTML content"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="tags">Tags (comma separated)</label>
              <input 
                id="tags"
                v-model="tagsRaw" 
                class="form-control" 
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div class="form-group">
              <label for="publishedAt">Published Date</label>
              <input 
                id="publishedAt"
                v-model="publishedAt" 
                type="datetime-local"
                class="form-control"
              />
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
                  placeholder="SEO title (defaults to post title)"
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
                  placeholder="https://example.com/image.jpg"
                />
                <small class="form-help">Open Graph image for social sharing (1200x630px recommended)</small>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-success">
                {{ editingPost ? 'Update Post' : 'Create Post' }}
              </button>
              <button 
                v-if="editingPost"
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

        <!-- Existing Posts List -->
        <div class="admin-card">
          <h2 class="card-title">Existing Posts</h2>
          <div v-if="postsLoading" class="text-center py-4">
            <div class="spinner"></div>
          </div>
          <div v-else-if="posts.length === 0" class="text-center py-4 text-muted">
            <p>No posts yet. Create your first post above!</p>
          </div>
          <div v-else class="posts-list">
            <div v-for="post in posts" :key="post.id" class="post-item">
              <div class="post-info">
                <h4 class="post-item-title">{{ post.title }}</h4>
                <div class="post-meta">
                  <span class="post-slug">{{ post.slug }}</span>
                  <span class="post-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                  <span v-if="post.tags && post.tags.length" class="post-tags">
                    <span v-for="tag in post.tags" :key="tag" class="tag-badge">{{ tag }}</span>
                  </span>
                </div>
              </div>
              <div class="post-actions">
                <button class="btn btn-sm btn-primary" @click="editPost(post)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="deletePost(post.id)">Delete</button>
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
const config = useRuntimeConfig()

const email = ref('admin@local')
const password = ref('')
const token = ref(typeof window !== 'undefined' ? localStorage.getItem('blog_token') || '' : '')
const title = ref('')
const slug = ref('')
const excerpt = ref('')
const content = ref('')
const tagsRaw = ref('')
const publishedAt = ref('')
const metaTitle = ref('')
const metaDescription = ref('')
const ogImage = ref('')
const message = ref('')
const messageType = ref('alert-info')
const editingPost = ref(false)
const editingPostId = ref<number | null>(null)
const posts = ref<any[]>([])
const postsLoading = ref(false)

async function apiCall(endpoint: string, options: any = {}) {
  const headers: any = { 'Content-Type': 'application/json' }
  if (token.value) headers['Authorization'] = `Bearer ${token.value}`
  if (options.headers) Object.assign(headers, options.headers)
  
  return $fetch(`${config.public.apiUrl}${endpoint}`, {
    ...options,
    headers
  })
}

async function login() {
  try {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    const tokenVal = res.accessToken
    if (tokenVal) {
      token.value = tokenVal
      if (typeof window !== 'undefined') {
        localStorage.setItem('blog_token', tokenVal)
      }
      message.value = 'Logged in successfully'
      messageType.value = 'alert-success'
      await loadPosts()
    } else {
      message.value = 'Login failed. Check your credentials.'
      messageType.value = 'alert-danger'
    }
  } catch (error: any) {
    message.value = 'Login failed: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function logout() {
  token.value = ''
  if (typeof window !== 'undefined') {
    localStorage.removeItem('blog_token')
  }
  message.value = 'Logged out'
  messageType.value = 'alert-info'
  editingPost.value = false
  resetForm()
}

async function loadPosts() {
  postsLoading.value = true
  try {
    const res = await apiCall('/posts')
    posts.value = res || []
  } catch (error: any) {
    message.value = 'Error loading posts: ' + (error.message || 'Unknown error')
    messageType.value = 'alert-danger'
    posts.value = []
  } finally {
    postsLoading.value = false
  }
}

async function createPost() {
  const tags = tagsRaw.value.split(',').map(t => t.trim()).filter(Boolean)
  const input: any = {
    title: title.value,
    slug: slug.value,
    content: content.value,
    excerpt: excerpt.value || undefined,
    tags: tags.length > 0 ? tags : undefined,
    metaTitle: metaTitle.value || undefined,
    metaDescription: metaDescription.value || undefined,
    ogImage: ogImage.value || undefined,
  }
  
  if (publishedAt.value) {
    input.publishedAt = new Date(publishedAt.value).toISOString()
  }

  try {
    const res = await apiCall('/posts', {
      method: 'POST',
      body: input
    })
    message.value = `Post "${res.title}" created successfully!`
    messageType.value = 'alert-success'
    resetForm()
    await loadPosts()
  } catch (error: any) {
    message.value = 'Error creating post: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function editPost(post: any) {
  editingPost.value = true
  editingPostId.value = post.id
  title.value = post.title
  slug.value = post.slug
  excerpt.value = post.excerpt || ''
  content.value = post.content || ''
  tagsRaw.value = (post.tags || []).join(', ')
  publishedAt.value = post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''
  metaTitle.value = post.metaTitle || ''
  metaDescription.value = post.metaDescription || ''
  ogImage.value = post.ogImage || ''
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function updatePost() {
  if (!editingPostId.value) return
  
  const tags = tagsRaw.value.split(',').map(t => t.trim()).filter(Boolean)
  const input: any = {
    title: title.value,
    slug: slug.value,
    content: content.value,
    excerpt: excerpt.value || undefined,
    tags: tags.length > 0 ? tags : undefined,
    metaTitle: metaTitle.value || undefined,
    metaDescription: metaDescription.value || undefined,
    ogImage: ogImage.value || undefined,
  }
  
  if (publishedAt.value) {
    input.publishedAt = new Date(publishedAt.value).toISOString()
  }

  try {
    await apiCall(`/posts/${editingPostId.value}`, {
      method: 'PATCH',
      body: input
    })
    message.value = 'Post updated successfully!'
    messageType.value = 'alert-success'
    cancelEdit()
    await loadPosts()
  } catch (error: any) {
    message.value = 'Error updating post: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

async function deletePost(id: number) {
  if (!confirm('Are you sure you want to delete this post?')) return
  
  try {
    await apiCall(`/posts/${id}`, {
      method: 'DELETE'
    })
    message.value = 'Post deleted successfully'
    messageType.value = 'alert-success'
    await loadPosts()
  } catch (error: any) {
    message.value = 'Error deleting post: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function cancelEdit() {
  editingPost.value = false
  editingPostId.value = null
  resetForm()
}

function resetForm() {
  title.value = ''
  slug.value = ''
  excerpt.value = ''
  content.value = ''
  tagsRaw.value = ''
  publishedAt.value = ''
  metaTitle.value = ''
  metaDescription.value = ''
  ogImage.value = ''
}

function formatDate(value?: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  if (token.value) {
    loadPosts()
  }
})
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

.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1a202c;
}

.login-form {
  margin-bottom: 1rem;
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

.admin-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-form {
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

.btn-block {
  width: 100%;
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

.posts-list {
  margin-top: 1rem;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s ease;
}

.post-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-info {
  flex: 1;
}

.post-item-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.post-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;
}

.post-slug {
  font-family: monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.post-date {
  color: #718096;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-badge {
  background: #e6fffa;
  color: #234e52;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.post-actions {
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

.col-md-4, .col-md-8 {
  padding: 0 10px;
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .col-md-4 {
    flex: 0 0 33.333333%;
  }
  .col-md-8 {
    flex: 0 0 66.666667%;
  }
}
</style>
