<template>
  <div class="container py-6">
    <NuxtLink to="/">← Back</NuxtLink>
    <h1 class="mt-3">{{ post?.title }}</h1>
    <div class="text-muted mb-3">{{ post?.publishedAt | fmtDate }}</div>
    <div v-html="post?.content"></div>
  </div>
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
const { data: postData } = await useAsyncData(`post-${id}`, async () => {
  const query = `query ($id:Int!){ postById(id:$id){ id title content excerpt publishedAt } }`
  const res = await gql(query, { id })
  return res.data?.postById || null
})

const post = postData

useHead(() => {
  if (!post.value) return { title: 'Post' }
  const title = post.value.title
  const description = post.value.excerpt || stripHtml(post.value.content).slice(0,160)
  const canonical = `${config.public.siteUrl}/blog/post/${post.value.id}`
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonical }
    ],
    link: [{ rel: 'canonical', href: canonical }]
  }
})

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}
</script>

<script lang="ts">
export default {
  filters: {
    fmtDate(value: string) {
      if (!value) return ''
      return new Date(value).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.container{max-width:900px;margin:0 auto}
</style>
