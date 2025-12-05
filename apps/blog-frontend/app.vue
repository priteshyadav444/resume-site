<template>
  <div>
    <header class="site-header bg-white shadow-sm">
      <div class="container d-flex align-items-center justify-content-between py-3">
        <NuxtLink to="/" class="brand">&lt;PY/&gt; Pritesh Yadav</NuxtLink>
        <nav>
          <ul class="nav">
            <li v-for="item in menu" :key="item.id" class="nav-item">
              <NuxtLink v-if="isInternal(item.url)" :to="item.url" class="nav-link">{{ item.label }}</NuxtLink>
              <a v-else :href="item.url" class="nav-link" target="_blank" rel="noopener">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <NuxtPage />

    <footer class="site-footer py-4 text-center text-muted">
      <div class="container">&copy; 2025 Pritesh Yadav</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const config = useRuntimeConfig()

const menu = ref<any[]>([])

async function gql(query: string, variables = {}) {
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })
}

const { data } = await useAsyncData('menu-items', async () => {
  const query = `query { menuItems { id label url order visible } }`
  const res = await gql(query)
  return res.data?.menuItems || []
})

menu.value = data.value || []

function isInternal(url: string) {
  return url && url.startsWith('/')
}
</script>

<style>
.brand{font-weight:700;color:#111}
.nav{list-style:none;display:flex;gap:16px;margin:0;padding:0}
.nav-link{color:#374151;text-decoration:none}
.site-header{position:sticky;top:0;z-index:40}
.site-footer{background:#0f172a;color:#cbd5e1}
</style>
