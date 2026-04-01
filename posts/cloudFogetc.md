---
title: volume cloud
date: 2026-03-21
tags: [computer graphic]
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

<video controls width="100%">
  <source src="/cloud12.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>


to be honest, through adjusting different parameters it seemed like water.....(dont consider performance..?)



## first way I explore to make some Clouds

## basic concept

### noise
+ lattice based noise
+ value noise
+ $$FBM(p) = \sum_{i=0}^{n-1} a_i \cdot noise(f_i \cdot p)$$
+ domain warp: fbm+fbm



linear rnd
上下限符号难打....? 
x下 
$$noise(x) = hash([x]_下) + (x-[x]_下) * (hash([x]_上) - hash([x]_下))$$
lerp(hash[x]下, hash[x]上，x - [x]下 ) 
smoothstep： f(x-[x]下)作为系数部分
 

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

---
#### unity

noise generate

```c#
#pragma kernel CSMain

// R 通道 = 基础低频云形噪声
// G 通道 = 高频细节噪声
// B 通道 = 可扩展（当前留空）
// A 通道 = 1.0
RWTexture3D<float4> Result;

uint  resolution;
float time;          

// ---- 基础哈希 ----
float3 hash33(float3 p)
{
    p = float3(dot(p, float3(127.1,  311.7,  74.7)),
               dot(p, float3(269.5,  183.3, 246.1)),
               dot(p, float3(113.5,  271.9, 124.6)));
    return -1.0 + 2.0 * frac(sin(p) * 43758.5453123);
}

// ---- Perlin Noise 3D ----
float perlin(float3 p)
{
    float3 i = floor(p);
    float3 f = frac(p);
    // Quintic 插值（比 smoothstep 更平滑）
    float3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    return lerp(
        lerp(lerp(dot(hash33(i + float3(0,0,0)), f - float3(0,0,0)),
                  dot(hash33(i + float3(1,0,0)), f - float3(1,0,0)), u.x),
             lerp(dot(hash33(i + float3(0,1,0)), f - float3(0,1,0)),
                  dot(hash33(i + float3(1,1,0)), f - float3(1,1,0)), u.x), u.y),
        lerp(lerp(dot(hash33(i + float3(0,0,1)), f - float3(0,0,1)),
                  dot(hash33(i + float3(1,0,1)), f - float3(1,0,1)), u.x),
             lerp(dot(hash33(i + float3(0,1,1)), f - float3(0,1,1)),
                  dot(hash33(i + float3(1,1,1)), f - float3(1,1,1)), u.x), u.y),
        u.z);
}

// ---- FBM 3D（可控 octave 数）----
float fbm3D(float3 p, int octaves)
{
    float  val       = 0.0;
    float  amplitude = 0.5;
    float  freq      = 1.0;
    for (int i = 0; i < octaves; i++)
    {
        val       += amplitude * perlin(p * freq);
        freq      *= 2.0;
        amplitude *= 0.5;
    }
    return val; // 范围约 [-1, 1]
}

// ---- Billowy 噪声（abs(perlin)）----
float billowyFBM(float3 p, int octaves)
{
    float  val       = 0.0;
    float  amplitude = 0.5;
    float  freq      = 1.0;
    for (int i = 0; i < octaves; i++)
    {
        // 1 - |perlin| 产生圆润的"穹形"而非平滑斜坡
        val       += amplitude * (1.0 - abs(perlin(p * freq)));
        freq      *= 2.0;
        amplitude *= 0.5;
    }
    return val; // 范围约 [0, 1]
}

// ---- 密度重映射：把噪声拉伸成硬边云朵 ----
//  低于 threshold 的部分归零，其余拉伸到 [0,1]
float remapDensity(float raw, float threshold, float power)
{
    float v = saturate((raw - threshold) / max(1.0 - threshold, 0.0001));
    return pow(v, power);
}

[numthreads(8, 8, 8)]
void CSMain(uint3 id : SV_DispatchThreadID)
{
    float3 uvw = float3(id) / float(resolution);

    // ---- R 通道：基础低频 billowy 云形 ----
    //  frequency 低 → 大块，billowy 让形状圆润
    float3 basePos  = uvw * 3.5;
    float  baseNoise = billowyFBM(basePos, 4);        // [0, 1] 大致
    // 密度重映射：threshold=0.45 控制云的稀疏程度，power=1.5 拉硬边
    float  baseDens  = remapDensity(baseNoise, 0.45, 1.5);

    // ---- G 通道：高频细节噪声（用于 shader 里侵蚀边缘）----
    float3 detailPos  = uvw * 8.0;
    float  detailNoise = fbm3D(detailPos, 3) * 0.5 + 0.5; // 映射到 [0,1]
    // 细节只保留高频碎片，归一化对比度
    detailNoise = remapDensity(detailNoise, 0.3, 1.0);

    Result[id] = float4(baseDens, detailNoise, 0.0, 1.0);
}
```

 


