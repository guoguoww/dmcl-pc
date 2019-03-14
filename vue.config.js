//vue.config.js 配置说明

module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? './' : '',
    lintOnSave: false,//问你是否使用eslint
    devServer: {//3个属性host,port,https
        port: 8085, // 端口号
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://192.168.0.222:8083',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/djcl_front/api/' //需要rewrite重写 gmq_front
                }
            },
        },  // 配置代理
    }
}