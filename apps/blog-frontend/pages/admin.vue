<template>
  <div class="container py-6">
    <h1>Blog Admin</h1>

    <div v-if="!token">
      <h3>Login</h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <input v-model="email" class="form-control" placeholder="Admin Email" />
        </div>
        <div class="mb-3">
          <input v-model="password" class="form-control" type="password" placeholder="Password" />
        </div>
        <button class="btn btn-primary">Login</button>
      </form>
    </div>

    <div v-else>
      <h3>Create Post</h3>
      <form @submit.prevent="createPost">
        <input v-model="title" class="form-control mb-2" placeholder="Title" />
        <input v-model="slug" class="form-control mb-2" placeholder="Slug (unique)" />
        <input v-model="excerpt" class="form-control mb-2" placeholder="Excerpt" />
        <textarea v-model="content" class="form-control mb-2" rows="8" placeholder="HTML content"></textarea>
        <input v-model="tagsRaw" class="form-control mb-2" placeholder="Comma separated tags" />
        <div>
          <button class="btn btn-success">Create</button>
          <button class="btn btn-secondary ms-2" @click.prevent="logout">Logout</button>
        </div>
      </form>

      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const token = ref(localStorage.getItem('blog_token') || '')
const title = ref('')
const slug = ref('')
const excerpt = ref('')
const content = ref('')
const tagsRaw = ref('')
const message = ref('')
const config = useRuntimeConfig()

async function gql(query: string, variables = {}, auth?: string) {
  const headers: any = { 'Content-Type': 'application/json' }
  if (auth) headers['Authorization'] = `Bearer ${auth}`
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
}

async function login() {
  const query = `mutation ($email:String!, $password:String!){ loginAdmin(email:$email,password:$password){ accessToken } }`
  const res = await gql(query, { email: email.value, password: password.value })
  const tokenVal = res.data?.loginAdmin?.accessToken
  if (tokenVal) {
    token.value = tokenVal
    localStorage.setItem('blog_token', tokenVal)
    message.value = 'Logged in'
  } else {
    message.value = 'Login failed'
  }
}

function logout(){
  token.value = ''
  localStorage.removeItem('blog_token')
  message.value = 'Logged out'
}

async function createPost(){
  const tags = tagsRaw.value.split(',').map(t=>t.trim()).filter(Boolean)
  const query = `mutation ($input: CreatePostInput!){ createPost(input:$input){ id title slug } }`
  const input = {
    title: title.value,
    slug: slug.value,
    content: content.value,
    excerpt: excerpt.value,
    tags
  }
  const res = await gql(query, { input }, token.value)
  if (res.errors) {
    message.value = 'Error creating post'
  } else {
    message.value = `Created post ${res.data.createPost.title}`
    // clear
    title.value = ''
    slug.value = ''
    excerpt.value = ''
    content.value = ''
    tagsRaw.value = ''
  }
}
</script>

<style scoped>
.container{max-width:900px;margin:0 auto}
</style>
