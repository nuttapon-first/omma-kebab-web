import axios from 'axios'
import router from '../../../router'
import authHeader from '../../../services/data/auth-header'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/v1/menus',
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

export async function getMenuList() {
  try {
    const { data } = await axiosClient.get('', { headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getMenuById(id: number) {
  try {
    const { data } = await axiosClient.get(`${id}`, { headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createMenu(payload: any) {
  try {
    const result = await axiosClient.post('', payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function editMenu(payload: any, id: number) {
  try {
    const result = await axiosClient.put(`${id}`, payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteMenu(menuId: number) {
  try {
    const result = await axiosClient.delete(`/${menuId}`, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
