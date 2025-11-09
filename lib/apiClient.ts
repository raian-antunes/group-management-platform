const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  },

  async post(endpoint: string, data?: unknown) {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  },

  async put(endpoint: string, data?: unknown) {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  },
}
