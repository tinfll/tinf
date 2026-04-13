<template>
  <div class="ethers-container">
    <!-- Password Gate -->
    <transition name="fade" mode="out-in">
      <div v-if="!unlocked" class="ethers-lock" key="lock">
        <div class="lock-box">
          <div class="lock-icon">lock</div>
          <h2>eth</h2>
          <p class="lock-desc">eth</p>
          <div class="input-row">
            <input
              v-model="inputPassword"
              type="password"
              placeholder="eth..."
              @keyup.enter="tryUnlock"
              :class="{ shake: shaking }"
            />
            <button @click="tryUnlock">确认</button>
          </div>
          <p v-if="wrongPassword" class="wrong-tip">密码错误，请重试</p>
        </div>
      </div>

      <!-- Unlocked Header -->
      <div v-else key="unlocked">
        <div class="ethers-header" v-if="filteredPosts.length > 0">
          <h2>遗世 · {{ filteredPosts.length }} 篇</h2>
          <p class="description">这里收录了所有带有「ethers」标签的文章</p>
        </div>
        <div class="ethers-empty" v-else>
          <h2>暂无遗世文章</h2>
          <p>还没有文章被标记为「ethers」</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { data as posts } from '../utils/posts.data'
import { computed, ref, onMounted } from 'vue'
import { useStore } from '../store'
import { useData } from 'vitepress'

const { state } = useStore()

const SESSION_KEY = 'ethers_unlocked'
const { theme } = useData()
const correctPassword = computed(() => theme.value.ethersPassword || '')

const unlocked = computed({
  get: () => state.ethersUnlocked,
  set: (v) => { state.ethersUnlocked = v },
})
const inputPassword = ref('')
const wrongPassword = ref(false)
const shaking = ref(false)

onMounted(() => {
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    state.ethersUnlocked = true
  }
})

function tryUnlock() {
  if (inputPassword.value === correctPassword.value) {
    state.ethersUnlocked = true
    wrongPassword.value = false
    sessionStorage.setItem(SESSION_KEY, 'true')
  } else {
    wrongPassword.value = true
    shaking.value = true
    inputPassword.value = ''
    setTimeout(() => { shaking.value = false }, 500)
  }
}

const filteredPosts = computed(() =>
  posts.filter(post => post.tags && post.tags.includes('ethers'))
)
</script>

<style scoped lang="less">
.ethers-container {
  text-align: center;
  padding: 20px 0;
}

.ethers-lock {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lock-box {
  background: var(--foreground-color);
  border: 2px solid var(--foreground-color);
  border-radius: 24px;
  padding: 40px 48px;
  min-width: 320px;
  box-shadow: 0px 0px 8px rgb(var(--blue-shadow-color), 0.8);
  backdrop-filter: var(--blur-val);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .lock-icon {
    font-size: 2.5em;
  }

  h2 {
    color: var(--font-color-gold);
    font-size: 1.6em;
    margin: 0;
  }

  .lock-desc {
    color: var(--font-color-grey);
    opacity: 0.75;
    font-size: 0.9em;
    margin: 0;
  }

  .input-row {
    display: flex;
    gap: 8px;
    width: 100%;

    input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      border: 2px solid var(--foreground-color);
      background: var(--general-background-color);
      color: var(--font-color-grey);
      font-family: inherit;
      font-size: 1em;
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: var(--color-blue);
      }

      &.shake {
        animation: shake 0.4s ease;
      }
    }

    button {
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      background: var(--btn-hover);
      color: var(--font-color-gold);
      font-family: inherit;
      font-size: 1em;
      cursor: pointer;
      transition: opacity 0.3s;

      &:hover { opacity: 0.85; }
    }
  }

  .wrong-tip {
    color: #e05c5c;
    font-size: 0.88em;
    margin: 0;
  }
}

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
  h2 { color: var(--font-color-grey); margin-bottom: 15px; }
  p { color: var(--font-color-grey); opacity: 0.6; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .lock-box {
    padding: 28px 20px;
    min-width: unset;
    width: 80vw;
  }
  .ethers-header h2 { font-size: 1.5em; }
}
</style>