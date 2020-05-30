import fetch from '@/libs/http';
export const common = {
    login: (data) =>
        fetch({
            data,
            url: '/session',
            method: 'get',
            token: false,
        }),
};
