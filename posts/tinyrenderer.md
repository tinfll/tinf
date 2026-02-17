---
title: tinyrenderer
date: 2026-01-12
tags: [c++]
head:
  - - meta
    - name: tip
      content: tinf
  - - meta
    - name: tip
      content: tinf
---

tinyrenderer

---



f v/vt/vn。 这就是工业标准：顶点索引 / UV索引 / 法线索引。

3/1/1 意思是：这个三角形的第一个角，使用第 3 号顶点，第 1 号 UV，第 1 号法线。

对于 Wireframe Rendering（线框渲染），斜杠前面的第一个数字

区分剔除和深度测试

P << a,0,
     0,b;(...点也用矩阵表示？，应该就是向量。但是这里线代应该就能延伸很多别的方法诸如 横着的a,b竖着的a,b)
Mtest2d <<？

P' << a+rcos(-n),0,
      0,b+rcos(n);

硬凑PM = P'(...其实也不是很清楚矩阵之间该用啥运算符，看的大多数都没有，直接是[][] = []。
等等，远古的Ax = b的记忆貌似在攻击我...我好像能把一些之前看书看的概念串起来一些)
不对，P就直接写成[上a下b]，应该是这样，等同于向量等等，P'同理
然后这样才经过硬凑可得出Mtest2d(A) << rcos(-n), 0,
                                    0, rsin(n);这个就是绕点的2d旋转。

3d空间变换矩阵应该是，比如绕y轴旋转n度(y up ,-z forward)
就是从上往下看以sqrt(a^2 + b ^ 2)为半径进行旋转
Mtest3d << rcos(?n), 0 , 0
           0     , 1 , 0
           0,    , 0 , rsin(?n)
这里问号是我也敲不准拿什么符号表示。

。。。。好吧发现前面完全理解错了。。。
θ。
cosθ， 0， -sinθ,
0，    1,   0,
sinθ, 0, cosθ

