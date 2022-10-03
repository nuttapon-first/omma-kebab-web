import axios from 'axios'
import router from '../../../router'
import authHeader from '../../../services/data/auth-header'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/v1/reports',
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

export async function getDashboard(query: any) {
  try {
    const { data } = await axiosClient.get('dashboard', { params: query, headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}
