import axiosClient from '../../router/api.service'

export async function login(loginPayload: any) {
  try {
    const { data } = await axiosClient.post('login', loginPayload, {})
    return [null, data]
  } catch (err) {
    return [err]
  }
}

export async function logout() {
  try {
    return
  } catch (err) {
    return [err]
  }
}
