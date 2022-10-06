import router from '../../../router'
import authHeader from '../../../services/data/auth-header'

import axiosClient from '../../../router/api.service'

axiosClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.status === 401) {
      router.push('/auth/login')
    }
    throw error
  },
)

export async function getStockList() {
  try {
    const result = await axiosClient.get('stocks', { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function addStock(payload: any) {
  try {
    const result = await axiosClient.put(`stocks/${payload.id}/add`, payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createStock(payload: any) {
  try {
    const result = await axiosClient.post('stocks', payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteStock(stockId: number) {
  try {
    const result = await axiosClient.delete(`stocks/${stockId}`, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
