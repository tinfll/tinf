---
title: uTILS
date: 2026-02-03
tags: [Utils]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

一些常用工具脚本存

---

纹理

```py
import bpy
import os

def save_textures_to_unity():
    # 目标路径
    target_dir = r"C:\Users\tinf\Documents\UnityProject\urpExperiment\Assets\blend\\"
    
    # 如果文件夹不存在则创建
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        print(f"创建目录: {target_dir}")

    print("开始导出纹理...")
    
    for img in bpy.data.images:
        # 排除 Blender 内置的渲染结果和生成图（如 Viewer Node 或 Generated 贴图）
        if img.type not in {'IMAGE', 'MULTILAYER'}:
            continue
            
        if not img.packed_file and img.filepath == "":
            continue

        # 获取文件名
        filename = bpy.path.basename(img.filepath)
        if not filename:
            # 如果是刚打包进来的或者没保存过的，给个默认名
            filename = f"{img.name}.png"
            
        save_path = os.path.join(target_dir, filename)
        
        try:
            # 这里的关键是：如果贴图被 packed 在 blend 文件里，
            # 需要先解压或者直接通过 save_render 另存为
            # 这里采用直接保存图像数据的方法
            img.save_render(save_path)
            print(f"已导出: {filename} -> {target_dir}")
        except Exception as e:
            print(f"无法导出 {img.name}: {e}")

    print("导出任务完成。")

if __name__ == "__main__":
    save_textures_to_unity()
```