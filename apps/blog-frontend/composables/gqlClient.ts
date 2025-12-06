import { useRuntimeConfig } from '#imports'

export function useGqlClient() {
  const config = useRuntimeConfig()

  async function gql(query: string, variables: Record<string, any> = {}, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    return $fetch(config.public.graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    })
  }

  return { gql }
}

export default useGqlClient
