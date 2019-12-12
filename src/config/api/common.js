import fetch from '../http'
let common = {
  login: data => fetch('/sessions', data, 'POST', false),
  logout: data => fetch('/session', data, 'DELETE'),
}
export default common;