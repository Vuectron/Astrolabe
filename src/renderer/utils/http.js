import axios from 'axios'
import qs from 'qs'

export function apiRequest (url, method, data = {}) {
  const config = {
    url,
    method,
    data,
    // 请求头信息
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [(data) => qs.stringify(data)],
    withCredentials: true
  }
  axios.defaults.headers.common['Accept'] = 'application/json'
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  axios.defaults.headers.common['Cache-Control'] = 'no-cache'
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  return axios({...config})
}

export function apiRequestAuth (url, method, token, data = {}) {
  axios.defaults.headers.common['Accept'] = 'application/json'
  axios.defaults.headers.common['Authorization'] = `token ${token}`
  axios.defaults.headers.common['Cache-Control'] = 'no-cache'
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  return axios({method, url, data})
}