### sdf
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


### ray marching

+ ro = ro + t * rd 
+ if(< 0.001)

```c
      Varyings vert(Attributes IN)
            {
                Varyings OUT;

                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.objPos      = IN.positionOS.xyz;


                float3 camPosWS = _WorldSpaceCameraPos;
                float3 camPosOS = mul(unity_WorldToObject, float4(camPosWS, 1.0)).xyz;
                OUT.viewDirOS   = normalize(IN.positionOS.xyz - camPosOS);


                OUT.fogFactor = ComputeFogFactor(OUT.positionHCS.z);

                return OUT;
            }


            half4 frag(Varyings IN) : SV_Target
            {
                // ===== 1. 射线方向 =====
                // unity_OrthoParams.w : 1 = 正交  0 = 透视
                float isOrtho = unity_OrthoParams.w;

                // 正交：所有像素共享相机朝前方向
                // UNITY_MATRIX_V 第 2 行 = view-space Z 轴（world-space 反前向），取反得正前向
                float3 camFwdWS = -UNITY_MATRIX_V[2].xyz;
                float3 camFwdOS = normalize(mul((float3x3)unity_WorldToObject, camFwdWS));

                float3 rd = lerp(IN.viewDirOS, camFwdOS, isOrtho);

                // ===== 2. 射线起点 =====
                float3 camPosWS = _WorldSpaceCameraPos;
                float3 camPosOS = mul(unity_WorldToObject, float4(camPosWS, 1.0)).xyz;

                // 透视 & 相机在盒内：从相机位置开始；否则从盒表面顶点开始
                // 正交：始终从表面顶点开始（相机在物体空间不是一个确定点）
                bool isInsideBox = (abs(camPosOS.x) < 0.5 &&
                                    abs(camPosOS.y) < 0.5 &&
                                    abs(camPosOS.z) < 0.5);
                float3 ro = (isInsideBox && isOrtho < 0.5) ? camPosOS : IN.objPos;

                // ===== 3. 动画偏移 =====
                float3 windDir    = normalize(_WindDir.xyz);
                float3 windOffset = windDir * _Time.y * _WindSpeed;
                // 细节层以不同速度、轻微偏转方向滚动
                float3 detailOffset = float3(-windDir.z, 0, windDir.x) * _Time.y * _DetailSpeed;

                // ===== 4. Ray march =====
                float  transmittance = 1.0;
                float3 finalColor    = float3(0, 0, 0);
                float  alpha         = 0.0;

                for (int step = 0; step < _MaxSteps; step++)
                {
                    // 物体空间 [-0.5, 0.5] → UV [0, 1]
                    float3 uvw = ro + 0.5;

                    // 超出单位立方体则停止
                    if (any(uvw < -0.001) || any(uvw > 1.001))
                        break;

                    // --- 基础噪声（R 通道）---
                    float3 baseUVW   = frac(uvw + windOffset);
                    float  baseNoise = SAMPLE_TEXTURE3D_LOD(
                                            _VoluimeTex,
                                            sampler_VoluimeTex,
                                            baseUVW, 0).r;

                    // --- 细节噪声（G 通道，需在 Compute 里写入，否则 = baseNoise）---
                    float3 detailUVW   = frac(uvw * 1.5 + detailOffset);
                    float  detailNoise = SAMPLE_TEXTURE3D_LOD(
                                            _VoluimeTex,
                                            sampler_VoluimeTex,
                                            detailUVW, 0).g;

                    // 混合：基础 + 细节侵蚀
                    float density = baseNoise - detailNoise * _DetailScale;
                    density = saturate(density) * _DensityScale;

                    if (density > 0.01)
                    {
                        float a    = exp(-density * _StepSize);
                        transmittance *= a;
                        alpha         += (1.0 - a) * transmittance;
                        finalColor    += _CloudColor.rgb * density * _StepSize * transmittance;
                    }

                    // 完全不透明，提前退出
                    if (transmittance < 0.01)
                    {
                        alpha = 1.0;
                        break;
                    }

                    ro += rd * _StepSize;
                }

                half4 col = half4(finalColor * _Brightness, saturate(alpha));
                // 应用 URP Fog
                col.rgb = MixFog(col.rgb, IN.fogFactor);
                return col;
            }
            ENDHLSL
```


