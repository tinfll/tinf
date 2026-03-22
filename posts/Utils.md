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

some utils

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

```py
import bpy
import os

class ExportUnityFBX(bpy.types.Operator):
    bl_idname = "export.unity_fbx_auto"
    bl_label = "Export Unity FBX"
    bl_description = "一键导出当前文件为 Unity 标准 FBX"

    def execute(self, context):
        # 获取当前 blend 文件路径
        blend_filepath = bpy.data.filepath
        if not blend_filepath:
            self.report({'WARNING'}, "请先保存 .blend 文件！")
            return {'CANCELLED'}

        # 自动在同目录生成同名 fbx
        export_dir = os.path.dirname(blend_filepath)
        blend_name = os.path.basename(blend_filepath)
        fbx_name = os.path.splitext(blend_name)[0] + ".fbx"
        out_path = os.path.join(export_dir, fbx_name)

        # 核心导出 API，完全复用你贴出的 Unity 默认转换参数
        bpy.ops.export_scene.fbx(
            filepath=out_path,
            check_existing=False,
            use_selection=False,  # 注意：这里是导出全场景
            use_active_collection=False,
            object_types={'ARMATURE', 'CAMERA', 'LIGHT', 'MESH', 'OTHER', 'EMPTY'},
            use_mesh_modifiers=True,
            mesh_smooth_type='OFF',
            use_custom_props=True,
            bake_anim_use_nla_strips=True,
            bake_anim_use_all_actions=True,
            apply_scale_options='FBX_SCALE_ALL',
            axis_forward='-Z',
            axis_up='Y'
        )

        self.report({'INFO'}, f"成功导出 FBX 到: {out_path}")
        return {'FINISHED'}

class VIEW3D_PT_TA_ExportPanel(bpy.types.Panel):
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "TA Tools"
    bl_label = "Unity 工作流同步"

    def draw(self, context):
        layout = self.layout
        layout.operator("export.unity_fbx_auto", text="一键导出同名 FBX", icon='EXPORT')

def register():
    bpy.utils.register_class(ExportUnityFBX)
    bpy.utils.register_class(VIEW3D_PT_TA_ExportPanel)

def unregister():
    bpy.utils.unregister_class(ExportUnityFBX)
    bpy.utils.unregister_class(VIEW3D_PT_TA_ExportPanel)

if __name__ == "__main__":
    register()
```