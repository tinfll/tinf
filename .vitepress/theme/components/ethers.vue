<template>
  <ul class="works">
    <li :class="['item', { active: active === work.id }]" v-for="work in worksData">
      <a href="javascript:void(0)" @click="setWork(work.id)">{{ work.title }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const active = ref<string | null>(null)
const worksData = ref([
  { id: 'work1', title: '雨夜书店' },
  { id: 'work2', title: '城市边缘' },
  { id: 'work3', title: '时光碎片' }
])

const setWork = (workId: string) => {
  active.value = workId
}
</script>

<style scoped lang="less">
.active a {
  background-color: var(--btn-hover) !important;
}

.works {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 16px;

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
  .works {
    li {
      margin: 4px;
      a {
        font-size: 12px;
      }
    }
  }
}
</style>
