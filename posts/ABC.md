---
title: ABX
date: 2026-03-03
tags: [其他]
head:
  - - meta
    - name: live2d
      content: tinf
  - - meta
    - name: keywords
      content: live2d
---

ABC

---

```c
Shader "CustomURP/Drawing_Paper2"
{
    Properties 
    {
        [NoScaleOffset] _MainTex2 ("Paper Texture", 2D) = "white" {}
        _PColor ("Pencil Color", Color) = (0.0, 0.371, 0.78, 1.0)
        _PColor2 ("Back Color", Color) = (1.0, 1.0, 1.0, 1.0)
        _Value1 ("Pencil Size", Range(0.0001, 0.0022)) = 0.0008
        _Value2 ("Pencil Correction", Range(0.0, 2.0)) = 0.76
        _Value3 ("Intensity", Range(0.0, 1.0)) = 1.0
        _Value4 ("Speed Animation", Range(0.0, 2.0)) = 1.0
        _Value5 ("Corner Lose", Range(0.0, 1.0)) = 0.85
        _Value6 ("Fade Paper to BackColor", Range(0.0, 1.0)) = 0.0
        _Value7 ("Fade With Original", Range(0.0, 1.0)) = 1.0
        _a("a", float) = 0.02
}
    SubShader 
    {
        Tags { "RenderType"="Opaque" "RenderPipeline" = "UniversalPipeline"}
        Pass
        {
            Name "Paper2"
            Cull Off ZWrite Off ZTest Always Blend Off

            HLSLPROGRAM
            #pragma vertex FullscreenVert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            struct Attributes
            {
                uint vertexID : SV_VertexID;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float2 uv : TEXCOORD0;
            };

            Varyings FullscreenVert(Attributes input)
            {
                Varyings output;
                output.positionCS = GetFullScreenTriangleVertexPosition(input.vertexID);
                output.uv = GetFullScreenTriangleTexCoord(input.vertexID);
                return output;
            }

            TEXTURE2D_X(_BlitTexture);
            SAMPLER(sampler_BlitTexture);
            float4 _BlitTexture_TexelSize; 

            TEXTURE2D(_MainTex2);
            SAMPLER(sampler_MainTex2);

            float4 _PColor;
            float4 _PColor2;
            float _Value1;
            float _Value2;
            float _Value3;
            float _Value4;
            float _Value5;
            float _Value6;
            float _Value7;
            float _a;

            float4 frag(Varyings i) : SV_Target
            {
                float2 uv = i.uv;
                
                // 处理UV翻转问题
                #if UNITY_UV_STARTS_AT_TOP
                if (_BlitTexture_TexelSize.y < 0)
                    uv.y = 1.0 - uv.y;
                #endif

                float4 f = SAMPLE_TEXTURE2D_X(_BlitTexture, sampler_BlitTexture, i.uv);
                float3 paper = SAMPLE_TEXTURE2D(_MainTex2, sampler_MainTex2, uv).rgb;
                float ce = 1.0;
                float4 tex1[4];
                float4 tex2[4]; 
                float tex = _Value1;
                float tt = _Time.y * _Value4;
                float s = floor(sin(tt * 10.0) * _a) / 12.0;
                float c = floor(cos(tt * 10.0) * _a) / 12.0;
                float pg = 1.0 - paper.g;
                float2 dist = float2(c + paper.b * 0.02, s + paper.b * 0.02);
                
                float3 paper2 = SAMPLE_TEXTURE2D(_MainTex2, sampler_MainTex2, uv + dist).rgb;
                
                tex2[0] = SAMPLE_TEXTURE2D_X(_BlitTexture, sampler_BlitTexture, i.uv + float2(tex, 0) + dist / 128.0);
                tex2[1] = SAMPLE_TEXTURE2D_X(_BlitTexture, sampler_BlitTexture, i.uv + float2(-tex, 0) + dist / 128.0);
                tex2[2] = SAMPLE_TEXTURE2D_X(_BlitTexture, sampler_BlitTexture, i.uv + float2(0, tex) + dist / 128.0);
                tex2[3] = SAMPLE_TEXTURE2D_X(_BlitTexture, sampler_BlitTexture, i.uv + float2(0, -tex) + dist / 128.0);

                for(int j = 0; j < 4; j++) 
                {
                    tex1[j] = saturate(1.0 - distance(tex2[j].r, f.r));
                    tex1[j] *= saturate(1.0 - distance(tex2[j].g, f.g));
                    tex1[j] *= saturate(1.0 - distance(tex2[j].b, f.b));
                    tex1[j] = pow(tex1[j], _Value2 * 25.0);
                    ce *= dot(tex1[j], 1.0);
                }

                ce = saturate(ce);
                float l = 1.0 - ce;
                float3 ax = float3(l, l, l); 
                ax *= paper2.b;
                ax = lerp(float3(0.0, 0.0, 0.0), ax * _Value3 * 1.5, 1.0);
                float gg = lerp(1.0 - paper.g, 0.0, 1.0 - _Value5);
                ax = lerp(ax, float3(0.0, 0.0, 0.0), gg);

                float origLuma = dot(f.rgb, float3(0.2126, 0.7152, 0.0722));
                float darkShading = saturate(1.0 - origLuma);
                ax = saturate(ax + darkShading * 0.8);
                
                paper = lerp(float3(paper.r, paper.r, paper.r), _PColor2.rgb, _Value6); 
                paper = lerp(paper, _PColor.rgb, ax * _Value3);
                paper -= pg * 0.5;
                paper = lerp(f.rgb, paper, _Value7);
                
                return float4(paper, 1.0);
            }
            ENDHLSL
        }
    }
}
```