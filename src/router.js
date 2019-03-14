import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import cookie from "./assets/js/cookie";
import market from "./views/trade/market";

Vue.use(Router)


const routes = [
    {//首页
        path: '/',
        name: 'home',
        component: Home
    },
    {//注册
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "about" */ './views/login/register.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//登录
        path: '/login',
        name: 'login',
        component: () => import('./views/login/login.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//忘记密码
        path: '/forget',
        name: 'forget',
        component: () => import('./views/login/forget.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//注册协议
        path: '/agreement',
        name: 'agreement',
        component: () => import('./views/login/agreements.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//首页公告
        path: '/announcement',
        name: 'announcement',
        component: () => import('./views/adv/announce/index.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//首页公告详情
        path: '/announceDetail',
        name: 'announceDetail',
        component: () => import('./views/adv/announce/detail.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//资讯
        path: '/newsInfo',
        name: 'newsInfo',
        component: () => import('./views/adv/news/index.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//研报
        path: '/researchReport',
        name: 'researchReport',
        component: () => import('./views/adv/news/researchReport.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//要闻
        path: '/newsInfoList',
        name: 'newsInfoList',
        component: () => import('./views/adv/news/newsInfoList.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//操盘达人
        path: '/traders',
        name: 'traders',
        component: () => import('./views/adv/tradersTalent/index.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//最新动态
        path: '/recentNews',
        name: 'recentNews',
        component: () => import('./views/adv/recentNews/index.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//模拟体验
        path: '/simulateIntro',
        name: 'simulateIntro',
        component: () => import('./views/adv/simulateIntro/index.vue'),
        meta: {
            hideFooter: true,
        }
    },
    {//新手指引
        path: '/newGuide',
        name: 'newGuide',
        component: () => import('./views/adv/help/index.vue'),
        meta: {
            hideFooter: true
        }
    },
    {//个人中心
        path: '/user',
        name: 'user',
        component: () => import('./views/user/index.vue'),
        meta: {
            auth: true,
        }
    },
    {//设置
        path: '/setting',
        name: 'setting',
        component: () => import('./views/user/setting/index.vue'),
        meta: {
            auth: true,
            hideFooter: true,
        }
    },
    {//我的銀行卡
        path: '/bankCard',
        name: 'bankCard',
        component: () => import('./views/user/bankCard/index.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//銀行卡列表
        path: '/bankCardList',
        name: 'bankCardList',
        component: () => import('./views/user/bankCard/bankCardList.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//添加銀行卡
        path: '/bankcardAdd',
        name: 'bankcardAdd',
        component: () => import('./views/user/bankCard/bankcardAdd.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {
        path: '/security',
        name: 'security',
        component: () => import('./views/user/security/index.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {
        path: '/verified',
        name: 'verified',
        component: () => import('./views/user/security/verified.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {
        path: '/verifiedEdit',
        name: 'verifiedEdit',
        component: () => import('./views/user/security/verifiedEdit.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//修改密码
        path: '/modifyPwd',
        name: 'modifyPwd',
        component: () => import('./views/user/security/modifyPwd.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//充值
        path: '/topUp',
        name: 'topUp',
        component: () => import('./views/user/money/topUp.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//提現
        path: '/withdrawal',
        name: 'withdrawal',
        component: () => import('./views/user/money/withdrawal.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//资金明细
        path: '/financialDetails',
        name: 'financialDetails',
        component: () => import('./views/user/financialDetails/index.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//我的推广
        path: '/intro',
        name: 'intro',
        component: () => import('./views/user/myIntro/index.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//合作协议
        path: '/coAgreement',
        name: 'coAgreement',
        component: () => import('./views/user/agreements/coAgreement.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//风险提示
        path: '/riskWarning',
        name: 'riskWarning',
        component: () => import('./views/user/agreements/riskWarning.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//资费协议
        path: '/feeAgreement',
        name: 'feeAgreement',
        component: () => import('./views/user/agreements/feeAgreement.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//帮助中心
        path: '/help',
        name: 'help',
        component: () => import('./views/user/agreements/help/index.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//帮助中心/关于我们
        path: '/aboutUs',
        name: 'aboutUs',
        component: () => import('./views/user/agreements/help/aboutUs.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//帮助中心/规则
        path: '/rule',
        name: 'rule',
        component: () => import('./views/user/agreements/help/rule.vue'),
        meta: {
            hideFooter: true,
            auth: true,
        }
    },
    {//自选
        path: '/optional',
        name: 'optional',
        component: () => import('./views/optional'),
    },
    {//交易
        path: '/trade',
        name: 'trade',
        component: () => import('./views/trade'),
        meta: {
            auth: true,
        }
    },
    { //创建策略
        path: '/create_policy',
        name: 'create_policy',
        component: () => import('./views/trade/create_policy'),
        meta: {
            hideFooter: true,
        }
    },
    { //股票行情
        path: '/market/:code',
        name: 'market',
        component: market,
        meta: {
            hideFooter: true,
        }
    },
    { //下单
        path: '/buy/:code',
        name: 'buy',
        component: () => import('./views/trade/buy'),
        meta: {
            hideFooter: true,
        }
    },
    
    
]

const router = new Router({
    routes,
})

router.beforeEach((to,from,next) => {
    let userInfo = cookie.get('_auth') ;
    
    if (to.meta.auth) { //判断需不需要登录验证
        if (userInfo) { //有没有用户信息
            next()
        } else { //没有跳到登录页
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else if (to.name === 'login') { //判断进入的地址是不是登录页
        if (userInfo) { //有没有用户信息 有就返回首页 没有就进
            next()
        } else {
            next()
        }
    } else {
        
        next()
    }
})


export default router


