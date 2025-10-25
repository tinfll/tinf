---
title: games101(1) -- 透视投影矩阵
date: 2025-10-25
tags: [games101, c++, 图形学]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

理解透视投影矩阵的过程

---

齐次坐标系不是笛卡尔坐标系
相机移动到原点，求逆简单，再求逆。

正交投影: 扔掉z然后压缩到-1，1，但是这不要考虑缩放？(就是缩放)
正式canonical: 范围，中心移到原点上，缩放

透视投影: 先将远平面挤压，再正交投影过去
挤压用比例坐标，第四列w坐标需要为z((1001)=(2002)及同乘相同点坐标)
(一些规定: 近处点不变，z值不变，远平面中心点不变)，
利用以上
z值不变 可换

联立以下两个:
近处点坐标不变
中心点不变
可以解出nf，
缩矩阵完成完毕，

有时候规定能解决很多东西
。。。话说你写起来还真简单啊。。。然后md什么也还都没用。。。我且再看吧。。。

```cpp
Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();

    Eigen::Matrix4f M_p2o;
M_p2o << zNear, 0, 0, 0,
         0, zNear, 0, 0,
         0, 0, zNear + zFar, zNear * zFar,
	     0, 0, -1, 0;

Eigen::Matrix4f M_trans;
M_trans << 1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, (zNear + zFar) / 2,
	       0, 0, 0, 1;
Eigen::Matrix4f M_scale;
M_scale << 1 / (zNear * std::tan(eye_fov/2) * aspect_ratio), 0, 0, 0,
           0,  1 / (zNear * std::tan(eye_fov/2)), 0, 0,
           0, 0, 2 / (zNear - zFar), 0,
	0, 0, 0, 1;

projection = M_scale * M_trans * M_p2o;
```
好，弄出来cpp了...
我也在想要不要手推熟矩阵这样...发现即使是没有应试要求也会不由自主把记着？一些小镇做题家的习惯。
然后自己尝试录个视频发现一些简单的话都讲不清楚...乐。
宿舍只剩我一个了，非常好