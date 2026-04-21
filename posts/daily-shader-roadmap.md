---
title: dailyshader
date: 2026-03-29
tags: [ethers]
head:
  - - meta
    - name: tip
      content: tinf
  - - meta
    - name: tip
      content: tinf
---
dailyshader

---

# Daily Shader Practice Roadmap

> persist....

## Cheer up!

+ Conceptually....I seem like dig a infinite hole....

## Week 1 — SDF advanced

> Core


| Day | practise                                                                 | 关键概念                                                                                 | lan |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --- |
| 1   | `smoothmin` different shape and blob                                    | smooth union / smin etc                                                                  | [S] |
| 2   | `domain repetition`：infinite                                            | `mod()` / `fract()`                                                                     | [S] |
| 3   | use`atan2` + radial SDF                                                 | Polar coordinate and mirror                                                              | [S] |
| 4   | [ ] SDF 做 2D 文字/符号描边 + 发光效果 🎨                                | SDF glow；**色彩：additive blending 原理，为什么 glow 用加法混合而非 alpha**             | [S] |
| 5   | [ ] 用 SDF onion 技巧做嵌套环形结构，加上颜色渐变 🎨                     | onion SDF、`abs(d)-thickness`；**色彩：cosine palette 调色板生成 `a+b*cos(2π(c*t+d))`** | [S] |
| 6   | [ ] ★ 把以上技巧组合：做一个"漂浮的几何花园" 🎨                         | 构图、组合；**色彩：互补色 / 类似色和谐，限制 3-4 色配色方案**                           | [S] |
| 7   | **周末项目**：在 Unity URP 中实现一个 SDF decal shader，投射到场景物体上 |                                                                                          | [U] |

