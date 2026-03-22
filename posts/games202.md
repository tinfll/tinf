---
title: Games202
date: 2026-01-17
tags: [CG]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

Games202学习过程

---

this.material.uniforms[k].type == 'texture'


const PhongFragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D uSampler;
//binn
uniform vec3 uKd;
uniform vec3 uKs;
uniform vec3 uLightPos;
uniform vec3 uCameraPos;
uniform float uLightIntensity;
uniform int uTextureSample;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;

void main(void) {
vec3 color;
if (uTextureSample == 1) {
color = pow(texture2D(uSampler , vTextureCoord).rgb, vec3(2.2));
} else {
color = uKd;
}

vec3 ambient = 0.05 * color;

vec3 lightDir = normalize(uLightPos - vFragPos);
vec3 normal = normalize(vNormal);
float diff = max(dot(lightDir , normal), 0.0);
float light_atten_coff = uLightIntensity / length(uLightPos - vFragPos);
vec3 diffuse = diff * light_atten_coff * color;

vec3 viewDir = normalize(uCameraPos - vFragPos);
float spec = 0.0;
vec3 reflectDir = reflect(-lightDir , normal);
spec = pow (max(dot(viewDir , reflectDir), 0.0), 35.0);
vec3 specular = uKs * light_atten_coff * spec;

gl_FragColor = vec4(pow((ambient + diffuse + specular), vec3(1.0/2.2)), 1.0);
}
`;


。继续锄大地。

point light
shadow mapping

a2-pass algorithm 纹理 放到pass里面去用
？？？
第一遍 shadowmap 从light出发看到最近的深度/存为一张深度图
第二遍  从viewp出发是否能被light照到(和之前zbuffer比较)。
要么用zbuffer比或实际比(。实际转换不麻烦。？)

数值精度纹路像辉夜姬舞台。。。
image-space (不需要知道几何 只需要知道shadowmap)
自遮挡/锯齿:。？？？？这啥。没听懂。？
bias reduce occlusion
detached shadow(工业界。？)
存第二小深度。更没听懂

(锯齿)走样问题 testcaded？动态分辨率shadowmap

想到之后想做的场景
varient shadowmapping
converlution shadowmapping(cast？)
(。顶级空耳。)

shadowmapping算法

visible shading没听懂
。其实我本来对自己积分还挺自信的。。
记一下吧，point/directional lighting
diffuse bsdf/constant radiance area lighting是准确的
glossiness不好(。记得之前写blinnphong高光用过这个粗糙度？)

环境光遮蔽

from hard shadows to soft shadows
所以hard shadows是丢给美术处理卡渲或者step判断shader吗。？
(percentage closer filtering)(pcf)

神奇的平均所做阴影的比较的真假值来做filter(神奇……)
算！

回头是打算给怜那个场景做这个软阴影的。嗯。
。。。？？逻辑貌似和我相反？🈚我觉得硬阴影是软阴影的极端化处理？(step等？)算了正反逻辑都一样。

软硬阴影类似美术效果……哎不是吗？(印象中卡渲是绘制sdf贴图来着做形状叠加)
等还有球面阴影这
percentage closer soft shadow
blocker search
。。听的时候开始走神于是。。。于是相似三角形那边w不知道。。？
shadingpoint如何取？
怎么说呢听起来有点像绕口令了……虽然刚开始听的理论很简单，但是重复回环就会奇怪
应该还是逻辑问题 pcf做pcss即是block和search处理。
penumabra estimation

percentage closer filter
(虽然我感觉对于光照理解好了很多(是的！！)

多光源？

。。好无聊，锄大地内容。
什百人计划里面也有阴影这两个有关联吗什么实时阴影。