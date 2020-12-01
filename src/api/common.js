import fetch from '@/libs/http'
export default {
	login: data => fetch({url: '/sessions', token: false, data}),
	logout: data => fetch('/session', data, 'DELETE'),
	list: data => fetch('/list', data, 'POST', false),
}