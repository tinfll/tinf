<template>
  <div class="ta-container">
    <!-- 可以在这里添加一些标题或描述 -->
    <div class="ta-header" v-if="filteredPosts.length > 0">
      <h2>TA · {{ filteredPosts.length }} 篇</h2>
      <p class="description">这里收录了所有带有「TA」标签的文章</p>
    </div>
    <div class="ta-empty" v-else>
      <h2>暂无TA文章</h2>
      <p>还没有文章被标记为「TA」</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data as posts } from '../utils/posts.data'
import { computed } from 'vue'

const filteredPosts = computed(() =>
  posts.filter(post => post.tags && post.tags.includes('TA'))
)
</script>

<style scoped lang="less">
.ta-container {
  text-align: center;
  padding: 20px 0;
  
  .ta-header {
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
  
  .ta-empty {
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
  .ta-container {
    .ta-header {
      h2 {
        font-size: 1.5em;
      }
    }
  }
}
</style>