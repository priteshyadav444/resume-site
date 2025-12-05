<template>
  <div class="container py-6">
    <h1>Manage Menu</h1>
    <div v-if="!token">
      <p>Please login via /admin first.</p>
    </div>

    <div v-else>
      <h3>Create Menu Item</h3>
      <form @submit.prevent="createItem">
        <input v-model="label" class="form-control mb-2" placeholder="Label" />
        <input v-model="url" class="form-control mb-2" placeholder="URL" />
        <input v-model="icon" class="form-control mb-2" placeholder="Icon class (fa-...)" />
        <input v-model.number="order" class="form-control mb-2" placeholder="Order" />
        <label><input type="checkbox" v-model="visible" /> Visible</label>
        <button class="btn btn-success">Create</button>
      </form>

      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>

      <hr />
      <h3>Existing Menu</h3>
      <ul class="list-unstyled">
        <li v-for="m in items" :key="m.id" class="mb-2">
          <strong>{{ m.label }}</strong> — <small>{{ m.url }}</small>
          <div>
            <button class="btn btn-sm btn-primary me-2" @click="edit(m)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="remove(m.id)">Delete</button>
          </div>
        </li>
      </ul>

      <div v-if="editing">
        <h3>Edit Menu</h3>
        <form @submit.prevent="updateItem">
          <input v-model="label" class="form-control mb-2" placeholder="Label" />
          <input v-model="url" class="form-control mb-2" placeholder="URL" />
          <input v-model="icon" class="form-control mb-2" placeholder="Icon class (fa-...)" />
          <input v-model.number="order" class="form-control mb-2" placeholder="Order" />
          <label><input type="checkbox" v-model="visible" /> Visible</label>
          <div>
            <button class="btn btn-primary">Update</button>
            <button class="btn btn-secondary ms-2" @click.prevent="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const token = ref(localStorage.getItem('blog_token') || '')

const label = ref('')
const url = ref('')
const icon = ref('')
const order = ref<number>(0)
const visible = ref(true)

const items = ref<any[]>([])
const message = ref('')
const editing = ref(false)
const editingId = ref<number|null>(null)

function gql(query: string, variables = {}, auth?: string) {
  const headers: any = { 'Content-Type': 'application/json' }
  if (auth) headers['Authorization'] = `Bearer ${auth}`
  return $fetch(config.public.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
}

async function load(){
  const query = `query { menuItems { id label url icon order visible } }`
  const res = await gql(query)
  items.value = res.data?.menuItems || []
}

onMounted(load)

async function createItem(){
  const input = { label: label.value, url: url.value, icon: icon.value, order: order.value, visible: visible.value }
  const query = `mutation ($input: CreateMenuInput!){ createMenuItem(input:$input){ id label } }`
  const res = await gql(query, { input }, token.value)
  if (res.errors) message.value = 'Error creating'
  else { message.value='Created'; label.value=''; url.value=''; icon.value=''; order.value=0; visible.value=true; await load() }
}

function edit(m:any){ editing.value=true; editingId.value=m.id; label.value=m.label; url.value=m.url; icon.value=m.icon; order.value=m.order; visible.value=m.visible }
function cancelEdit(){ editing.value=false; editingId.value=null }

async function updateItem(){ if(!editingId.value) return; const input = { id: editingId.value, label: label.value, url: url.value, icon: icon.value, order: order.value, visible: visible.value }; const query = `mutation ($input: UpdateMenuInput!){ updateMenuItem(input:$input){ id label } }`; const res = await gql(query, { input }, token.value); if(res.errors) message.value='Error updating'; else { message.value='Updated'; editing.value=false; editingId.value=null; await load() } }

async function remove(id:number){ if(!confirm('Delete?')) return; const query = `mutation ($id:Int!){ deleteMenuItem(id:$id) }`; const res = await gql(query, { id }, token.value); if(res.data?.deleteMenuItem) { message.value='Deleted'; await load() } else message.value='Delete failed' }
</script>

<style scoped>
.container{max-width:900px;margin:0 auto}
</style>
