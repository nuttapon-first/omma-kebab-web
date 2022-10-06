import router from '../../../../router'
import authHeader from '../../../../services/data/auth-header'

import axiosClient from '../../../../router/api.service'

axiosClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.status === 401) {
      router.push('/auth/login')
    }
    throw error
  },
)

export async function getTransactionList(query: any) {
  try {
    const { data } = await axiosClient.get('transactions', { params: query, headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createTransactionAPI(payload: any) {
  try {
    const { data } = await axiosClient.post('transactions', payload, { headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
