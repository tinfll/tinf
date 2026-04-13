<template>
  <ul class="tags">
    <li :class="['item', { active: active === tag }]" v-for="(_, tag) in tagData">
      <a href="javascript:void(0)" @click="setTag(tag)"
        ><i class="iconfont icon-tag"></i> {{ tag }}</a
      >
    </li>
  </ul>
</template>
<script setup lang="ts">
import { data as posts, type PostData } from '../utils/posts.data'
import { computed, onMounted } from 'vue'
import { useStore } from '../store'

const { state } = useStore()
const HIDDEN_TAGS = ['ethers']

const tagData = computed<Record<string, PostData[]>>(() => {
  const result: Record<string, PostData[]> = {}
  for (const post of posts) {
    if (!post.tags) continue
    for (const tag of post.tags) {
      if (HIDDEN_TAGS.includes(tag)) continue
      if (!result[tag]) result[tag] = []
      result[tag].push(post)
    }
  }
  return result
})

const active = computed(() => state.currTag)

const setTag = (tag: string) => {
  state.currTag = tag
  const url = new URL(window.location.href)
  if (tag && tag.trim() !== '') {
    url.searchParams.set('tag', tag)
  } else {
    url.searchParams.delete('tag')
  }
  url.searchParams.delete('page')
  window.history.pushState({}, '', url.toString())
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const tagParam = urlParams.get('tag')
  if (tagParam && tagData.value[tagParam]) {
    state.currTag = tagParam
  }

  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('tag') || ''
    if (t !== state.currTag) state.currTag = t
  })
})
</script>
<style scoped lang="less">
.active a {
  background-color: var(--btn-hover) !important;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 16px;
  background-color: var(--infobox-background-initial);
  border-radius: 32px;
  border: solid 2px var(--foreground-color);
  backdrop-filter: var(--blur-val);
  width: 768px;
  z-index: 100;

  li {
    margin: 8px;

    a {
      color: var(--font-color-grey);
      padding: 3px 5px;
      color: var(--font-color-gold);
      background-color: var(--btn-background);
      border-radius: 5px;
      transition: background-color 0.5s;

      &:hover {
        background-color: var(--btn-hover);
      }
    }
  }
}

@media (max-width: 768px) {
  .tags {
    width: auto;
    li {
      margin: 4px;
      a {
        font-size: 12px;
        .icon-tag {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
