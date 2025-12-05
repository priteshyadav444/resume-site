<template>
  <main class="container py-6">
    <NuxtLink to="/">← Back</NuxtLink>
    <h1 class="mt-3">{{ item?.title }}</h1>
    <div class="text-muted mb-3">{{ item?.category }} • {{ item?.createdAt | fmtDate }}</div>
    <div v-if="item?.ogImage" class="mb-3"><img :src="item.ogImage" alt="og" style="max-width:100%"/></div>
    <div v-html="item?.content"></div>
  </main>
</template>

<script setup lang="ts">
import { useHead, useRuntimeConfig } from '#imports'
const route = useRoute()
const config = useRuntimeConfig()

async function gql(query: string, variables = {}) {
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })
}

const slug = route.params.slug as string
const { data: itemData } = await useAsyncData(`portfolio-${slug}`, async () => {
  const query = `query ($slug:String!){ portfolioBySlug(slug:$slug){ id title slug category shortDescription content images metaTitle metaDescription ogImage createdAt } }`
  const res = await gql(query, { slug })
  return res.data?.portfolioBySlug || null
})

const item = itemData

useHead(() => {
  if (!item.value) return { title: 'Portfolio item' }
  const title = item.value.metaTitle || item.value.title
  const description = item.value.metaDescription || (item.value.shortDescription || '')
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
      { property: 'og:image', content: ogImage }
    ],
    link: [{ rel: 'canonical', href: canonical }]
  }
})

function stripHtml(html: string){ return html ? html.replace(/<[^>]*>/g,'') : '' }
</script>

<script lang="ts">
export default {
  filters: {
    fmtDate(value: string){ if(!value) return ''; return new Date(value).toLocaleDateString() }
  }
}
</script>

<style scoped>
.container{max-width:900px;margin:0 auto}
</style>
