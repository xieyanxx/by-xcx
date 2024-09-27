
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/shoppingCart/index',
    'pages/personalCenter/index'

  ],
  subPackages: [
    {
      root: 'otherpage',
      pages: ['login/index', "bill/index", 'orderRecord/index','refundRecord/index']
    }
  ],
  lazyCodeLoading: 'requiredComponents',
  tabBar: {
    color: '#333333',
    selectedColor: '#70CB34',
    backgroundColor: '#F9F9F9',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/home/index', text: '首页', iconPath: '/static/home.png', selectedIconPath: '/static/home1.png' },
      { pagePath: 'pages/shoppingCart/index', text: '购物车', iconPath: '/static/car.png', selectedIconPath: '/static/car1.png' },
      { pagePath: 'pages/personalCenter/index', text: '购物车', iconPath: '/static/user.png', selectedIconPath: '/static/user1.png' },
    ]
  },
  window: {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '',
    navigationStyle: 'default',
    backgroundColor: '#000000',
    backgroundTextStyle: 'dark',
    backgroundColorTop: '#000000',
    backgroundColorBottom: '#000000',
    initialRenderingCache: 'static',

  }
})
