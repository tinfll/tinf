---
title: tinyrenderer
date: 2026-01-12
tags: [声明]
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

f v/vt/vn。 这就是工业标准：顶点索引 / UV索引 / 法线索引。

3/1/1 意思是：这个三角形的第一个角，使用第 3 号顶点，第 1 号 UV，第 1 号法线。

对于 Wireframe Rendering（线框渲染），斜杠前面的第一个数字

区分剔除和深度测试

P << a,0,
     0,b;(...点也用矩阵表示？，应该就是向量。但是这里线代应该就能延伸很多别的方法诸如 横着的a,b竖着的a,b)
Mtest2d <<？

P' << a+rcos(-n),0,
      0,b+rcos(n);

硬凑PM = P'(...其实也不是很清楚矩阵之间该用啥运算符，看的大多数都没有，直接是[][] = []。
等等，远古的Ax = b的记忆貌似在攻击我...我好像能把一些之前看书看的概念串起来一些)
不对，P就直接写成[上a下b]，应该是这样，等同于向量等等，P'同理
然后这样才经过硬凑可得出Mtest2d(A) << rcos(-n), 0,
                                    0, rsin(n);这个就是绕点的2d旋转。

3d空间变换矩阵应该是，比如绕y轴旋转n度(y up ,-z forward)
就是从上往下看以sqrt(a^2 + b ^ 2)为半径进行旋转
Mtest3d << rcos(?n), 0 , 0
           0     , 1 , 0
           0,    , 0 , rsin(?n)
这里问号是我也敲不准拿什么符号表示。

。。。。好吧发现前面完全理解错了。。。
