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

export async function getMenuList() {
  try {
    const { data } = await axiosClient.get('menus', { headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getMenuById(id: number) {
  try {
    const { data } = await axiosClient.get(`menus/${id}`, { headers: authHeader() as any })
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function createMenu(payload: any) {
  try {
    const result = await axiosClient.post('menus', payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function editMenu(payload: any, id: number) {
  try {
    const result = await axiosClient.put(`menus/${id}`, payload, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteMenu(menuId: number) {
  try {
    const result = await axiosClient.delete(`menus/${menuId}`, { headers: authHeader() as any })
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