## unity cloud making computer shader bridge

first I just explore how to make some volume clouds as a material through single mesh/plane as so on

the result is that doesn't look as beautiful as infite cloud

```c#
using UnityEngine;

/// 
/// 在 Start 时（或每帧）用 Compute Shader 生成 / 更新 3D 云噪声贴图。
///
/// Inspector 设置：
///   noiseCompute  —— 指向 CloudNoiseGen.compute
///   volumeTexture —— 预先在 Project 里创建的 RenderTexture
///                    Width=Height=Depth=64（或 128），
///                    Dimension=3D，Enable Random Write=true，
///                    Format 推荐 ARGB Float 或 ARGBHalf
///   animateNoise  —— 勾选后每帧重新 Dispatch，让噪声随 time 变化；
///                    不勾选则只在 Start 生成一次（性能友好）
/// 
public class CloudNoiseGenerator : MonoBehaviour
{
    [Header("References")]
    public ComputeShader noiseCompute;
    public RenderTexture volumeTexture;

    [Header("Animation")]
    [Tooltip("每帧重新生成噪声（更动态，但有 GPU 开销）。\n" +
             "若只需 Shader 层面的滚动动画，关闭此选项即可。")]
    public bool animateNoise = false;

    private int   _kernelIndex = -1;
    private int   _resolution  = 0;

    // ---- Unity 消息 ----

    void Start()
    {
        if (!Validate()) return;

        _kernelIndex = noiseCompute.FindKernel("CSMain");
        _resolution  = volumeTexture.width;

        noiseCompute.SetTexture(_kernelIndex, "Result",     volumeTexture);
        noiseCompute.SetInt    ("resolution", _resolution);

        Dispatch(0f);
        Debug.Log($"[CloudNoiseGenerator] 已生成 {_resolution}³ 噪声贴图。");
    }

    void Update()
    {
        if (!animateNoise || _kernelIndex < 0) return;
        Dispatch(Time.time);
    }

    // ---- 内部方法 ----

    /// 派发 Compute Shader，传入当前时间。
    void Dispatch(float t)
    {
        noiseCompute.SetFloat("time", t);

        int groups = Mathf.CeilToInt(_resolution / 8.0f);
        noiseCompute.Dispatch(_kernelIndex, groups, groups, groups);
    }

    /// 检查所有必要条件，出错时打印详细信息。
    bool Validate()
    {
        if (noiseCompute == null)
        {
            Debug.LogError("[CloudNoiseGenerator] 未指定 Compute Shader。", this);
            return false;
        }
        if (volumeTexture == null)
        {
            Debug.LogError("[CloudNoiseGenerator] 未指定 RenderTexture（volumeTexture）。", this);
            return false;
        }
        if (!volumeTexture.enableRandomWrite)
        {
            Debug.LogError("[CloudNoiseGenerator] RenderTexture 未开启 Enable Random Write。", this);
            return false;
        }
        if (volumeTexture.dimension != UnityEngine.Rendering.TextureDimension.Tex3D)
        {
            Debug.LogError("[CloudNoiseGenerator] RenderTexture 的 Dimension 必须设为 3D。", this);
            return false;
        }
        return true;
    }

    // ---- 公共 API ----

    /// 
    /// 可在外部调用，强制立即重新生成噪声（例如修改参数后刷新）。
    /// 
    public void ForceRegenerate()
    {
        if (_kernelIndex >= 0)
            Dispatch(Time.time);
    }
}
```

