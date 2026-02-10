---
title: volume
date: 2026-01-21
tags: [图形学]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

关于制作什么volume一系列东西的思考

---

lattice based noise
value noise
linear rnd
上下限符号难打....? 
x下 
noise(x) = hash([x]下) + (x-[x]下) * (hash([x]上) - hash([x]下))
lerp(hash[x]下, hash[x]上，x - [x]下 ) 
smoothstep： f(x-[x]下)作为系数部分
。。。我觉得自己有很多点子，，？


2d: noise(x, y) hash()
n01 = hash([x]下， [y]上) n11 = hash([x]上， [y]上)
n00 = hash([x]下，[y]下) n10 = hash([x]上， [y]下)
lerp(n00, n10, x-[x]下)
lerp(n01, n11, x-[x]下)
lerp((lerp(n00, n10, x-[x]下)), (lerp(n01, n11, x-[x]下)), y - [y]下)
(filter mode: bilinear)


gradient noise->perlin noise(each vertex random gradient vector??不是这怎么取四随机向量？)
g = <[-1,1],[-1,1]>
dot(g01, d01)...夹角？但问题是g01, g02, g03, g04这些随机梯度向量

```md
lerp(lerp(dot(g00, d00)， dot(g01, d01)， x-[x]下)，lerp(dot(g10, d10)， dot(g11, d11)， x-[x]下， y-[y]下))
```

。好吧很我想的一样那个g的随机性生成确实有问题，
某种办法：球坐标生成随机单位向量再转笛卡尔输出，其他方法应该就是图形学问题...
vec3 RandGradVector(uint seed) {
  float theta = acos(2.0 * rand(seed) - 1);
  float phi = 2.0 * rand(seed + 2) * PI;
  
  float x = cos(phi) * sin(theta);
  
  float y = sin(phi) * sin(theta);
  
  float z = cos(theta);
  return vec3(x,y,z);

}
。但是这个问题是 。。。？不是这个我该怎么用到那个g的随机取值上？

或者预定义一组梯度向量。

或者什么中心差分法求导，，或者直接求导而不是求近似，二阶导数要连续。

SDF: 一个图像，能够描述每个像素距离图形边缘距离。
图形边缘，sdf = 0
图形内部， sdf < 0
图形外部， sdf > 0 什么牛顿环？....。
。不是，所以你计算距离这个dist的方式(不规则图形)是计算某物体Q点曲线切线，然后外面点P和表面Q的连线需要与切线垂直的话那段PQ就是distance。？

?移动uv uvremap?有必要吗...?
float2 scrennSize = _ScrennParams.xy;
float2 uv = ((i.uv * 2.0 - 1.0) * screenSize.xy) / min (scrennSize.x, screenSize.y);

return float4(uv.x, uv.y, 0.0, 1.0);
float sdf1 = sdCircle(uv, 0.5);
float v = step(sdf1, 0.01);
return float4(v, 0.0, 0.0, 1.0);

貌似能get到一点它的意思...
。然后就是某种重复做题式：？：得到某种效果需要哪一种之的熟能生巧之的2d变换，但是需要去用这种图形程序式的思维去思考问题....
用max/min这种，可以做一些搬运(。感觉会有些无聊)


sdf = lerp(sdf1, sdf2, _Value);(所以你完全无法用理性去推导它的存在而只能通过经验与想象与纯粹的联想。)
。也不是不能推导，用那个边界条件思考去极限值来想，，就是圆形和方形的叠加之！如果把_value换成时间就是很好的果冻。

(此是圆形)
float sdCircle(float2 p, float r)
{
  return length(p) - r;
}
。？。好像有点get到？

(此是方形)
float sdBox(in float2 p, in float2 b)
{
  float2 d = abs(p) - b;
  return length(max(d, 0, 0)) + min(max(d.x, d.y), 0.0);
}

2d sdf做字体等。
但我好像还是不太能理解3d sdf。

。所以采取这种很抽象的符号距离好处是可以各种有趣方式组合图形等，而且有符号(signed distance functions SDF)
[IQ](https://iquilezles.org/articles/distfunctions2d/)

[wiki](https://en.wikipedia.org/wiki/Ray_marching)
ray marching ，我知道你是啥了，但是，，你是干嘛来着。？判断...像素是否描绘？

先划定某包围盒(八叉树或其他智能算法？)
//。刷算法需要。

line segment