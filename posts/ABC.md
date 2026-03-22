---
title: ABC
date: 2026-03-03
tags: [Indie game]
head:
  - - meta
    - name: live2d
      content: tinf
  - - meta
    - name: keywords
      content: live2d
---

ABC
This page is documenting some develop process about ABC(yet dont have name:)

---



$$f(P) = \max(|x+y|-z, |x-y|+z, |y+z|-x, |z+x|-y) \cdot \frac{1}{\sqrt{3}}$$



So i want to share the render plan in my indie game....(thinking...even though i dont regard it as a 'indie game')

basically naninovel and urp2D, but I take the 3D asset(character from Vroid then blender to handle further)

and so there is still some performance trick about various useing methods of render texture...etc(please ignore my poor language skill...)

# style

pencil / draft(learn frome camerapackage)

```c

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
    // the texture.r is base texture
    //  .g is mask(...dont like this much, can custom)
    //  **.b** is motion controller
    
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
    ax *= paper2.b; // can stimulate the motion through b
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
    
    //still could add some sigmodal to increase the contrast
    return float4(paper, 1.0);
```