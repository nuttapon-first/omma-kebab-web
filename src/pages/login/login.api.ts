import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/login',
})

export async function login(loginPayload: any) {
  try {
    const { data } = await axiosClient.post('', loginPayload, {})
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
