---
title: ue5-Render
date: 2025-12-05
tags: [ue5,3DCG,TA]
head:
  - - meta
    - name: UE5
      content: tinf
  - - meta
    - name: GameEngine
      content: tinf
---

Record UE5 Render/style process.

---

## 12.03


...No, I've been calming down the past couple of days.  

There are too many issues, so I should carefully sort them out and have decided to update my blog.  

Once I organize the process,  

here’s the situation: around before the first of the month, I made up my mind to study rendering.  

So I first went directly to watch Mr. CiCi’s 'Endland Rendering' tutorial, but as for trying to follow along with the video step by step... how should I put it, I just wasn’t really willing to do it.  

Then I half-heartedly watched some of it, but the effects created by three years of animation really drove me to study rendering more carefully.  

So I plan to start with the simplest outline effect, with inspiration from UE5’s built-in post-selection highlight. I’m thinking that maybe I could even tweak the “post-selection highlight” feature and directly add it to my own project.

我的意思：
![](/cd443bf88dcac3b565a6c112319e36f7.webp)


然后就去找了一下，我大概去研究了下，发现这些确实与图形学想通（em，来源于之前大概一个月还一直吐槽觉得图形学貌似和TA离得有点远，

Outline: 

https://blog.csdn.net/ChaoChao66666/article/details/132721693

http://zyaaaaa.cn/2024/09/12/Unreal-CelToon-md/


蓝图截图我就不贴了因为上面都有，简单去了解了一下它的算法

SceneTexelSize： 这是 一个像素的大小 (UV 空间中的尺寸)

SceneTexelSize * (1, 0)：表示在 UV 空间中，从中心点向右侧偏移一个像素。

SceneTexelSize * (0, -1)： 表示从中心点向下偏移一个像素。

Depth： 它不是 $W$ 分量...是depth buffer

但更多的我依然不能用语言很好的说出这个过程，所以为了想明白这块最近打算去上课，

我不知道它这个是可以用逻辑推理推出来还是只是一种经验性的算，因为ai给我的理论层面解答我不知道它是不是对的，

卷积我大概可以理解
边缘检测核（Sobel算子）
水平边缘检测：
| -1  0  1 |
| -2  0  2 |
| -1  0  1 |
（虽然线代没有学的很牢，然后依然在研究它们分别是什么意思ing


但是莫名弄出了很多奇奇怪怪的效果


Yumenikki.


<video controls width="100%">
  <source src="/2025-12-02 16-16-28.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>


So peaceful,  beautiful.


<video controls width="100%">
  <source src="/2025-12-02 16-17-17.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>

The problem is, I just casually added a lerp node at the end, and this is what happened.

![](/image6.webp)

I am still exploring the principles behind it.
I think it probably has something to do with a kind of 3D pixelated effect, so I plan to explore this direction later—some kind of flowing, real-time rendered 3D pixel effect?


<video controls width="100%">
  <source src="/2025-12-02 22-59-52.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>


Then I was extremely, extremely, extremely happy, so I took a lot of videos and photos, and also edited some short videos, but haven’t posted them yet because I’ve been very busy lately with worldly matters—exams, my major, and so on. It’s really frustrating.



<video controls width="100%">
  <source src="/2025-12-02 23-03-43.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>

such a lovely toy...


<video controls width="100%">
  <source src="/2025-12-03 23-02-30.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>



<video controls width="100%">
  <source src="/2025-12-05 17-37-27.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>