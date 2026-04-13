import { reactive } from 'vue'
import { PostData } from '../utils/posts.data'

interface StoreState {
  selectedPosts: PostData[]
  currTag: string
  currPost: PostData
  currPage: number
  searchDialog: boolean
  splashLoading: boolean
  fireworksEnabled: boolean
  SpinePlayerEnabled: boolean
  showDropdownMenu: boolean
  darkMode: 'light' | 'dark' | 'system'
  ethersUnlocked: boolean
}

const state: StoreState = reactive({
  selectedPosts: [],
  currTag: '',
  ethersUnlocked: false,
  currPost: {
    id: 0,
    title: '',
    content: '',
    href: '',
    create: 0,
    update: 0,
    tags: [],
    wordCount: 0,
    cover: '',
    excerpt: '',
    pinned: false
  },
  currPage: 1,
  searchDialog: false,
  splashLoading: true,
  fireworksEnabled: true,
  SpinePlayerEnabled: true,
  showDropdownMenu: false,
  darkMode: 'system',
})

export function useStore() {
  return { state }
}
