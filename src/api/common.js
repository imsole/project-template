import fetch from '@/libs/http'
export default {
  login: data => fetch('/sessions', data, 'POST', false),
  logout: data => fetch('/session', data, 'DELETE'),
}