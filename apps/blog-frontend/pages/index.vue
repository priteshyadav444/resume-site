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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead, useRuntimeConfig, useRouter } from '#imports'
const config = useRuntimeConfig()

async function gql(query: string, variables = {}) {
    return $fetch(config.public.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    })
}

const { data: postsData } = await useAsyncData('posts', async () => {
    const query = `query { posts { id title excerpt publishedAt slug } }`
    const res = await gql(query)
    return res.data?.posts || []
})

const posts = postsData

useHead({
    title: 'Blog — Pritesh Yadav',
    meta: [
        { name: 'description', content: 'Articles, tutorials and notes about web development and APIs by Pritesh Yadav.' }
    ]
})
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
.container {
    max-width: 980px;
    margin: 0 auto
}

.card {
    border: 1px solid #e5e7eb;
    border-radius: 10px
}
</style>
