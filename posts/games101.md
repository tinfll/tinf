---
title: Games101
date: 2025-10-25
tags: [games101, c++, 图形学]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

Games101学习过程

---
# games101(1) -- 透视投影矩阵
## 2025-10-25
齐次坐标系不是笛卡尔坐标系
相机移动到原点，求逆简单，再求逆。

正交投影: 扔掉z然后压缩到-1，1，但是这不要考虑缩放？(就是缩放)
正式canonical: 范围，中心移到原点上，缩放

透视投影: 先将远平面挤压，再正交投影过去
挤压用比例坐标，第四列w坐标需要为z((1001)=(2002)及同乘相同点坐标)
(一些规定: 近处点不变，z值不变，远平面中心点不变)，
利用以上
z值不变 可换

联立以下两个:
近处点坐标不变
中心点不变
可以解出nf，
缩矩阵完成完毕，

有时候规定能解决很多东西
。。。话说你写起来还真简单啊。。。然后md什么也还都没用。。。我且再看吧。。。

```cpp
Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();

    Eigen::Matrix4f M_p2o;
M_p2o << zNear, 0, 0, 0,
         0, zNear, 0, 0,
         0, 0, zNear + zFar, zNear * zFar,
	     0, 0, -1, 0;

Eigen::Matrix4f M_trans;
M_trans << 1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, (zNear + zFar) / 2,
	       0, 0, 0, 1;
Eigen::Matrix4f M_scale;
M_scale << 1 / (zNear * std::tan(eye_fov/2) * aspect_ratio), 0, 0, 0,
           0,  1 / (zNear * std::tan(eye_fov/2)), 0, 0,
           0, 0, 2 / (zNear - zFar), 0,
	0, 0, 0, 1;

projection = M_scale * M_trans * M_p2o;
```
好，弄出来cpp了...
我也在想要不要手推熟矩阵这样...发现即使是没有应试要求也会不由自主把记着？一些小镇做题家的习惯。
然后自己尝试录个视频发现一些简单的话都讲不清楚...乐。
宿舍只剩我一个了，非常好
后来发现作业给的透视情形和正交情形，透视给的参数是frostom一系列，正交会具体到r,l,t,b,z,f面的参数，课上是根据后者写的变换方程，然后在这里需要空间想下fov等表述。


# 光栅化
## 2025-10-26
我应该把这个MVP过程串起来（思忖，但我怎么有种莫名
光栅化后面给的z,w公式用于用重心插值修正投影过去的偏差，就和第一课遗留问题一样，中间的点经过透视投影矩阵（前一个阶段，不对，还是整个过程..?）后前进还是后退的问题，因为[（z+f）z-nf]/z算出来只与1/z呈线性相关，所以需要引入w...

引入w...修正？...救命啊这一块还说不清楚。。。
```cpp
void rst::rasterizer::rasterize_triangle(const Triangle& t) {
    auto v = t.toVector4();


    float x_min = std::min({ t.v[0].x(), t.v[1].x(), t.v[2].x() });
    float x_max = std::max({ t.v[0].x(), t.v[1].x(), t.v[2].x() });
    float y_min = std::min({ t.v[0].y(), t.v[1].y(), t.v[2].y() });
    float y_max = std::max({ t.v[0].y(), t.v[1].y(), t.v[2].y() });

    int x_start = std::max(0, (int)std::floor(x_min));
    int y_start = std::max(0, (int)std::floor(y_min));

    int x_end = std::min(this->width - 1, (int)std::ceil(x_max));
    int y_end = std::min(this->height - 1, (int)std::ceil(y_max));

    for(int i = x_start; i <= x_end ; i++)
        for (int j = y_start; j <= y_end; j++) {
            auto[alpha, beta, gamma] = computeBarycentric2D(i + 0.5f, j + 0.5f, t.v);

            if (insideTriangle(i + 0.5, j + 0.5, t.v)) {
                float w_reciprocal = 1.0/(alpha / v[0].w() + beta / v[1].w() + gamma / v[2].w());
                float z_interpolated = alpha * v[0].z() / v[0].w() + beta * v[1].z() / v[1].w() + gamma * v[2].z() / v[2].w();
                z_interpolated *= w_reciprocal;
                int index = get_index(i, j);
                if (z_interpolated < depth_buf[index]) {
                    depth_buf[index] = z_interpolated;
                    set_pixel(Eigen::Vector3f(i, j, z_interpolated), t.getColor());
                }
			}
        }

    // TODO : Find out the bounding box of current triangle.
    // iterate through the pixel and find if the current pixel is inside the triangle

    // If so, use the following code to get the interpolated z value.
    //auto[alpha, beta, gamma] = computeBarycentric2D(x, y, t.v);
    //float w_reciprocal = 1.0/(alpha / v[0].w() + beta / v[1].w() + gamma / v[2].w());
    //float z_interpolated = alpha * v[0].z() / v[0].w() + beta * v[1].z() / v[1].w() + gamma * v[2].z() / v[2].w();
        //z_interpolated *= w_reciprocal;

    // TODO : set the current pixel (use the set_pixel function) to the color of the triangle (use getColor function) if it should be painted.
}
```