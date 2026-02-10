---
title: Mirror and render pipelines
date: 2026-01-04
tags: [unity,c#,linear algebra]
head:
  - - meta
    - name: UE5
      content: tinf
  - - meta
    - name: GameEngine
      content: tinf
---

Record UE5 Gameplay process.

---



采用stencil/Geometry方案：开销与镜子在屏幕上的大小成正比。镜子越小，性能越省，
直接写在屏幕缓冲区，没有中间商，因为是直接渲染几何体，永远是屏幕原生分辨率，无限清晰。


problem1:如果使用 Render Texture 来做镜子，分辨率设置为 1024x1024。当镜子在画面中只占 10x10 像素大小时（比如角色离镜子很远），你的 GPU 依然在全力渲染 1024x1024 的 RT，这叫什么性能浪费？应该如何优化？

ans:严重的过采样导致的过度着色和带宽浪费

传统RT方案：LOD策略，即动态分辨率，根据相机到镜面的距离，线性或分级降低RT的尺寸来降低fragment的压力和显存带宽小号，。然后基于stencil buffer的平面反射利用光栅化管线的特性，开销与镜面屏幕上的像素占比成正比还能保持绝对清晰度。



后 planar reflection，，有点灾难感觉自己先攻错方向了，
草记一下未来要做的tag等等

动作动画流程/下雨/昏暗场景/pcg高楼/氛围背景

先做这样的氛围
阴暗潮湿（体积雾/雨）
默的力场 —— 基于计算着色器的流体畸变 (Compute Shader Distortion)
Signed Distance Field (SDF) + Ray Marching 或者 Compute Shader Vector Field。

鼠标点击屏幕，产生一个斥力圈，让一张网格图片产生扭曲。

unity怜项目部分：
(数学与算法研究部分)
- [√] planar reflection&stencil buffer
- [ ] 体积云体积雾体积光（raymarching等
- [ ]写远处的海面（一堆方案，shadertoy搬运预备役
- [ ]下雨路面材质升级薄膜干涉
- [ ]怜写雨水排斥的力场
- [ ]加入风场

(美术和工具链研究)
给完善环境和打光
升级粒子雨的vfx思考更多方案等
把怜的模型发型重做贴图重绘
给怜重新做人物渲染
k简单动作

(硬件研究)
我想把我做过的所有东西一通进行性能分析和硬件分析，但我看不懂cpu和gpu的工作原理

渲染管线也可以直接对应阶段复盘与思考？
0.

1.应用阶段：CPU
- 准备基本场景数据：
(1)场景：物体数据怜/一堆场景/
物体变换数据/位置/渲染/缩放（怜的第三人称freelock camera/雨滴粒子算是数据的话就有碰到角色会分开的算法


(2)摄像机：位置/方向/远近裁剪平面
镜子那个给planar reflection渲染RT的摄像机问题数据（这个貌似确实涉及了整条管线,话说你貌似是把近裁剪面做了啥处理来着的.?

(3)光源：各种类型
设置光源
设置阴影：听到了什么优化方面深度偏移近平面偏移不知道能不能用
逐光源绘制贴图（sdf画面部阴影？，体积云算什么...？）


- 加速算法粗粒度剔除：等等但这里就要有粗粒度剔除那我的镜子怎么办？？）
可见场景物体裁剪（之前又是planar reflection的鬼畜现象）
八叉树
bsp树
K-D树
BVH

- 设置渲染状态准备渲染参数：
(1)绘制设置：使用着色器/合批方式（没听过的术语）
(2)绘制物体的顺序：
相对摄像机距离
材质renderQueue
UICanvas
（渲染ui场景模式不一样？（那我看sdf又能做那种ui又能做我的雨丝又能做卡渲面部？
由远到近/先渲染不透明再渲染半透明（？区别何？等等，那你和逐片元操作最终的混合是。？就是在这一步决定逐片元操作的混合该如何混合(cpu)然后让gpu去着色是吗？我写的hlsl/glsl?
三脚猫目前方案：全shader
但是有个项目貌似和UICanvas那个渲染有关）
(3)渲染目标：
FrameBuffer
RenderTexture
（什么是渲染到frame buffer还是啥,什么是渲染操作输出的对象是输出到真缓存里（frame buffer还是到renderTexture里？？
我想起之前弄planar relection然后一堆重影画面现象）/

(4)渲染模式
前向渲染
延迟渲染（这两到底是啥玩意啊...）
（unity等等完全不懂,我记得之前planarreflection又在报urp/sro错

 - 调用draw call输出渲染图元到显存Gpu处理去(所以说上面过程基本都在cpu完成了？buffer指的就是cpu上的dram还是gpu？不得不说buffer这个词真神秘...)

![](/image9.webp)



2.几何阶段：
- 顶点着色(Vertex Shading)：
就是shader？配到gpu不同工作单元去处理？人物渲染/海面/潮湿路面/薄膜干涉？
貌似不是，是坐标系变换，就是从模型坐标系通过那PRS矩阵换过去（经典PositionRotationScale，用PRS代称下transformation
然后最终渲染是我们视角内的东西也就换成观察坐标系（我怎么感觉自己在games101的笔记里面做过这块，

（以下是之前看games101搬运过来的md:）
```md
模型坐标 → 世界坐标 → 观察坐标 → 裁剪坐标 → NDC坐标 → 屏幕坐标
     ↓         ↓         ↓         ↓         ↓         ↓
   几何数据   场景布局   相机相对   齐次坐标   标准化    像素位置
                             透视投影开始   透视投影结束
                                         ↑
                                 透视校正插值发生在这里(但是由w_clip存储z_view的值)


```

不是我怎么感觉还是有点问题。。
然后百人计划后面说视图坐标系完了就是投影坐标系(3D-2D)
就是MVP

然后还有计算顶点光照(雾)

- (可选)顶点着色器输出顶点交给曲面细分(blender里面那个什么sub东西？我记得是多加一些面还是..？)和几何着色器处理(这啥)
这俩对gpu有要求
但是涉及人物貌似是需要高模降低模的逆向过程
图元着色器貌似也在blender里面接触过...
- 投影(Projection) 经典MVP 这里不搬笔记了
- 裁剪(Clipping) CVV/curling(可配置)这个貌似就是怜看见小时候自己设置layer然后不同摄像机 curling的layer不一样看到就不一样了
（unity/opengl:xyz:-1~1/ue：d3d xy：-1~1，z：0~1）
然后屏映射平面坐标系 
（不过这样来看是不是UI的话就没有3d模型空间也就是不涉及投影和透视修正了（那完了。.我感觉我的小组那个通讯录结课大作业接了个vulkan就为了生成一个imgui-vulkan窗口会被老师干死。：）。。。。。实在不行我就去加点3d东西，但问题是：vulkan。（笑嘻，《论我是怎么把自己逼到进退两难的地步的》）
。完蛋
顶点是否在视锥体内不在就剔除，貌似就和上面应用阶段那个算法有点像吧...？
- 屏幕映射(Screen Mapping):连续到离散成为像素点了？（坐标系差异 opengl/D3D等



（然后得到每个顶点在屏幕空间的位置之后）
3.光栅化阶段:
(我怎么总是感觉会把这个阶段和绘制模型UV那个阶段搞混淆..)我只能抽象一点理解光栅化是将怜等模型三角形顶点已经成为屏幕坐标后在那个平面上进行采样绘制了？（大概
- 三角形设置：顶点->计算边界。（这里只讨论三角形了，所以曲线啥..?blender里面有一堆path curve brezier之类的）

- 三角形遍历:什么顶点和1像素之间的区分（所以那些采样是在这里划分哦？）
这里就是比较有名SSAA(直接渲染放大n倍分辨率的buffer(不是，buffer到底是什么。。中文是缓存还是测试还是啥...))/MSAA(多个采样算，覆盖测试 遮挡测试(。。。这些测试是具体的算法吗看之前在1阶段那个算法也有过)。立刻可与4上色进行联动)
覆盖：子采样点是否在三角形内/遮挡测试：和zbuffer比较，都通过，是三角形。
(都是test但注意概念区分...(指4中))
综上得到三角形覆盖信息(片元序列这样)


4.逐片元操作：
- 片元着色(Fragment Shader):哦原来games101那个三角形插值是用在这里的...所以实际的“像素位置”以及UV颜色等还是要经过这里的插值
alphaTest(rgba中a)/Depth Buffer Test/stencil Test(那我之前有个镜子实现方案(仅仅针对一个几何体网格体想的是glsl中的stencil buffer那里，就是测试镜子(貌似镜子作为模版stencil然后剔除对面的像, 当时和现在其实一直有些晕乎尝试用3d蒙版理解...)))
讲真作为z-buffer作比较的话...我就当作z-buffer是某种已经存好深度的“图片数组”来看吧...
但你具体怎么比较呢？地表片元它难道用map储存键和值吗？（一个片元着色数据完对应一个深度值）？。不对那还有UV之类的东西我觉得应该是结构体吧...结构体...貌似也不是（貌似还有其他数据结构能存啊... 算了回头去查查源码问问看。
。好像逻辑打结了，这种用来存储的数据结构就是“buffer”。吧。好吧逻辑貌似通了。
然后这里就可以去仔细处理那个该死镜面planar reflection等我马上去研究...（？但是流程服务这一块又不考虑了？
可以在这里颠倒物理序列（貌似有些很炫酷的点子和效果在我脑子里转，比如跟着一个人影走过去月远离它反而离我更近这样，就是地狱列车里面那种白伞人，但实际上只改变它的物理参数或者键值映射前进后退也很简单解决不用上升到改管线一说哦....）

。模版测试说完我怎么还没弄懂。怎么就和stencil buffer杠上了。。。

[那些Test的顺序等具体](https://chenanbao.github.io/2019/01/19/%E6%B8%B2%E6%9F%93%E7%AE%A1%E7%BA%BF/)

- 颜色混合(Color Blending):记住之前利用oblique queue材质来区分...是和1中那个渲染设置有关？我写的shader？

- 目标缓冲区：。frame buffer（帧缓冲区，所以这个就是真·屏幕空间是吗？）
或者RT，贴图好理解。

GPU粒子？




5.后处理:
纯滤镜的后处理，这方面具体效果再具体拆分和分析（。目前只知道一些零散的个例，貌似还没办法很系统系统地划分。即可。


ue5江南项目部分：
tmd我tm都还没起步都


最近要干的事情：
但是我要准备三天后的高数考试
我要搞完四天后上交的程序设计结课大作业把imgui的bug修完以及搬运latex史山报告(
我莫名刷到个imgui-vue.brige的天才项目于是想搬运代码升级ui交互界面，应该是没时间升级了
同时考虑到数据内存占用问题我想升级数据库处理
我还想在unity里面绘制风格化前端以适应我结课项目的.dll，但是应该没时间做了。)

但我还要去做别人的生日礼物(unity2d,之前做生日礼物项目自己卷自己导致要死。
我想去弄懂我搬过来的hlsl分形为什么鬼畜以及如何和生日礼物适配)

但我还要去研究blender的pcg程序化生成和ue5的bim数字孪生渲染展示，rvt模型那块应付一些东西

。期末考试去死。

Discrete Fourier Transform(DFT)
Fast Fourier Transform
Cooley-Tukey algorithm
Cascade


volume cloud
ray marching
void raymarchv1_float( float3 rayOrigin, float3 rayDirection, float numSteps, float stepSize,
                     float densityScale, float4 Sphere, out float result )
{
	float density = 0;
	
	for(int i =0; i< numSteps; i++){
		rayOrigin += (rayDirection*stepSize);
					
		//Calculate density
		float sphereDist = distance(rayOrigin, Sphere.xyz);

		if(sphereDist < Sphere.w){
			density += 0.1;
        }
					
	}

	result = density * densityScale;
}

SDF
Beer-Lambert Law
$$T(r) = e^{-\int_0^r \sigma_t(x) dx}$$

$$P(\theta) = \frac{1-g^2}{4\pi(1+g^2-2g\cos\theta)^{3/2}}$$使用两层不同速度的 Noise 进行叠加，模拟云的生灭
samplePos += windDirection * time


打家具做纹理。
为什么连自己名字都不会读。。
。为什么前端程序员会来讲纹理。。。

纹理是什么？：一种可供着色器读写的结构化存储形式
image[height][width][4]
T[512][512][4](rgba)

。你妈的开头两分钟你在说绕口令呢我去。。？你tm纯表达问题啊我靠了。
原话:"我们拿比较常见二维纹理作为一个例子的话，二维纹理就是宽 高然后你想要储存的信息 假如说是rgba值来构造一个三维的数组的话，它i和j对应的，刚好图像上那一个像素点，然后k(?????)代表的这一个像素点上面的那一个RGBA值或者是你想要储存的信息，那我们就可以从这里推断出一维纹理，它实际就是i = 0 或 j = 0的一种二维数组。"

。所以合着你那个k指的是三层for循环这个意思是吗。？我看到这里才发现前面说的不是r和g而是i和j。。
。
。
一句话概括 i j 宽高 k rgba值或height/纹理通道/法线 三维纹理是二维子对象构成四维数组。

纹理采样设置后面再说。？？。
纹理 牺牲几何细节 减少建模工作量 减少存储空间 提高读取速度
纹理是模拟物体表面的技术（是吧。

纹理管线:
object space location -> projection(uv展uv,存储在顶点数据中，特殊情况渲染方式逐像素评估 环境贴图，什么球形圆柱形投影(纹理映射)。？) -> corresponder ->texture space location ->(通讯函数uv.?) value obtain (获取纹理值就是纹理采样) -> tecture value (着色器纹理一sample varible采样器变量形式存在就是代码中sample。？貌似记得unity里面之前写过啥。 uniform类型。处理片元时变量不变。)-> value transform function -> transformed texture value

二维纹理sampler2d 依赖纹理读取:像素着色器不是通过顶点着色器传过来而是计算得来会产生然后影响性能。
大部分实时渲染通过lookup函数的方式来索引值但是也有程序纹理，不是内存查找而是函数计算。

获取uv位置与分辨率纹理相乘，后面获取具体纹素颜色就与纹理采样设置决定，纹理采样设置包含在纹理对象之中
warp mode: 决定uv值在[0,1]意外的表现
opengl 包装模式 -- wrapping model
directx 纹理寻址模式 texture addressing mode
repeat mirror clamp border

filter mode:因为变换产生拉伸时要采取哪一种滤波来调整自身表现。
纹理大小完全相同可能会有旋转吗，这样对齐啥还是需要过滤。。？(不同角度缩放比)
纹理过滤是在专门硬件或软件中都可完成。
放大magnification 最近邻(像素化，每一个像素会读取最近1个纹素，消耗很省) 
双线性插值(找到四个周围点然后线性插值计算) 
P(u, v) = (81.92, 74.24)
-(0.5, 0.5) = (81.42, 73.74)
最临近四个像素点范围是(81, 73)-(82, 74)
相对于该四个像素中心形成的坐标系的位置(u', v') = (0.42, 0.74)
插值颜色 = (1-0.42)*(1-0.74) * t(x,y) + 0.42*(1-0.74)*t(x+1,y) + (1-0.42) * 0.74 * t(x,y + 1) + 0.42*0.74*t(x+1,y+1)
解决了不连续性但只有四个点


立方卷积 考虑到变化率影响。p(x+u, y+v)点就是对应点(x, y)对应在目标图像的位置，双立方差值就是通过bicubic基函数得到目标像素点周围的16个相邻像素目标像素点P的影响因子。公式一坨看着像高数卷子上的。

Quilez的光滑曲线插值(中和)
s(x) = x^2(3- 2x)(经典smoothstep。) and q(x) = x^3(6*x^2 - 15x + 10)(没见过但是叫quintic的东西。)
就是把uv处理成u'和v'进行处理。

纹理缩小
几个纹理一个像素
缩小的最近邻与双线性插值 
颜色丢失和闪烁

屏幕100 * 100 采样一张2048 * 2048
当(u,v) = (0.2, 0.6)时，会采样(409.6, 1228.8)浮点数运算
=(0.21,0.61)时会采样(430.08,1249.28)然后就20多个像素。。我好像在哪见过这个问题来着。。。

mipmap 每个像素最多有一个纹理来避免混点，提高像素采样频率 
降低纹理频率:mipmap 预处理纹理创建数据结构快速计算一组纹素对一个像素的效果的近似值。金字塔
2*2 4个相邻纹理的平均值作为下一级新的纹素值(。我好像也不是很清楚纹素是什么。)新一级子纹理是上一级1/4大。重复到顶尖纹理是1*1。整套纹理比纹理多了1/3内存。没有计算过程。
。。。。不是。。。。我想骂人了。你这个mipmap介绍的。。。？？？？顶尖纹理是1*1,1*1啥啊1*1像素吗什么东西那这样纹理越来越小吗？2048*2048y压缩到1*1吗这个意思然后运用到100*100吗？。啥意思啊我靠。

mipmap选择正确level满足采样定理。
```cs
float dx = ddx(i.uv);
float dy = ddy(i.uv);用顶点着色器传来的uv和ddx和ddy这两api算出(x,y)偏导数

float lod = 0.5 * log2(max(dot(dx, dx), dot(dy, dy)));
自点乘后作为边长平方得出最长边再开发作为level。(。。。什么神奇勾股定理。？。约定俗称的凑数字？。此lod为一个数字)
float3 albedo = tex2Dlod(_MainTex, float4(i.uv, 0, lod)).rgb;

```
天书对话:使用像素单元格所形成一个四边形最长边近似像素范围，四边形两条边用偏导求
gpu把pivel 2*2分组并行执行 为了算ddx和ddy以及发现。
dFdx(p(x,y)) = (p(x+1, y) - p(x,y))/1.0
dFdx(p(x,y)) = (p(x, y+1) - p(x,y))/1.0
这里dx为1.不需要p(x+1,y+1)

静态来看块与块有点不平滑，动态看纹理切换有不同level 三插值来解决，在做一遍双线性过滤，最接近mipmaplevel双线性过滤。

mipmap 不需要实时累加纹素只需要访问预处理就可，不论level多少过程一样。
内存+但是消耗带宽小。只要传输小的那一张图即可

mipmap 过度模糊(overblur)假设texture投射过去各向同性。

如果一个像素单元格u方向纹理多v方向纹素少，一些被平均纹素产生各向异性过滤。
。又开始语言跳脱了。你他妈说的能连成一个句子吗。。。？？？
ripmap 各种比例矩形异处理。
。我的想法：不能美术解决吗。？。一个手机相册拉伸剪辑的事情。

EWA过滤 用椭圆近似 多次查询加权平均数。

各向异性过滤:积分图summed area table 
idm一个和纹理大小相同但颜色精度更高的数组 左上(0,0)为纹素原点。
"每一个位置计算并存储这个位置和纹素原点形成的剧情所对应的所有纹理的纹素的总和"。
。哥们。你在说什么。
average = (LR-UR-LL+UL)/W*H

。气笑了。感觉这位前端工程师已经沉浸在自己的艺术里了。(看图。我不知道你在算什么。)

任意四个点对任意剧情内部纹素平均值进行一个快速运算。然后此是SAT。

。神秘算法后越靠右下角数值越大。
。games101课忘了。
什么remap纹理各向异性过滤之后纹理内存

好的那么临场提问
1.unity里面的sampler2D如何把你上面学的理论串联起来？（。？关联在？
2.tex2D？
```
sampler2D _MainTex; // Declare the texture sampler

float4 frag(v2f i) : SV_Target {
float2 uv = i.uv; // UV coordinates
float4 color = tex2D(_MainTex, uv); // Sample the texture
return color; // Output the sampled color
}
```
依旧有SamplerState Sampler_等




视觉小说里面纹理压缩方法貌似把一些相同纹理整合在一起。
[ducedSpriteCharacter](https://github.com/elringus/sprite-dicing)
。你在写什么拼好饭笔记。？

我发现我好像可以偷代码下来




所以。各向异性过滤可以单开一个

kajiya-kay 毛发渲染
。原来这玩意有自己的名字啊...

怜头发需要去准备texture

lightmode meta不知道什么会寄，并不知道为什么要用universalforward

标记Transform 管线 NDC clip 你又忘了是吗。所以以及和后面法线转就都没看懂。
float3 aldedo = _Albedo.rgb * tex2D(_AlbedoMap, fragment.uv).rgb;
。。。神奇原来中间是乘法吗。？。
代入了下1 1 1 1貌似就是。行吧。

。
写不动就直接复制粘贴吗，哈基草你这家伙
```hlsl
// 采样参数
float3 albedo = tex2D(_MainTex, uv).rgb * _Color.rgb;
float metallic = _Metallic;
float smoothness = _Glossiness;

// 计算法线
float3 normal = UnpackNormal(tex2D(_BumpMap, uv));

// 计算视角、光照方向
float3 viewDir = normalize(_WorldSpaceCameraPos - worldPos);
float3 lightDir = normalize(_WorldSpaceLightPos0.xyz);

// Cook-Torrance BRDF
float3 F0 = lerp(0.04, albedo, metallic);
float3 F = FresnelSchlick(F0, dot(viewDir, halfDir));
float D = DistributionGGX(normal, halfDir, roughness);
float G = GeometrySmith(normal, viewDir, lightDir, roughness);

float3 numerator = D * F * G;
float denominator = 4 * max(dot(normal, viewDir), 0) * max(dot(normal, lightDir), 0) + 0.001;
float3 specular = numerator / denominator;

// 最终颜色
float3 kD = (1 - F) * (1 - metallic);
float3 diffuse = kD * albedo / PI;

float3 color = (diffuse + specular) * lightColor * NdotL;
```

CGPROGRAM
HLSLPROGRAM。。。。？何区别。。。？

...我貌似不能很能理解positionWS采的是TEXCOORD0 然后uv采的是TEXCOORD1。(fragment里面)
Vextex里面uv去采TEXCOORD0去了。
在 Vertex 结构体中：语义告诉 GPU 从模型资源（Mesh）的哪个缓冲区读取数据。



我又要把blinnphong搬出来吗
...处理基础属性的方式还不一样
float metalic = _Metallic * tex2D(_MetallicMap, fragment.uv).r;
//float metalic = saturate(max(_Metalness + EPS, tex2D(_MetallicMap, fragment.uv)).r);

貌似可以把那个积分公式搬过来然后对着公式敲也行，，，吧。

float smoothness = 1 - sqrt(_RoughnessMap * tex2D(_RoughnessMap, fragment.uv).r);
.实际直接1-也行

之后能量守恒等核心部分

float dielectricSpec = 0.04;
float3 diffuse = lerp(albedo * (1 - dielectricSpec), 0, metallic);
float3 specular = lerp(dielectricSpec, albedo, metallic);
(不是很能理解.?)

光照物理 菲涅尔
//光照物理：菲涅尔
specular = lerp(specular, grazingTerm, pow(1 - saturate(dot(normal, v)), 4));

//URP 支持最多 1盏主光源 + 8盏附加光源


...我觉得这api纷繁复杂之我如何锻炼能力？
就是明白原理后自己写，然后遇到哪个api不会自己去查？（查完接着忘，然后只有重复写这个过程才用的熟练？吗）

shader寄存器资源宝贵，内存浪费

function linearstep( a: Number, b: Number, t: Number ): Number
  return saturate( ( t - a ) / ( b - a ) )
end function

let shading: Number = dot( N, L )
shading = shading + shadingShiftFactor
shading = shading + texture( shadingShiftTexture, uv ) * shadingShiftTexture.scale
shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading )

let baseColorTerm: ColorRGB = baseColorFactor.rgb * texture( baseColorTexture, uv ).rgb
let shadeColorTerm: ColorRGB = shadeColorFactor.rgb * texture( shadeMultiplyTexture, uv ).rgb

let color: ColorRGB = lerp( shadeColorTerm, baseColorTerm, shading )
color = color * lightColor

//Ambient
Light mainLight;
mainLight = GetMainLight();
float3 ml  = albedo * mainLight.color;
finalColor = ml;
int c = GetAdditionalLightsCount();
for(int i = 0; i < c; ++i) {
    Light addLight = GetAdditionalLight(i, fragment.positionWS);
    finalColor += addLight.color * albedo;
}

计算漫反射需要法向量但是法向量信息储存在normalmap里..?

菲涅尔数学形式
$$F(\theta) = F_0 + (1 - F_0)(1 - \cos\theta)^5$$
近似: return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
unity: specular = lerp(specular, grazingTerm, pow(1 - saturate(dot(normal, v)), 4));
(lerp)

固定会去计算tanentMatrix...? 

float3x3 tangentMatrix = transpose(float3x3(i.tangent, i.bitangent, i.normal));

CGPROGRAM
float D = trowbridgeReitzNDF(NdotH, roughness);
            D = trowbridgeReitzAnisotropicNDF(NdotH, roughness, _Anisotropy, HdotT, HdotB);
            float3 F = fresnel(F0, NdotV, roughness);
            float G = schlickBeckmannGAF(NdotV, roughness) * schlickBeckmannGAF(NdotL, roughness);

HLSLPROGRAM：
//光照物理：能量守恒、双向反射分布
				float3 diffuse = lerp(albedo * (1 - dielectricSpec), 0, metallic);
				float3 specular = lerp(dielectricSpec, albedo, metallic);
				//光照物理：菲涅尔
				specular = lerp(specular, grazingTerm, pow(1 - saturate(dot(normal, v)), 4));

$$h = \frac{l + v}{||l + v||}$$

Direct Light (直接光)：计算 DFG 时，通常用 $H \cdot V$ 或 $H \cdot L$。
IBL / Environment Reflection (环境反射)

反射率方程，然后树状往下延伸(是。)
。。。回头整合笔记吧目前很乱了属于是
然后就可以挖光追和路线追踪的大坑(。)
pbr流程，自发光，计算物体本身有材质属性(固定一套即可。) 光线统计

物体本身一套：BRDF
BRDF blinn-phong/cook-Torrance
D F G

。手游写pbr方法和端游不一样。？。

kd * f{diffuse} + ks * f{specular}