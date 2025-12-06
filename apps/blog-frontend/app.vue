<template>
  <div class="app-wrapper">
    <header class="site-header">
      <div class="container">
        <div class="header-content">
          <NuxtLink to="/" class="brand">
            <span class="brand-icon">&lt;PY/&gt;</span>
            <span class="brand-text">Pritesh Yadav</span>
          </NuxtLink>
          <nav class="main-nav">
            <ul class="nav-list">
              <li v-for="item in visibleMenuItems" :key="item.id" class="nav-item">
                <NuxtLink 
                  v-if="isInternal(item.url)" 
                  :to="item.url" 
                  class="nav-link"
                  active-class="nav-link-active"
                >
                  <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
                  {{ item.label }}
                </NuxtLink>
                <a 
                  v-else 
                  :href="item.url" 
                  class="nav-link"
                  target="_blank" 
                  rel="noopener"
                >
                  <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; {{ new Date().getFullYear() }} Pritesh Yadav. All rights reserved.</p>
          <div class="footer-links">
            <NuxtLink to="/admin" class="footer-link">Admin</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  const query = `query { 
    menuItems { 
      id 
      label 
      url 
      icon 
      order 
      visible 
    } 
  }`
  const res = await gql(query)
  return res.data?.menuItems || []
})

menu.value = data.value || []

const visibleMenuItems = computed(() => {
  return menu.value
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order)
})

function isInternal(url: string) {
  return url && url.startsWith('/')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1a202c;
  background: #ffffff;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e2e8f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  text-decoration: none;
  transition: color 0.2s ease;
}

.brand:hover {
  color: #667eea;
}

.brand-icon {
  color: #667eea;
  font-family: monospace;
}

.brand-text {
  color: #1a202c;
}

.main-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4a5568;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #f7fafc;
  color: #667eea;
}

.nav-link-active {
  background: #edf2f7;
  color: #667eea;
}

.nav-icon {
  font-size: 0.875rem;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 200px);
}

.site-footer {
  background: #1a202c;
  color: #cbd5e1;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #667eea;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-list {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
