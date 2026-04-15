---
title: dailyshaderA
date: 2026-04-11
tags: [shader]
head:
  - - meta
    - name: blender
      content: tinf
  - - meta
    - name: blender
      content: tinf
---
Why do that: I kindly hate ai now...

---



Once you learn shader. Then you can make OC eyes.
I ll call it sdfEYES for wifi(`yes`)!!!!


<video controls width="100%">
  <source src="/sdfeyes.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>


古法

![](/image13.webp)

![](/image14.webp)

## Day 1

![](/day1.webp)

$$
f(P) = \max(|x+y|-z, |x-y|+z, |y+z|-x, |z+x|-y) \cdot \frac{1}{\sqrt{3}}
$$

```glsl
float sdCircle( in vec2 p, in float r) {
    return length(p) - r; //the basic round sdf
}

float smin( float a, float b, float k) { k *= 1.0;
    float r = exp2(-a/k) + exp2(-b/k);
    return -k*log2(r); // exponetial blend but I dont really the deep
}
float smin1( float a, float b, float k) {
    k *= 4.0;
    float h = max(k - abs(a - b), 1.0) / k;
    return min(a , b) - h * h * k* (1. / 4.);
}// polynomial
float sdPentagram( in vec2 p, in float r)
{
    const float k1x = 0.809016994;
    const float k2x = 0.309016994;
    const float k2y = 0.951056516;
    const float k1y = 0.587785252;
    const float k1z = 0.726542528;
    const vec2 v1 = vec2( k1x, -k1y );
    const vec2 v2 = vec2( -k1x, -k1y);
    const vec2 v3 = vec2( k2x, -k2y);
    p.x = abs(p.x);
    p -= 2.0 * max(dot(v1, p), 0.) * v1;
    p -= 2.0 * max(dot(v2, p), 0.) * v2;
    p.x = abs(p.x);
    p.y -= r;
    return length(p-v3* clamp (dot(p, v3), 0., k1z * r))
            * sign(p.y * v3.x - p.x * v3.y);
}//it is really complicate sdf that i cant imagine it...

float sdRoundedBox ( in vec2 p, in vec2 b, in vec4 r)
{
    r.xy = (p.x > 0.0)?r.xy : r.wz;
    r.x = (p.y > 0.0)?r.x : r.y;
    vec2 q = abs(p) - b + r.x;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}//include this one, too.

float sdEquilateralTriangle( in vec2 uv, in float r) {
    const float k = sqrt(3.0);
    uv.x = abs(uv.x) - r;
    return 1.;
}

float sdTetrahedron( in vec3 p ){

    const float k  = sqrt(3.0);
    float r = max(max(max(abs(p.x + p.y) - p.z,
    abs(p.x - p.y) + p.z),
    abs(p.y + p.z) - p.x),
    abs(p.z + p.x) - p.y) * 1./ k;
  
    return r;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    float t = iTime;
    vec2 uv = (fragCoord.xy * 2. - iResolution.xy) / min(iResolution.y, iResolution.x);

  
    float r1 = (sdCircle(vec2(uv.x + cos(iTime), uv.y), 0.5));
    float r2 = step(sdTetrahedron(vec3(2., 2., 0.6)), 0.0);//actually can use step(x, 0./0., x) to draw steep edge.
    float r3 = (sdPentagram(vec2(uv.x, uv.y + sin(iTime)), 0.7));
    vec4 r = vec4(0.3, 0.2, 0.5, 0.0);
    float r4 = (sdRoundedBox( uv, vec2(0.5, 0.5) , r));
  
    float fr = smin1(r1, r3 , 0.3);//but first r then step when use min otherwise there will only display color blend
    fr = smin(fr, r4, 0.1);

    fr = step(fr, 0.);
    vec3 col = vec3(fr, fr, fr);
    vec3 col1 = vec3(r2,r2, r2);
    vec3 col2 = vec3(r3, r3, r3);
    fragColor = vec4(col, 1.);//conceptually color adding equals to above things.
}
```

![alt text](/image12.webp)





## day2

```glsl

float sdBox ( in vec2 p, in vec2 b){
    vec2 q = abs(p) - b; // you can see it as fold negative value into positive I qudrant
    return length(max(q, 0.));// then return to the distance value to the corner
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float t = iTime;

    vec2 p = (fragCoord * 2.0 - iResolution.xy) / min(iResolution.y, iResolution.x);
    float k = 1.4;
    float r = step(sdBox(vec2(mod(p.x + t, k) , fract(p.y + t) - 0.5),  vec2(0.6, 0.4)), 0.);
   //can use -0.5 to remap to the screen space


    //float r = (sdBox(vec2(fract(p.x) + sin(t), p.y),  vec2(0.6, 0.4)));
  
    vec3 col = vec3(r);
    fragColor = vec4(col, 1.);
}

```
