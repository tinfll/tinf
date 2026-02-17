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

莫名shader语法不一样，shadertoy
和the book of shader里面不一样。只能提取思想来看了吗。？
。。。一搜还搜到了d3d的compute shader教程和vulkan的compute shader教程。

尝试读vulkan的图(?)中间有一堆Tessellation的东西
uniform 貌似是定义全局的某些方案之类。
dispatch -> compute shader.然后它说compute shader并不在管线里面


然后D3D花了图视图让我理解SV_DispatchThreadID
。主要一篇资料三言两语讲不完看不懂回去看别的然后越看越深越看越偏。然后只能走马观花地看看。

..??
// 后处理：使用双曲正切函数进行亮度压缩（Tonemapping）和对比度增强
    o = tanh(o * o);
    
    fragColor = o;
..背书？？

unityshader大概分三部分等。


这个效果不错，可以改成钢琴
float alpha = sin(_Time.y * _Speed + (i.uv.y * _Offset));
                // sample the texture

                float isBlock = alpha;
                fixed4 col = _BaseColor;
                col.a = isBlock;//float isBlock = step(0.8, alpha);(纸片)
                return col;
                
float uv = i.uv.y * _Tilling; 一条带子
(uv调整前)
float isBlock = step(_Threshold,1, alpha);色块流动，此时这些值要调的很小很小才行。
s 1
d 0.1
off 10
th 20

(uv调整后)
。相同参数y值神奇效果。。。
float dist = length(i.uv) - _r;
                float alpha = smoothstep(fwidth(dist), -fwidth(dist), dist);
画圆，抗锯齿

尝试有向距离场画雪花但是没看懂只能出花瓣
float snow(float2 uv, float size)
            {
                const float k = 0.5773550269;
                uv = abs(uv);

                uv -= 2.0 * min(dot(uv, float2(-k, 1.0)), 0.0) * float2(-k, 1.0);
                uv.x -= size; 
                float scale = 1.0;
                float2 n = float2(-0.8660254, 0.5);
 
                for(int i = 0; i < 1; i++)
                {
                    uv -= 2.0 * min(dot(uv, n), 0.0) * n;
                    
                }
                return length(uv) / scale;
            }
           float4 frag(v_out i) : SV_Target
            {
                i.uv = i.uv * 2.0 - 1.0;
                float dist = length(i.uv) - _r;
                float alpha = smoothstep(fwidth(dist), -fwidth(dist), dist);
                float d = 1 - snow(i.uv, _r);
                float glow = 0.1 / abs(d);

                float3 color = _BaseColor * glow + smoothstep(0.01, 0.0, d); 
                return float4(color, 1- smoothstep(fwidth(d), -fwidth(d), d));
            }


toon shader
PASS1- The Outline Extrusion(?。fwidth?。)
float3 normalWS = TransformObjectToWorldNormal(IN.normalOS);
float3 positionWS = TransformObjectToWorld(IN.positionOS.xyz);
posWS += normalWS * _OutlineThickness;


Toon Lighting + Edge Detection
float NdotL = saturate(dot(IN.normalWS, normal))

float NdotL = saturate(dot(IN.normalWS, normalize(mainLight.direction)));
float toonStep = step(0.5, NdotL);

Edge Detection
float edgeFactor = 1.0 - abs(dot(IN.normalWS, normalize((IN.viewDirWS))));
