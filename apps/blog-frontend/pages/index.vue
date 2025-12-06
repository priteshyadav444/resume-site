<template>
    <div class="container py-6">
        <h1 class="mb-4">Blog</h1>
        <div class="row g-4">
            <div v-for="post in posts" :key="post.id" class="col-md-6">
                <div class="card p-3">
                    <h3>
                        <NuxtLink :to="`/post/${post.id}`">{{ post.title }}</NuxtLink>
                    </h3>
                    <div class="text-muted mb-2">{{ post.publishedAt | fmtDate }}</div>
                    <p>{{ post.excerpt }}</p>
                <template>
                  <main class="container py-6">
                    <h1 class="mb-4">Featured Projects</h1>
                    <div class="row g-4">
                      <div v-for="item in items" :key="item.id" class="col-md-6">
                        <div class="card p-3">
                          <h3>
                            <NuxtLink :to="`/portfolio/${item.slug}`">{{ item.title }}</NuxtLink>
                          </h3>
                          <div class="text-muted mb-2">{{ item.category }} • {{ fmtDate(item.createdAt) }}</div>
                          <p>{{ item.shortDescription }}</p>
                          <div v-if="item.images && item.images.length">
                            <img :src="item.images[0]" style="max-width:100%;border-radius:8px" :alt="item.title" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </template>

                <script setup lang="ts">
                import { useHead, useRuntimeConfig } from '#imports'

                const config = useRuntimeConfig()

                async function gql(query: string, variables = {}) {
                  return $fetch(config.public.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables })
                  })
                }

                const { data: itemsData } = await useAsyncData('featured-portfolio', async () => {
                  const query = `query { featuredPortfolio { id title slug category shortDescription images createdAt metaTitle metaDescription ogImage } }`
                  const res = await gql(query)
                  return res.data?.featuredPortfolio || []
                })

                const items = itemsData

                useHead({
                  title: 'Portfolio — Pritesh Yadav',
                  meta: [
                    { name: 'description', content: 'Featured projects and portfolio items by Pritesh Yadav.' }
                  ]
                })

                function fmtDate(value?: string) {
                  if (!value) return ''
                  return new Date(value).toLocaleDateString()
                }
                </script>

                <style scoped>
                .container{max-width:980px;margin:0 auto}
                .card{border:1px solid #e5e7eb;border-radius:10px}
                </style>

