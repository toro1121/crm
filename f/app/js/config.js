module.exports = {
    website: {
        name1: 'Toro',
        name2: 'T',
        version: '1.0',
        url: 'https://github.com/toro1121/crm'
    },
    browser: {
        version: (window.navigator.userAgent.toLowerCase().match(/.(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1]
    },

    // web API url
    apiUrl: '//crm.test.com/api',
    // apiUrl: '/crm/api',

    // dataTable一頁幾筆資料
    pageNum: 15,
};