**本周阅读**：Inigo Quilez 的 [2D SDF 函数合集](https://iquilezles.org/articles/distfunctions2d/) + [Cosine Palette](https://iquilezles.org/articles/palettes/)（程序化配色神器）

---

## Week 2 — 动画与时间驱动

> 核心：让画面活起来，掌握 shader 动画的节奏感


| Day | 练习                                                                     | 关键概念                                                                         | 平台 |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---- |
| 8   | [ ] 用`smoothstep` 链做一个有缓动感的圆形展开动画                        | easing 曲线、`smoothstep` 组合                                                   | [S]  |
| 9   | [ ] 实现`sin`/`cos` 驱动的呼吸灯 + 轨道运动 🎨                           | 三角函数动画、相位偏移；**色彩：HSL 色彩空间，用 hue 旋转做颜色动画**            | [S]  |
| 10  | [ ] 用`step(fract(iTime), 0.5)` 类节奏控制做闪烁序列                     | 离散时间、节拍同步思路                                                           | [S]  |
| 11  | [ ] 弹性动画：实现一个 bounce easing 函数并可视化                        | 自定义 easing、弹性衰减                                                          | [S]  |
| 12  | [ ] UV scroll + distortion：流动的水面纹理 🎨                            | UV 动画、扰动叠加；**色彩：用 `mix()` 在冷暖色间渐变表达水的深浅**               | [S]  |
| 13  | [ ] ★ "月相变化"：用 SDF + 动画做月亮从新月到满月的循环 🎨              | 综合 SDF 动画；**色彩：色温的物理含义——月光偏冷 (7000K+) vs 暮色偏暖 (2000K)** | [S]  |
| 14  | **周末项目**：Unity URP 中做一个 vertex animation shader，让植物随风摆动 |                                                                                  | [U]  |

**本周阅读**：[The Book of Shaders — Shaping Functions](https://thebookofshaders.com/05/)

---

## Week 3 — 噪声与程序化纹理

> 核心：从 value noise 到 FBM，掌握"自然感"的来源


| Day | 练习                                                                           | 关键概念                                                                                             | 平台 |
| --- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---- |
| 15  | [ ] 从零手写一个 2D value noise（不用内置函数）                                | 哈希函数、双线性插值                                                                                 | [S]  |
| 16  | [ ] 实现 gradient noise (Perlin)，对比 value noise 的视觉差异                  | 梯度向量、点积插值                                                                                   | [S]  |
| 17  | [ ] 用 FBM 叠加 4-6 层 noise 做云层纹理 🎨                                     | octave 叠加、lacunarity、gain；**色彩：用 noise 值驱动 cosine palette，体会 remap 对色彩分布的影响** | [S]  |
| 18  | [ ] Voronoi / cellular noise：实现最近点距离场                                 | 网格搜索、距离函数                                                                                   | [S]  |
| 19  | [ ] Domain warping：用 noise 扭曲 noise 的输入坐标 🎨                          | `fbm(p + fbm(p))` 模式；**色彩：用 warp 后的不同通道独立映射 RGB，理解通道分离的视觉效果**           | [S]  |
| 20  | [ ] ★ "墨在水中扩散"：domain warping + 时间动画做水墨效果 🎨                  | 综合噪声动画；**色彩：有限色板——只用黑/靛/白三色表达水墨层次**                                     | [S]  |
| 21  | **周末项目**：Unity 中做一个程序化地形 shader，用 noise 混合草地/岩石/雪的纹理 |                                                                                                      | [U]  |

**本周阅读**：Inigo Quilez 的 [Value Noise Derivatives](https://iquilezles.org/articles/morenoise/)

---

## Week 4 — 光照与材质着色

> 核心：超越 Phong，理解现代材质表达


| Day | 练习                                                                                                                                                                             | 关键概念                                                                                                                  | 平台 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---- |
| 22  | [ ] 在 Shadertoy 里从零实现 Blinn-Phong，3 个不同材质球并排 🎨                                                                                                                   | 漫反射 + 高光 + 环境光；**色彩：为什么阴影不是"暗色"而是冷色偏移（ambient 偏蓝）**                                        | [S]  |
| 23  | [ ] 实现 Fresnel 效果（菲涅尔反射），做玻璃/水面边缘光                                                                                                                           | Schlick 近似、入射角                                                                                                      | [S]  |
| 24  | [ ] 简化 PBR：Cook-Torrance BRDF 的核心三件套 🎨                                                                                                                                 | NDF (GGX)、G (Smith)、F (Fresnel)；**色彩：金属 vs 非金属的 F0 差异——金属的反射自带颜色 (gold ≈ vec3(1.0,0.71,0.29))** | [S]  |
| 25  | [ ] Matcap 扩展：多 Matcap 混合 + 法线扰动                                                                                                                                       | 视空间法线、纹理混合                                                                                                      | [U]  |
| 26  | [ ] 半透明材质：subsurface scattering 的快速近似 🎨                                                                                                                              | 厚度图、wrap lighting；**色彩：SSS 材质的色彩特征——皮肤透光偏红，玉石透光偏绿**                                         | [U]  |
| 27  | [ ] ★ "三颗宝石"：用不同光照模型渲染三种材质（磨砂/金属/玻璃） 🎨                                                                                                               | 材质参数对比；**色彩：同一打光下，仅靠 F0 和 roughness 变化如何暗示不同材质**                                             | [S]  |
| 28  | **周末项目**：Unity URP 中写一个完整的 stylized toon shader 🎨——rim light + 色阶 + 阴影颜色控制；**额外要求：阴影色不用纯黑，用色相偏移（如紫色阴影 + 暖色高光的吉卜力风格）** |                                                                                                                           | [U]  |

**本周阅读**：[LearnOpenGL — PBR Theory](https://learnopengl.com/PBR/Theory)

---

## Week 5 — Raymarching 入门

> 核心：进入 3D 程序化渲染的大门


| Day | 练习                                                                     | 关键概念                                                                                                     | 平台 |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---- |
| 29  | [ ] 最简 raymarcher：渲染一个球体 + 地平面                               | ray origin / direction、SDF 步进                                                                             | [S]  |
| 30  | [ ] 加入光照：用有限差分算 SDF 法线，做 diffuse shading 🎨               | `gradient = (f(p+e)-f(p-e)) / 2e`；**色彩：光源色 × 材质色的乘法本质——为什么 `lightColor * albedo` 有效** | [S]  |
| 31  | [ ] 软阴影：沿光线方向 march，用最近距离估算遮蔽                         | penumbra 软阴影技巧                                                                                          | [S]  |
| 32  | [ ] AO：用多次短距离 march 估算环境遮蔽                                  | SDF-based AO                                                                                                 | [S]  |
| 33  | [ ] 3D SDF 场景：组合多个几何体 + smooth union                           | 场景构建、CSG 操作                                                                                           | [S]  |
| 34  | [ ] ★ "漂浮岛屿"：raymarched 地形 + noise 变形 + 雾气 🎨                | 综合 raymarching；**色彩：大气透视——远处物体色相偏向天空色、饱和度降低、明度收拢**                         | [S]  |
| 35  | **周末项目**：把一个 Shadertoy raymarcher 移植到 Unity fullscreen shader |                                                                                                              | [U]  |

**本周阅读**：Inigo Quilez 的 [Raymarching SDFs](https://iquilezles.org/articles/distfunctions/)

---

## Week 6 — 后处理与屏幕空间效果

> 核心：游戏引擎里最实用的 shader 类型


| Day | 练习                                                                                                                  | 关键概念                                                                                         | 平台 |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| 36  | [ ] 色调映射对比：实现 ACES / Reinhard / Uncharted2 三种 🎨                                                           | HDR → LDR 映射；**色彩：不同 tonemapper 如何影响色彩饱和度和色相偏移，ACES 的"电影感"从何而来** | [S]  |
| 37  | [ ] Color grading：LUT 原理 + 手写简单的色彩校正 🎨                                                                   | **色彩理论重点日**：色温/色调拆解、lift-gamma-gain 三区调色、对比度 S 曲线、选择性饱和度控制     | [S]  |
| 38  | [ ] 高斯模糊：两 pass 分离式模糊实现                                                                                  | 可分离卷积核                                                                                     | [U]  |
| 39  | [ ] Bloom 管线：降采样 → 模糊 → 升采样 → 合成 🎨                                                                   | mip chain bloom；**色彩：bloom 的色彩倾向——为什么 bloom 加微量暖色偏移会更"电影"**             | [U]  |
| 40  | [ ] 体素化 / 像素化后处理 + CRT 扫描线效果 🎨                                                                         | 屏幕空间量化、逐行效果；**色彩：sRGB gamma 曲线——为什么 shader 里做颜色运算要先 linearize**    | [U]  |
| 41  | [ ] ★ "旧电影"效果：胶片颗粒 + 暗角 + 色差 + 闪烁 🎨                                                                 | 多效果合成；**色彩：sepia tone 映射、色差的 RGB 通道空间偏移**                                   | [U]  |
| 42  | **周末项目**：在 Unity URP 中用 ScriptableRendererFeature 实现一个可配置的 post-processing stack（至少 3 个效果串联） |                                                                                                  | [U]  |

**本周阅读**：[Catlike Coding — Post Processing](https://catlikecoding.com/unity/tutorials/custom-srp/post-processing/)

---

## Week 7 — 体积渲染与高级技巧

> 核心：云、雾、光束——空间感的终极表达


| Day | 练习                                                                                   | 关键概念                                                                                     | 平台 |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---- |
| 43  | [ ] 基础体积 ray march：均匀介质中的雾                                                 | Beer-Lambert 定律、透射率                                                                    | [S]  |
| 44  | [ ] 用 3D noise 做非均匀密度的云                                                       | 3D FBM、密度采样                                                                             | [S]  |
| 45  | [ ] 体积光照：单次散射的 Henyey-Greenstein 相函数 🎨                                   | 前向/后向散射；**色彩：Rayleigh 散射——为什么天空蓝、日落红（散射系数与波长的四次方反比）** | [S]  |
| 46  | [ ] 光轴 (god rays)：屏幕空间径向模糊法                                                | 从光源向外采样                                                                               | [U]  |
| 47  | [ ] 热扭曲 / 折射效果：grabpass + 法线偏移采样                                         | 屏幕空间折射                                                                                 | [U]  |
| 48  | [ ] ★ "云海日出"：体积云 + 大气散射 + 太阳光晕 🎨                                     | 综合体积渲染；**色彩：日出色彩序列——从深蓝→紫→粉→橙→金的渐变如何用色温曲线构造**     | [S]  |
| 49  | **周末项目**：Unity URP 中实现正交/透视兼容的体积云，接入你的 Monument Valley 项目测试 |                                                                                              | [U]  |

**本周阅读**：[Sebastian Lague — Clouds](https://www.youtube.com/watch?v=4QOcCGI6xOU)（视频）

---

## Week 8 — 风格化渲染与个人表达

> 核心：把技术变成你自己的视觉语言


| Day | 练习                                                                                                                               | 关键概念                                                                                                                       | 平台 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---- |
| 50  | [ ] 手绘描边：屏幕空间等宽轮廓 vs 模型空间法线外扩                                                                                 | 两种描边思路对比                                                                                                               | [U]  |
| 51  | [ ] 水彩/纸张效果：noise 做纸纹 + 边缘渗色 + 颜色溢出 🎨                                                                           | 程序化纹理仿真；**色彩：水彩的光学——颜料是减色混合 (subtractive)，叠色越多越浊，shader 里用 `multiply` 模拟**                | [S]  |
| 52  | [ ] 像素风 dithering：实现 Bayer matrix 有序抖动 🎨                                                                                | ordered dither、阈值矩阵；**色彩：量化调色板——如何从图像自动提取 N 色板 (median cut 思路)，dither 在有限色板下保留视觉层次** | [S]  |
| 53  | [ ] 全息 / 故障效果：扫描线 + RGB 分离 + 随机条纹 🎨                                                                               | glitch art 技巧；**色彩：RGB vs YUV——为什么 glitch 在 YUV 空间做通道错位更有"信号故障"的真实感**                             | [U]  |
| 54  | [ ] 梦境过渡：scene transition shader（溶解、涟漪、折纸展开） 🎨                                                                   | 过渡动画、dissolve；**色彩：过渡中的情绪配色——冷色调渐入 vs 暖色调渐入传达截然不同的叙事感**                                 | [U]  |
| 55  | [ ] ★ 自选主题自由创作 🎨：用 8 周学到的任意技巧组合，做一个自己满意的作品。**额外挑战：先在纸上/Coolors 上定好配色方案再写代码** | 个人风格                                                                                                                       | 自选 |
| 56  | **周末项目**：把最满意的 3 个练习成果整理成 Shadertoy 合集 / Unity shader 包                                                       |                                                                                                                                | 整理 |

---

## 🎨 色彩理论速查手册

> 以下知识点分散在各天练习中，这里汇总方便随时翻阅

### 色彩空间 — Shader 里你会用到的


| 空间            | 用途                       | Shader 里怎么转                          |
| --------------- | -------------------------- | ---------------------------------------- |
| **sRGB**        | 纹理存储、屏幕输出         | 非线性，gamma ≈ 2.2                     |
| **Linear RGB**  | 光照计算必须在这里做       | `pow(srgb, 2.2)` 或 `SRGBToLinear()`     |
| **HSL / HSV**   | 色相旋转、饱和度调整       | 手写`rgb2hsv()` / `hsv2rgb()`            |
| **YUV / YCbCr** | 亮度/色度分离，glitch 效果 | 标准矩阵变换                             |
| **OKLAB**       | 感知均匀的颜色插值（推荐） | 比 HSL 更适合做`mix()`，渐变不会出现灰带 |

### 配色理论 — 用代码思考颜色

- **Cosine Palette**：`color(t) = a + b * cos(2π(c*t + d))`，四个 `vec3` 参数控制整个调色板，iq 神器
- **互补色 (Complementary)**：色轮 180° 对面，对比最强烈
- **类似色 (Analogous)**：色轮相邻 30°，和谐自然
- **三角配色 (Triadic)**：色轮 120° 等分，平衡而丰富
- **分裂互补 (Split-Complementary)**：互补色的两侧邻色，比纯互补更柔和
- **限色原则**：一个画面 3-4 色足够；1 主色 + 1 辅色 + 1 点缀色是安全公式

### 光与色 — Shader 里的物理直觉

- **加法混合 (Additive)**：光 + 光 = 更亮。`color1 + color2`。发光、bloom、glow 用这个
- **减法混合 (Subtractive)**：颜料 + 颜料 = 更暗。`color1 * color2`。水彩叠色、滤镜用这个
- **光源色 × 物体色**：最终颜色 = `lightColor * albedo`，这就是为什么红光下蓝色物体变黑
- **阴影不是黑色**：好的阴影带色相偏移——室外阴影偏蓝（天光补偿），吉卜力风格阴影偏紫
- **色温的代码表达**：Kelvin → RGB 有经典近似公式，也可以简单用 `mix(warmColor, coolColor, t)`

### 感知与情绪 — 让画面"对味"

- **明度对比**才是可读性的关键，色相对比是次要的（灰度测试你的画面！）
- **饱和度策略**：大面积低饱和 + 小面积高饱和点缀 = 高级感；全屏高饱和 = 廉价感
- **冷暖对比**比色相对比更容易创造空间感——近处暖、远处冷是大气透视的核心
- **gamma 陷阱**：在 sRGB 空间做 `mix()` 会得到错误的中间色（偏暗），永远在线性空间做颜色数学

### 推荐工具与资源

- **Coolors.co** — 快速配色方案生成器
- **OKLAB Palette** — https://bottosson.github.io/posts/oklab/ — 感知均匀色彩空间的论文与实现
- **Lospec Palette List** — https://lospec.com/palette-list — 像素风格限色板大合集
- **The Book of Shaders — Color** — https://thebookofshaders.com/06/ — 交互式色彩章节

---

## 补充资源

### 必读/必看

- **Inigo Quilez 的文章合集** — https://iquilezles.org/articles/ （shader 圣经级）
- **The Book of Shaders** — https://thebookofshaders.com （交互式入门）
- **Catlike Coding** — https://catlikecoding.com/unity/tutorials/ （Unity shader 最佳教程）
- **Ben Cloward YouTube** — Unity shader graph 和 HLSL 讲解

### Shadertoy 值得研究的经典作品

- `Rainier mood` by iq — 体积云与大气的教科书
- `Seascape` by TDM — 海面程序化渲染
- `Flame` by iq — 极简但优美的火焰
- `Elevated` by iq — 4KB 程序化地形（传奇 demo）
- `Protean Clouds` by nimitz — domain warping 的极致

### 数学补充

- 极坐标、球坐标变换
- 矩阵旋转（2D rotation matrix、Rodrigues rotation）
- 四元数基础（Unity 中的旋转表达）
- 复数与分形（Mandelbrot / Julia set 作为练习项目）
- 色彩空间变换矩阵（RGB↔YUV、RGB↔OKLAB 的线性代数本质

> 祝你写出漂亮的 shader ✨