```cpp
template<size_t DimCols, size_t DimRows, typename T> class mat;

template<size_t Dim, typename T> struct dt {
    static T det(const mat<Dim, Dim, T>& src) {
        T ret = 0;
        for (size_t i = 0; i < Dim; i++) ret += src[0][i] * src.cofactor(0, i);
        return ret;
    }
};

template<typename T> struct dt<1, T> {
    static T det(const mat<1, 1, T>& src) { return src[0][0]; }
};

template<size_t DimRows, size_t DimCols, typename T> class mat {
    vec<DimCols, T> rows[DimRows]; 
public:
    mat() {}
    mat(const T* vals) { // 初始化
        for (size_t i = 0; i < DimRows; i++) for (size_t j = 0; j < DimCols; j++) rows[i][j] = vals[i + j * DimCols];
    }

    vec<DimCols, T>& operator[](const size_t i) { assert(i < DimRows); return rows[i]; }
    const vec<DimCols, T>& operator[](const size_t i) const { assert(i < DimRows); return rows[i]; }

    vec<DimRows, T> col(const size_t i) const {
        assert(i < DimCols);
        vec<DimRows, T> ret;
        for (size_t j = 0; j < DimRows; j++) ret[j] = rows[j][i];
        return ret;
    }

    void set_col(size_t i, vec<DimRows, T> v) {
        assert(i < DimCols);
        for (size_t j = 0; j < DimRows; j++) rows[j][i] = v[j];
    }

    static mat<DimRows, DimCols, T> identity() {
        mat<DimRows, DimCols, T> ret;
        for (size_t i = 0; i < DimRows; i++) for (size_t j = 0; j < DimCols; j++) ret[i][j] = (i == j);
        return ret;
    }

    T det() const { return dt<DimCols, T>::det(*this); }

    mat<DimRows - 1, DimCols - 1, T> get_minor(size_t row, size_t col) const {
        mat<DimRows - 1, DimCols - 1, T> ret;
        for (size_t i = 0; i < DimRows - 1; i++)
            for (size_t j = 0; j < DimCols - 1; j++)
                ret[i][j] = rows[i < row ? i : i + 1][j < col ? j : j + 1];
        return ret;
    }

    T cofactor(size_t row, size_t col) const {
        return get_minor(row, col).det() * ((row + col) % 2 ? -1 : 1);
    }

    mat<DimRows, DimCols, T> adjugate() const {
        mat<DimRows, DimCols, T> ret;
        for (size_t i = 0; i < DimRows; i++) for (size_t j = 0; j < DimCols; j++) ret[i][j] = cofactor(i, j);
        return ret;
    }

    mat<DimCols, DimRows, T> transpose() {
        mat<DimCols, DimRows, T> ret;
        for (size_t i = 0; i < DimCols; i++) for (size_t j = 0; j < DimRows; j++) ret[i][j] = rows[j][i];
        return ret;
    }

    mat<DimRows, DimCols, T> invert_transpose() {
        mat<DimRows, DimCols, T> ret = adjugate();
        T tmp = ret[0] * rows[0];
        return ret / tmp;
    }

    mat<DimRows, DimCols, T> invert() {
        return invert_transpose().transpose();
    }
};

// =========================================================================
// 矩阵运算 (Matrix Operations)
// =========================================================================

template<size_t DimRows, size_t DimCols, typename T>
vec<DimRows, T> operator*(const mat<DimRows, DimCols, T>& lhs, const vec<DimCols, T>& rhs) {
    vec<DimRows, T> ret;
    for (size_t i = 0; i < DimRows; i++) ret[i] = lhs[i] * rhs; 
    return ret;
}

template<size_t R1, size_t C1, size_t C2, typename T>
mat<R1, C2, T> operator*(const mat<R1, C1, T>& lhs, const mat<C1, C2, T>& rhs) {
    mat<R1, C2, T> result;
    for (size_t i = 0; i < R1; i++) {
        for (size_t j = 0; j < C2; j++) {
            result[i][j] = lhs[i] * rhs.col(j);
        }
    }
    return result;
}

template<size_t DimRows, size_t DimCols, typename T>
mat<DimRows, DimCols, T> operator/(mat<DimRows, DimCols, T> lhs, const T& rhs) {
    for (size_t i = 0; i < DimRows; i++) lhs[i] = lhs[i] / rhs;
    return lhs;
}

// 类型别名
typedef vec<2, float> Vec2f;
typedef vec<3, float> Vec3f;
typedef vec<4, float> Vec4f;
typedef vec<2, int>   Vec2i;
typedef vec<3, int>   Vec3i;
typedef mat<4, 4, float> Matrix4;
typedef mat<3, 3, float> Matrix3;
```


。秽土转生了。
顶点缓冲对象(Vertex Buffer Objects, VBO)管理这个内存，它会在GPU内存（通常被称为显存）中储存大量顶点。使用这些缓冲对象的好处是我们可以一次性的发送一大批数据到显卡上，而不是每个顶点发送一次。从CPU把数据发送到显卡相对较慢，所以只要可能我们都要尝试尽量一次性发送尽可能多的数据。当数据发送至显卡的内存中后，顶点着色器几乎能立即访问顶点，这是个非常快的过程。
。

```cpp
//顶点数组对象：
Vertex Array Object，VAO
Vec4f v;
ss >> v.x >> v.y >> v.z;
v.w = 1.0f;
verts_.push_back(v);？
//顶点缓冲对象：Vertex Buffer Object，VBO
Vec4f gl_Vertex = { v.x, v.y, v.z, 1.0f };
//元素缓冲对象：Element Buffer Object，EBO 或 索引缓冲对象 Index Buffer Object，IBO
qmhsV<int> fs;
//虽然貌似是之前写的qmhs[].verts/faces等一堆。所以你之前不写gl。。？，，。。
```

