import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getDashboard = async () => {
  const response = await api.get('/dashboard')
  return response.data.data
}

export const getLeads = async (params) => {
  const response = await api.get('/leads', { params })
  return response.data
}

export const getLead = async (id) => {
  const response = await api.get(`/leads/${id}`)
  return response.data.data
}

export const createLead = async (payload) => {
  const response = await api.post('/leads', payload)
  return response.data.data
}

export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/leads/${id}/status`, { status })
  return response.data.data
}

export const validateAnswer = async (field, answer) => {
  const response = await api.post('/leads/validate-answer', { field, answer })
  return response.data.data
}

export default api

