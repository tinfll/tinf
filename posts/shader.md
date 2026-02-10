---
title: shader
date: 2026-01-12
tags: [shader]
pinned: true
head:
  - - meta
    - name: tip
      content: tinf
  - - meta
    - name: tip
      content: tinf
---



---

uv = fragCoord / iResolution.xy
。
所以uv又是哪个空间变到哪个空间里面去了。
已经在屏幕空间了，没事。


前置动作之重新映射:
vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
(ue5 texcoord)
。但坐标系不同

先将uv转化到平面相一致0-1范围
然后将右下原点移动到中心原点
判断横屏还是竖屏后
再乘*iResoulution的ratio 还原

或者扩大uv进行变换。



