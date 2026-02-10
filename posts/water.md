---
title: water
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

关于各种各样水面制作的思考

---


[unitysurfaceshader](https://learn.unity.com/tutorial/creating-a-surface-shader)

[gerstner-waves]https://www.cambridge.org/core/journals/journal-of-fluid-mechanics/article/gerstner-waves-in-the-presence-of-mean-currents-and-rotation/D1637DFDCF881149488A8A9162C509E3

[Trochoidal wave](https://en.wikipedia.org/wiki/Trochoidal_wave)

[volumeRenderingTechiniques]https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-39-volume-rendering-techniques



光照模型: 
N:normal
L:lightDir

漫反射：lambert's cosine law:光通量密度与入射角的余弦成正比
diffuse = Kd · max(0, N·L)

```c
half3 LightingLambert(half3 lightColor, half3 lightDir, half3 normal)
{
    half NdotL = saturate(dot(normal, lightDir));
    return lightColor * NdotL;
}


half3 LightingSpecular(half3 lightColor, half3 lightDir, half3 normal, half3 viewDir, half4 specular, half smoothness)
{
    float3 halfVec = SafeNormalize(float3(lightDir) + float3(viewDir));
    half NdotH = half(saturate(dot(normal, halfVec)));
    half modifier = pow(float(NdotH), float(smoothness)); 
    float3 specularReflection = specular.rgb * modifier;
    return lightColor * specularReflection;
}
```

float (32-bit FP32)：精度：高（约 7 位十进制有效数字）。范围：极大。用途：位置 (Position)、深度 (Depth)、纹理坐标 (UV)。如果不使用 float，波浪计算、顶点变换会出现“抖动”或“锯齿”。half (16-bit FP16)：精度：低（约 3 位十进制有效数字，范围 $\pm 65504$）。用途：颜色 (Color)、法线 (Normal)、光照方向 (Direction)。

高光: Specular(Blinn-Phone)
Specular = Ks · pow(max(0, N·H),α)

H = normalize(L+V),如果法线N指向H，说明光线刚好被反射到眼睛。α，光泽度
$$FinalColor = (Ambient + (Diffuse + Specular) \times ShadowAttenuation) \times LightColor$$

重新计算法线


```c
half3 LightingPhysicallyBased(BRDFData brdfData, BRDFData brdfDataClearCoat,
    half3 lightColor, half3 lightDirectionWS, float lightAttenuation,
    half3 normalWS, half3 viewDirectionWS,
    half clearCoatMask, bool specularHighlightsOff)


float k = _WaveF;               // 波数 (k)
    float w = _WaveSpeed;           // 角速度 (w)
    float A = _WaveHeight;          // 振幅 (A)
    float t = _Time.y;

    float phase = pos.x * k + t * w;

    float wave = sin(phase) * A;
    pos.y += wave;
```


裙子(√)

```c
    Shader "Custom/Waves_Fixed"
{
    Properties
    {
        _BaseColor ("Main Color", Color) = (1, 1, 1, 1)
        _SpecColor ("Specular Color", Color) = (1, 1, 1, 1)
        _Gloss ("Glossiness", Float) = 32.0


        _WaveSpeed ("Speed", Float) = 2.0
        _WaveF ("Frequency", Float) = 1.0
        _WaveHeight ("Height", Float) = 0.5
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" "RenderPipeline" = "UniversalPipeline"}
 
        Tags { "LightMode" = "UniversalForward" }

        
       Pass
       {
            HLSLPROGRAM
       
            #pragma vertex vert
            #pragma fragment frag

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _BaseColor;
                float4 _SpecColor;
                float _Gloss;
                float _WaveSpeed;
                float _WaveF;
                float _WaveLength;
                float _WaveHeight;
            CBUFFER_END

            struct Attributes
            {
                float4 vertex : POSITION; 
                float3 normal : NORMAL;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 positionWS : TEXCOORD0;
                float3 normalWS : TEXCOORD1;
            };


            Varyings vert(Attributes input)
            {
                Varyings output;
                float3 pos = input.vertex.xyz;

                float phase = (pos.x * _WaveF - _Time.y * _WaveSpeed);
                float T = 1/_WaveF;
                float3 tangent = normalize(float3(1 - _WaveHeight * _WaveF * sin(phase), _WaveHeight * _WaveF * cos(phase), 0));
                                                
                float wave = sin(phase) * _WaveHeight;          
                pos.x += _WaveHeight * cos(phase);
                pos.y += wave;
                

                output.positionWS = TransformObjectToWorld(pos);
                output.positionCS = TransformObjectToHClip(pos);
                
                float3 newnormalOS = float3(-tangent.y, tangent.x, 0);
                output.normalWS = TransformObjectToWorldNormal(newnormalOS);
                return output;
            }

            half4 frag(Varyings input) : SV_Target
            {   

                float3 N = normalize(input.normalWS);
                
                float3 V = normalize(GetCameraPositionWS() - input.positionWS);
                
               
                Light mainLight = GetMainLight();
                float3 L = normalize(mainLight.direction);
                float3 lightColor = mainLight.color;

                half3 diffuseTerm = saturate(dot(N,L));
                //Ks?
                //=LightingLambert(lightColor, L, N);
                float3 H = normalize(L + V);
                half NdotH = saturate(max(0,dot(N,H)));
                half3 specularTerm = pow(NdotH , _Gloss);
                //half3 specularTerm = 0;+ specularColor

                float3 diffuseColor = lightColor * diffuseTerm;
                //float3 diffuseColor = LightingLambert(lightColor, L, N);
                float3 specularColor = _SpecColor.rgb * lightColor * specularTerm;
                //float specularColor = LightingSpecular(lightColor, L, N, V, _SpecColor, _Gloss);

                half3 finalColor = _BaseColor.rgb * diffuseColor + specularColor;
                return half4(finalColor, 1);
            }
            ENDHLSL
            }
        }
    }
```

Q \times k \times A \le 1$
A (Amplitude): 圆的半径（浪有多高）。k (Frequency): 波有多密（单位距离内有多少个波）。$Q$ (Steepness): 控制这个点往浪尖聚集的程度。



水。
雨水坐牢看unityshadergraph
采样 
float4:road tint
clean diffuse 贴图
clean normal 贴图
damaged diffuse 贴图
damage normal 贴图
water ripple normal贴图

float:
clean tilling
damage tilling
Wetness tilling

滑条的float
Wetness
Wetness smoothing
vector1
ripple tilling
ripple speed


damage tilling: tilling(2) + uv(0)(作为uv2接口) offset(x(0) y(0)) out
此out作为下一个tilling and offest的uv， tilling(x(12), y(12)) offset(x(0) y(0)) out作为floor 输出到random range里，min0 max1 out乘1(?不如不乘) 输出contrast 节点的in(3)然后contrast连3 输出到color mask的range里，color mask in3为(0,0,0) mask color3节点为黑色，fuzziness为0，输出out(float4)到blend节点opacity，同时也乘上(0,0,1,0)到节点blend的blend3，这个blend节点的base则是最开始damage tilling: tilling(2) + uv(0)(作为uv2接口) offset(x(0) y(0)) out连接checkboard节点的uv2(colorA和colorB分别是红色和绿色， frequency是x(6),y(6))。然后blend out出来split GR通道分别作为arctangent2通道的AB out到rotate的totation节点上，rotate的uv接地点是最开始damage tilling: tilling(2) + uv(0)(作为uv2接口) offset(x(0) y(0)) out mutiply了float(4)再fraction，roate的center节点则是(0.,0.5) unlit是radians，out结果分别去作为Damage Normal Clean Normal贴图的采样以及是作为uv和damaged diffuse 贴图的R通道作为blendb a通道作为blend节点的opacity，blenda是clend diffuse采样的RGBA4通道(也是通过clenatilling的till and offset处理) 这个blend 的out结果作为1个blend，另一个blend是一对噪点处理，如下


我感觉前面完全就在处理uv部分

wetness:multiply 2 
wetness:tilling simple noise 
以上两out power out连到contrast的in，contrast输入一个wetness smoothning out结果到clamp的in，min是(9,0,0,0),max是(1,1,1),这是噪点处理的结果

这个噪点处理的结果一是用在前面的blend里面 opacity是0.35，结果和road tint的颜色mutiply 处理完终于是片元的基础色了。。
二是 在clean normal以及damage normal的RGBA进行blend后(opacity依旧是前面damage diffuse的a通道)连到normal strength的input strength是之前那种噪点处理结果成常量 之后连到一个normal blend的A上
三是invertcolor一是直接作为片元的smoothness和二是处理涟漪的一部分进行配合
涟漪部分是:time和ripple speed相乘 然后out结果作为offset ripple tilling作为tilling UV0作为UV out结果作为water ripple normal纹理采样的uv rgba结果连到normal strength的in上 vector1作为strength out在进行normal strength的input，这里strength就是连之前invertcolor的部分，这里增强的out就是normal blend的B 这么复杂混合完结果是片元的法线

wetness smoothing
Vector1
water Ripple Normal
ripple tilling
ripple speed

Vector1(1)?

void Unity_TilingAndOffset_float(float2 UV, float2 Tiling, float2 Offset, out float2 Out)
{
Out = UV * Tiling + Offset;
}

void Unity_Contrast_float(float3 In, float Contrast, out float3 Out)
{
    float midpoint = pow(0.5, 2.2);
    Out = (In - midpoint) * Contrast + midpoint;
}