---
title: USTC_GC_25
date: 2026-04-01
tags: [C++]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

record

---


This is just to stash.Ignore it. 

<video controls width="100%">
  <source src="/output.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>





## data structure


Arrays give you O(1) access by index — `m_pData[i]` goes directly to the right memory address. No searching needed.

Dynamic Array

2 methods

m_nMax or not

### double new [m_nSize]

get at O(1)/

insert at / push_back / delete O(n) 

the core logic: 

+ assign new pData
+ copy from old m_pData
+ delete old m_pData
+ m_pData = pData


### m_nMax

get at / push_back O(1)
rest O(n)

core logic :

+ size management : reserve(m_nSize + 1 / nIndex) 

use 2 * m_nSize
assert has different boundary checks

template

