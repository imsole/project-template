import fetch from '@/libs/http'
export const common = {
  login: data => fetch('/sessions', data, 'POST', false),
  logout: data => fetch('/session', data, 'DELETE'),
}