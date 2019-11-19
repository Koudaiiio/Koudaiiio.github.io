import axios from 'axios'

var api = axios.create({
  baseURL: 'http://10.1.1.1:5002/api',
  withCredentials: true
})

export default api