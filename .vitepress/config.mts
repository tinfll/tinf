import { defineConfigWithTheme } from 'vitepress'
// @ts-ignore
import mdItCustomAttrs from 'markdown-it-custom-attrs'
export interface ThemeConfig {
  repo: string
  owner: string
  admin: string[]
  outline?: 'deep' | number[]

  //navBar
  menuList: { name: string; url: string }[]

  //banner
  videoBanner: boolean
  name: string
  welcomeText: string
  motto: string[]
  social: { icon: string; url: string }[]

  //spine
  spineVoiceLang: 'zh' | 'jp'

  //footer
  footerName: string
  poweredList: { name: string; url: string }[]


}

export default defineConfigWithTheme<ThemeConfig>({
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    //gitalk
    /*['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk/dist/gitalk.css' }],
    ['script', { src: 'https://unpkg.com/gitalk/dist/gitalk.min.js' }],
    */
    // bluearchive font
    [
      'link',
      {
        rel: 'stylesheet',
        href: '/font/Blueaka/Blueaka.css',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: '/font/Blueaka_Bold/Blueaka_Bold.css',
      },
    ],
    // 图片灯箱
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css',
      },
    ],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js',
      },
    ],
  ],
  ignoreDeadLinks: true,
  // 生成站点地图
  // sitemap: {
  //   hostname: 'https://vitepress-theme-bluearchive.vercel.app',
  // },
  title: "Welcome to the Ethearl",
  description: "葶风看月",
  themeConfig: {
    // navBar
    menuList: [
      { name: 'Main', url: '' },
      { name: 'Tags', url: 'tags/' },
      { name: 'TA', url: 'ta/' },
      { name: 'ethers', url: 'ethers/' },
    ],

    //banner区配置
    videoBanner: false,
    name: "葶风看月",
    welcomeText: 'Welcome to the Ethearl',
    motto: ['徘徊在梦境的边缘'],
    social: [
      { icon: 'github', url: 'https://github.com/tinfll' },
      { icon: 'bilibili', url: ' https://b23.tv/zUV6qLv' },
      { icon: 'discord', url: 'https://discord.gg/BWeKDcHx' },
      { icon: 'x', url: 'https://x.com/tinf1234/' },
      { icon: '网易云音乐', url: 'https://y.music.163.com/m/user?id=1451336139' },
    ],

    //spine语音配置，可选zh/jp
    spineVoiceLang: 'jp',

    //footer配置
    footerName: 'tinfengkanyue © 2025',
    poweredList: [
      { name: 'VitePress', url: 'https://github.com/vuejs/vitepress' },
      { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' },
    ],
    clientID: '',
    clientSecret: '',
    repo: '',
    owner: '',
    admin: []
  },
  markdown: {
    theme: 'solarized-dark',
    lineNumbers: true,
    math: true,
    headers: {level: [2, 3, 4] },
    config: (md) => {
      // use more markdown-it plugins!
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery',
      })
    },
  },
})
