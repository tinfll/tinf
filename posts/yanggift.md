---
title: Gift103
date: 2025-12-28
tags: [ethers]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

---

首页部分：
（1）选择对应txt用户进入该用户通讯录（界面A）
（2）比较功能(选择两个通讯录)点击进入界面C
（3）退出系统

界面A部分：
(1)联系人有头像（暂且用大写字母符合代替）和名称。点击每个联系人后跳转到对应界面B
(2)首页查询：也有按姓名.城市.标签分别查询组合联系人信息，查询没有满足要求的联系人则输出提示，分析功能中不同标签联系人数量在这里统计
(3)增加功能：还有右上角加号的增加联系人功能，增加模版如txt文件所示，增加不符合要求则无法继续。增加完后即保存
(4)批量删除功能
(5)保存操作功能到txt如文件所述

界面B部分：
联系人信息

界面C部分：
(1)查找功能：共同联系人，输出共同联系人列表。
(2)从性能角度出发计算一个用户与另一个用户社交关联度功能：可能后期会加入打字机等前端特效
算法计算机制如文件所示

魔改程序设计结课大作业，


整理下目前想要实现的：
图片bayer抖动的黑白调参，接入图片查看器的地址api方便查看
或者自己自定义设置那个图片前后对比的那个我看ue5文档里面用的就是那个，webgl闪烁时刻....
图片查看器这个功能就涉及很多很多东西了都



接入3d查看器api，就是我之前给她oc建了一个fbx格式的模可以暂时把它在上面显示出来，3d查看器需要用一些类似shadertoy里面接入键鼠操作的东西。


这上面还只是要实现的功能，具体性能分析那一块我都没说了（你就天天给自己画性能分析的大饼。
对应该留个心眼，比如ai写的bayer抖动内存是17mb，速度挺快，只是从现在开始逐渐培养性能分析的意识罢了。。

然后了解简单的渲染管线，写shader等等的oc实现，

写到这里突然想接imgui库等等做...等下！！如果让我这个程序作为画画软件有些太离谱了,,,我到底是在做游戏还是在做别的东西，，，?,,,之后如游戏行业应该去做游戏而不是去做画画软件吧哥们））））

我再想想怎么办，我应该会先去了解渲染管线的一系列东西


模型数据
     ↓
[顶点输入] ← 你的.obj文件
     ↓
[顶点着色器] ← 处理每个顶点（位置、变换）
     ↓
[图元装配] ← 组装成三角形
     ↓
[几何着色器] ← （可选）生成更多图元
     ↓
[光栅化] ← 三角形→像素
     ↓
[片段着色器] ← 计算每个像素的颜色
     ↓
[颜色混合] ← 混合透明、深度测试
     ↓
屏幕上的图像！🎉

```cpp
// Vulkan需要你明确创建每个阶段：
VkGraphicsPipelineCreateInfo pipelineInfo{};
pipelineInfo.stageCount = 2;

// 1. 顶点着色器阶段
VkPipelineShaderStageCreateInfo vertShaderStageInfo{};
vertShaderStageInfo.stage = VK_SHADER_STAGE_VERTEX_BIT;
vertShaderStageInfo.module = vertShaderModule;  // 编译好的着色器
vertShaderStageInfo.pName = "main";

// 2. 片段着色器阶段  
VkPipelineShaderStageCreateInfo fragShaderStageInfo{};
fragShaderStageInfo.stage = VK_SHADER_STAGE_FRAGMENT_BIT;
fragShaderStageInfo.module = fragShaderModule;
fragShaderStageInfo.pName = "main";

VkPipelineShaderStageCreateInfo shaderStages[] = {vertShaderStageInfo, fragShaderStageInfo};

// 3. 顶点输入描述
VkPipelineVertexInputStateCreateInfo vertexInputInfo{};
vertexInputInfo.vertexBindingDescriptionCount = 1;
vertexInputInfo.pVertexBindingDescriptions = &bindingDescription;  // 如何读取顶点
vertexInputInfo.vertexAttributeDescriptionCount = 2;
vertexInputInfo.pVertexAttributeDescriptions = attributeDescriptions;  // 位置、法线

// 4. 输入装配
VkPipelineInputAssemblyStateCreateInfo inputAssembly{};
inputAssembly.topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;  // 三角形列表
inputAssembly.primitiveRestartEnable = VK_FALSE;

// 5. 视口和裁剪
VkPipelineViewportStateCreateInfo viewportState{};
viewportState.viewportCount = 1;
viewportState.scissorCount = 1;

// 6. 光栅化器
VkPipelineRasterizationStateCreateInfo rasterizer{};
rasterizer.polygonMode = VK_POLYGON_MODE_FILL;  // 填充模式
rasterizer.lineWidth = 1.0f;
rasterizer.cullMode = VK_CULL_MODE_BACK_BIT;  // 背面剔除
rasterizer.frontFace = VK_FRONT_FACE_COUNTER_CLOCKWISE;

// 7. 多重采样
VkPipelineMultisampleStateCreateInfo multisampling{};

// 8. 颜色混合
VkPipelineColorBlendStateCreateInfo colorBlending{};

// 9. 深度测试
VkPipelineDepthStencilStateCreateInfo depthStencil{};

// 10. 动态状态
VkPipelineDynamicStateCreateInfo dynamicState{};

// 最后创建整个管线！
vkCreateGraphicsPipelines(device, VK_NULL_HANDLE, 1, &pipelineInfo, nullptr, &graphicsPipeline);

```