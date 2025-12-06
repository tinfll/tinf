<template>
  <div class="ethers-container">
    <!-- 可以在这里添加一些标题或描述 -->
    <div class="ethers-header" v-if="filteredPosts.length > 0">
      <h2>遗世 · {{ filteredPosts.length }} 篇</h2>
      <p class="description">这里收录了所有带有「ethers」标签的文章</p>
    </div>
    <div class="ethers-empty" v-else>
      <h2>暂无遗世文章</h2>
      <p>还没有文章被标记为「ethers」</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data as posts } from '../utils/posts.data'
import { computed } from 'vue'
import { useStore } from '../store'

const { state } = useStore()

// 筛选出包含 ethers 标签的文章
const filteredPosts = computed(() => {
  return posts.filter(post => 
    post.tags && post.tags.includes('ethers')
  )
})

// 重要：将筛选后的文章设置到 store 中，这样 PostList 组件就能使用了
import { onMounted, watch } from 'vue'

onMounted(() => {
  state.selectedPosts = filteredPosts.value
})

// 监听文章数据变化
watch(filteredPosts, (newPosts) => {
  state.selectedPosts = newPosts
}, { immediate: true })
</script>

<style scoped lang="less">
.ethers-container {
  text-align: center;
  padding: 20px 0;
  
  .ethers-header {
    h2 {
      color: var(--font-color-gold);
      margin-bottom: 10px;
      font-size: 2em;
    }
    
    .description {
      color: var(--font-color-grey);
      opacity: 0.8;
      font-size: 0.9em;
    }
  }
  
  .ethers-empty {
    padding: 40px 0;
    
    h2 {
      color: var(--font-color-grey);
      margin-bottom: 15px;
    }
    
    p {
      color: var(--font-color-grey);
      opacity: 0.6;
    }
  }
}

@media (max-width: 768px) {
  .ethers-container {
    .ethers-header {
      h2 {
        font-size: 1.5em;
      }
    }
  }
}
</style>