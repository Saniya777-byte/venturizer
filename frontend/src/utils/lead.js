export const STATUSES = ['HOT', 'GOOD', 'MAYBE', 'LOW']
export const TYPES = ['FOUNDER', 'INVESTOR']

export const statusLabel = {
  HOT: 'Hot',
  GOOD: 'Good',
  MAYBE: 'Maybe',
  LOW: 'Low',
}

export const typeLabel = {
  FOUNDER: 'Founder',
  INVESTOR: 'Investor',
}

export const getLeadName = (lead) =>
  lead?.founder?.companyName || lead?.investor?.firmName || lead?.fullName || 'Untitled lead'

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(value))
    : 'Not available'

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN').format(Number(value || 0))

export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ECONNABORTED') return 'The request took too long.'
  if (!error?.response) return 'Unable to reach the server.'
  return 'Something went wrong.'
}
