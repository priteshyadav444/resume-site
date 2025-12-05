<template>
  <div class="container py-6">
    <h1>Manage Portfolio</h1>

    <div v-if="!token">
      <p>Please login via /admin first.</p>
    </div>

    <div v-else>
      <h3>Create Item</h3>
      <form @submit.prevent="createItem">
        <input v-model="title" class="form-control mb-2" placeholder="Title" />
        <input v-model="slug" class="form-control mb-2" placeholder="Slug" />
        <input v-model="category" class="form-control mb-2" placeholder="Category" />
        <input v-model="shortDescription" class="form-control mb-2" placeholder="Short description" />
        <input v-model="imagesRaw" class="form-control mb-2" placeholder="Comma separated image URLs" />
        <input type="checkbox" v-model="featured" /> Featured
        <input v-model="externalUrl" class="form-control mb-2" placeholder="External URL (optional)" />
        <input v-model="metaTitle" class="form-control mb-2" placeholder="Meta title" />
        <input v-model="metaDescription" class="form-control mb-2" placeholder="Meta description" />
        <input v-model="ogImage" class="form-control mb-2" placeholder="OG image URL" />
        <textarea v-model="content" class="form-control mb-2" rows="6" placeholder="HTML content"></textarea>
        <button class="btn btn-success">Create</button>
      </form>

      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>

      <hr />
      <h3>Existing Items</h3>
      <div class="row g-3">
        <div v-for="it in items" :key="it.id" class="col-md-6">
          <div class="card p-3">
            <h4>{{ it.title }}</h4>
            <div class="text-muted">{{ it.category }} • {{ it.featured ? 'Featured' : '' }}</div>
            <p>{{ it.shortDescription }}</p>
            <div>
              <button class="btn btn-sm btn-primary me-2" @click="edit(it)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="remove(it.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- edit modal (simple) -->
      <div v-if="editing" class="mt-4">
        <h3>Edit Item</h3>
        <form @submit.prevent="updateItem">
          <input v-model="title" class="form-control mb-2" placeholder="Title" />
          <input v-model="slug" class="form-control mb-2" placeholder="Slug" />
          <input v-model="category" class="form-control mb-2" placeholder="Category" />
          <input v-model="shortDescription" class="form-control mb-2" placeholder="Short description" />
          <input v-model="imagesRaw" class="form-control mb-2" placeholder="Comma separated image URLs" />
          <input type="checkbox" v-model="featured" /> Featured
          <input v-model="externalUrl" class="form-control mb-2" placeholder="External URL (optional)" />
          <input v-model="metaTitle" class="form-control mb-2" placeholder="Meta title" />
          <input v-model="metaDescription" class="form-control mb-2" placeholder="Meta description" />
          <input v-model="ogImage" class="form-control mb-2" placeholder="OG image URL" />
          <textarea v-model="content" class="form-control mb-2" rows="6" placeholder="HTML content"></textarea>
          <button class="btn btn-primary">Update</button>
          <button class="btn btn-secondary ms-2" @click.prevent="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const token = ref(localStorage.getItem('blog_token') || '')

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
const editing = ref(false)
const editingId = ref<number | null>(null)

function gql(query: string, variables = {}, auth?: string) {
  const headers: any = { 'Content-Type': 'application/json' }
  if (auth) headers['Authorization'] = `Bearer ${auth}`
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
}

async function load() {
  const query = `query { portfolioItems { id title slug category shortDescription featured } }`
  const res = await gql(query)
  items.value = res.data?.portfolioItems || []
}

onMounted(load)

async function createItem() {
  const images = imagesRaw.value.split(',').map((s:any)=>s.trim()).filter(Boolean)
  const input = {
    title: title.value,
    slug: slug.value,
    category: category.value,
    shortDescription: shortDescription.value,
    images,
    featured: featured.value,
    externalUrl: externalUrl.value,
    metaTitle: metaTitle.value,
    metaDescription: metaDescription.value,
    ogImage: ogImage.value,
    content: content.value
  }
  const query = `mutation ($input: CreatePortfolioInput!){ createPortfolioItem(input:$input){ id title } }`
  const res = await gql(query, { input }, token.value)
  if (res.errors) message.value = 'Error creating'
  else {
    message.value = 'Created'
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
    await load()
  }
}

function edit(it:any){
  editing.value = true
  editingId.value = it.id
  title.value = it.title
  slug.value = it.slug
  category.value = it.category
  shortDescription.value = it.shortDescription
  imagesRaw.value = (it.images || []).join(', ')
  featured.value = !!it.featured
  externalUrl.value = it.externalUrl || ''
  metaTitle.value = it.metaTitle || ''
  metaDescription.value = it.metaDescription || ''
  ogImage.value = it.ogImage || ''
  content.value = it.content || ''
}

function cancelEdit(){ editing.value=false; editingId.value=null }

async function updateItem(){
  if (!editingId.value) return
  const images = imagesRaw.value.split(',').map((s:any)=>s.trim()).filter(Boolean)
  const input = { id: editingId.value, title: title.value, slug: slug.value, category: category.value, shortDescription: shortDescription.value, images, featured: featured.value, externalUrl: externalUrl.value, metaTitle: metaTitle.value, metaDescription: metaDescription.value, ogImage: ogImage.value, content: content.value }
  const query = `mutation ($input: UpdatePortfolioInput!){ updatePortfolioItem(input:$input){ id title } }`
  const res = await gql(query, { input }, token.value)
  if (res.errors) message.value = 'Error updating'
  else {
    message.value = 'Updated'
    editing.value=false
    editingId.value=null
    await load()
  }
}

async function remove(id:number){
  if(!confirm('Delete item?')) return
  const query = `mutation ($id:Int!){ deletePortfolioItem(id:$id) }`
  const res = await gql(query, { id }, token.value)
  if (res.data?.deletePortfolioItem) {
    message.value = 'Deleted'
    await load()
  } else message.value = 'Delete failed'
}
</script>

<style scoped>
.container{max-width:900px;margin:0 auto}
.card{border:1px solid #e5e7eb;border-radius:8px}
</style>
