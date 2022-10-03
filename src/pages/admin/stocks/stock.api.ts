import axios from 'axios'
import router from '../../../router'
import authHeader from '../../../services/data/auth-header'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/v1/stocks',
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      router.push('/auth/login')
    }
    throw error
  },
)

export async function getStockList() {
  try {
    const result = await axiosClient.get('', { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function addStock(payload: any) {
  try {
    const result = await axiosClient.put(`${payload.id}/add`, payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createStock(payload: any) {
  try {
    const result = await axiosClient.post('', payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteStock(stockId: number) {
  try {
    const result = await axiosClient.delete(`/${stockId}`, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
