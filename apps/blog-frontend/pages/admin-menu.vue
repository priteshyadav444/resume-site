<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="container">
        <h1 class="admin-title">Menu Admin Panel</h1>
        <p class="admin-subtitle">Manage your navigation menu items</p>
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
          <NuxtLink to="/admin-portfolio" class="btn btn-outline">Manage Portfolio</NuxtLink>
        </div>

        <!-- Create/Edit Form -->
        <div class="admin-card mb-5">
          <h2 class="card-title">{{ editing ? 'Edit Menu Item' : 'Create New Menu Item' }}</h2>
          <form @submit.prevent="editing ? updateItem() : createItem()" class="menu-form">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="label">Label *</label>
                  <input 
                    id="label"
                    v-model="label" 
                    class="form-control" 
                    placeholder="Menu item label" 
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="url">URL *</label>
                  <input 
                    id="url"
                    v-model="url" 
                    class="form-control" 
                    placeholder="/page or https://external.com" 
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="icon">Icon Class</label>
                  <input 
                    id="icon"
                    v-model="icon" 
                    class="form-control" 
                    placeholder="fa-home, fa-blog, etc."
                  />
                  <small class="form-help">Font Awesome icon class (optional)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="order">Order</label>
                  <input 
                    id="order"
                    v-model.number="order" 
                    type="number"
                    class="form-control" 
                    placeholder="0"
                  />
                  <small class="form-help">Lower numbers appear first</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="visible" />
                    <span>Visible</span>
                  </label>
                </div>
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

        <!-- Existing Menu Items -->
        <div class="admin-card">
          <h2 class="card-title">Menu Items</h2>
          <div v-if="itemsLoading" class="text-center py-4">
            <div class="spinner"></div>
          </div>
          <div v-else-if="items.length === 0" class="text-center py-4 text-muted">
            <p>No menu items yet. Create your first item above!</p>
          </div>
          <div v-else class="menu-list">
            <div 
              v-for="m in sortedItems" 
              :key="m.id" 
              class="menu-item"
              :class="{ 'menu-item-hidden': !m.visible }"
            >
              <div class="menu-item-content">
                <div class="menu-item-main">
                  <span v-if="m.icon" class="menu-icon">{{ m.icon }}</span>
                  <div class="menu-info">
                    <strong class="menu-label">{{ m.label }}</strong>
                    <span class="menu-url">{{ m.url }}</span>
                  </div>
                </div>
                <div class="menu-meta">
                  <span class="menu-order">Order: {{ m.order }}</span>
                  <span v-if="!m.visible" class="menu-status">Hidden</span>
                </div>
              </div>
              <div class="menu-actions">
                <button class="btn btn-sm btn-primary" @click="edit(m)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="remove(m.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGqlClient } from '~/composables/gqlClient'
const { gql } = useGqlClient()
const token = ref(typeof window !== 'undefined' ? localStorage.getItem('blog_token') || '' : '')

const label = ref('')
const url = ref('')
const icon = ref('')
const order = ref<number>(0)
const visible = ref(true)

const items = ref<any[]>([])
const message = ref('')
const messageType = ref('alert-info')
const editing = ref(false)
const editingId = ref<number | null>(null)
const itemsLoading = ref(false)

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.order - b.order)
})

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
    const query = `query { menuItems { id label url icon order visible } }`
    const res = await apiCallGraphQL(query, {}, false)
    items.value = res.data?.menuItems || []
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
  const input = {
    label: label.value,
    url: url.value,
    icon: icon.value || undefined,
    order: order.value || 0,
    visible: visible.value
  }
  
  try {
    const mutation = `mutation($input:CreateMenuInput!){ createMenuItem(input:$input){ id label url } }`
    const res = await apiCallGraphQL(mutation, { input })
    const created = res.data?.createMenuItem
    message.value = created ? 'Menu item created successfully!' : 'Menu item created'
    messageType.value = 'alert-success'
    resetForm()
    await load()
  } catch (error: any) {
    message.value = 'Error creating item: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function edit(m: any) {
  editing.value = true
  editingId.value = m.id
  label.value = m.label
  url.value = m.url
  icon.value = m.icon || ''
  order.value = m.order
  visible.value = m.visible
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editing.value = false
  editingId.value = null
  resetForm()
}

async function updateItem() {
  if (!editingId.value) return
  const input = {
    label: label.value,
    url: url.value,
    icon: icon.value || undefined,
    order: order.value || 0,
    visible: visible.value
  }
  
  try {
    const mutation = `mutation($input:UpdateMenuInput!){ updateMenuItem(input:$input){ id label url } }`
    await apiCallGraphQL(mutation, { input: { id: editingId.value, ...input } })
    message.value = 'Menu item updated successfully!'
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
  if (!confirm('Are you sure you want to delete this menu item?')) return
  
  try {
    const mutation = `mutation($id:Int!){ deleteMenuItem(id:$id) }`
    await apiCallGraphQL(mutation, { id })
    message.value = 'Menu item deleted successfully'
    messageType.value = 'alert-success'
    await load()
  } catch (error: any) {
    message.value = 'Error deleting item: ' + (error.data?.message || error.message || 'Unknown error')
    messageType.value = 'alert-danger'
  }
}

function resetForm() {
  label.value = ''
  url.value = ''
  icon.value = ''
  order.value = 0
  visible.value = true
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

.menu-form {
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
  padding-top: 1.75rem;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

.menu-list {
  margin-top: 1rem;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s ease;
  background: white;
}

.menu-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item-hidden {
  opacity: 0.6;
  background: #f7fafc;
}

.menu-item-content {
  flex: 1;
}

.menu-item-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.menu-icon {
  font-size: 1.25rem;
  color: #667eea;
  min-width: 30px;
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-label {
  font-size: 1.1rem;
  color: #1a202c;
}

.menu-url {
  font-family: monospace;
  font-size: 0.875rem;
  color: #718096;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.menu-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.menu-order {
  color: #718096;
}

.menu-status {
  color: #f56565;
  font-weight: 600;
}

.menu-actions {
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

.col-md-3, .col-md-6 {
  padding: 0 10px;
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .col-md-3 {
    flex: 0 0 25%;
  }
  .col-md-6 {
    flex: 0 0 50%;
  }
}
</style>
