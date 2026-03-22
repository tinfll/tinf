---
title: tinyrenderer
date: 2026-03-13
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



## model load
f v/vt/vn。 obj标准：顶点索引 / UV索引 / 法线索引。

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


...我在写什么？


## math lib

其实甚至还没更新，因为还没研究到
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

## draw Bxxx line
```cpp
void line(int ax, int ay, int bx, int by, TGAImage& framebuffer, TGAColor color) {
    bool steep = std::abs(ax - bx) < std::abs(ay - by);
    if (steep) {
        std::swap(ax, ay);
        std::swap(bx, by);
    }
    if (ax > bx) {
        std::swap(ax, bx);
        std::swap(ay, by);
    }
    int y = ay;
    int ie = 0;
    for (int x = ax; x <= bx; x++) {
        if (steep)    framebuffer.set(y, x, color);
        else    framebuffer.set(x, y, color);
        ie += 2 * std::abs(by - ay);
        if (ie > bx - ax) {
            y += (by > ay) ? 1 : -1;
            ie -= 2 * (bx - ax);
        }
    }
}
```


## MVP
....放置一个寒假竟然救活了。
渲染管线后仍旧玄学的是线代(摄像机等)
```cpp
void tinfgl::lookat(const Vec3f eye, const Vec3f center, const Vec3f up) {
    Vec3f n = (eye - center).normalize();
    Vec3f l = (cross(up, n)).normalize();
    Vec3f m = (cross(n, l)).normalize();
    modelv = Matrix4f{ l.x,l.y,l.z,0.0f, m.x,m.y,m.z,0.0f, n.x,n.y,n.z,0.0f, 0.0f,0.0f,0.0f,1.0f } *
        Matrix4f{1,0,0,-center.x,  0,1,0,-center.y , 0,0,1,-center.z , 0,0,0,1 };
}

void tinfgl::init_perspective(const float f) {
    perspo = { 1, 0 ,0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -1/f, 1 };
}

void tinfgl::init_viewport(const int x, const int y, const int width, const int height) {
    viewp = { width / 2.0f, 0, 0, x+width / 2.0f,
        0, height / 2.0f, 0, y+height / 2.0f,
        0, 0, 1, 0,
        0, 0, 0, 1 };
}
```

$L_o(x, \omega_o) = L_e(x, \omega_o) + \int_{\Omega} f_r(x, \omega_i, \omega_o) L_i(x, \omega_i) (\omega_i \cdot n) d\omega_i$


## OOP
struct Eth {
    int Transform;
    void move() { cout << "This one comes from Eth" << endl; }
    virtual void attack();
};

struct Introream : public Eth {  // : inherit
    int wheels = 4;
    void hello() { cout << "hello, i come from Introream" << endl; }
};

struct X : public Eth {
    int wings = 2;
    void hello() { cout << hello, i come from X" << endl; }
};

// 使用
Introream xdyp;
xdyp.Transform = 3.1; 
xdyp.hello();
xdyp.move();

X blud；
blud.Transform = 0.0;
blud.hello();


## vrm model/blender obj some prefab....
```cpp
 Model::VertexData vd = model.faces_[iface][nthvert];

 Vec4f v = (vd.id >= 0 && vd.id < model.verts_.size())
     ? model.verts_[vd.id]
     : Vec4f(0.0f, 0.0f, 0.0f, 1.0f);

 Vec4f vn = (vd.n >= 0 && vd.id < model.vertsN_.size())
     ? model.vertsN_[vd.n]
     : Vec4f(0.0f, 0.0f, 1.0f, 0.0f);

 Vec4f uv = (vd.t >= 0 && vd.t < model.vertsT_.size())
     ? model.vertsT_[vd.t]
     : Vec4f(0.0f, 0.0f, 0.0f, 0.0f);
 // no better solutions so.....
```


note that uv(y-axis is opposite)
```cpp
//sample the albedo
int tex_x = std::max(0, std::min(Albedo.width() - 1, static_cast<int>(uv.x * Albedo.width())));
int tex_y = std::max(0, std::min(Albedo.height() - 1, static_cast<int>((1.0f - uv.y) * Albedo.height())));
//vroid hub textures uv.y / obj
```


## phong

```cpp
  Vec3f V = ( P - cameraPos).normalize();
  float cosineA = dot(N, L);//diffuse
  float diffuse = cosineA;
  Vec3f R = 2 * N * cosineA - L;
  float specular = std::pow(std::max(0.0f, dot(R, V)), 32.0f);

  float ambient = 0.1f;
  float diffuseTerm = 0.6f;
  float i = ambient + diffuse * 0.6f + specular * 0.3f;
  TGAColor basecolor = Albedo.get(tex_x, tex_y);
  TGAColor specularColor = white;

  TGAColor finColor = {
      static_cast<unsigned char>(std::clamp(basecolor[0] * i, 0.0f, 255.0f)),
      static_cast<unsigned char>(std::clamp(basecolor[1] * i, 0.0f, 255.0f)),
      static_cast<unsigned char>(std::clamp(basecolor[2] * i, 0.0f, 255.0f)),
      255
  };

```



## TBN

```cpp
virtual std::pair<bool, TGAColor> fragment(const Vec3f bar) const{
    mat<3, 2, float> e;
    mat<2, 2, float> u;
    mat<3, 2, float> tb;
    mat<3, 3, float> TBN;
    Vec3f P1 = Vec3f(PV[1][0] - PV[0][0], PV[1][1] - PV[0][1], PV[1][2] - PV[0][2]);
    Vec3f P2 = Vec3f(PV[2][0] - PV[0][0], PV[2][1] - PV[0][1], PV[2][2] - PV[0][2]);
    e = { P1.x, P2.x, 
          P1.y, P2.y, 
          P1.z, P2.z };

    Vec2f U1 = Vec2f(UV[0][1] - UV[0][0], UV[1][1] - UV[1][0]);
    Vec2f U2 = Vec2f(UV[0][2] - UV[0][0], UV[1][2] - UV[1][0]);
    u = { U1.x, U2.x, 
          U1.y, U2.y };

    // ....manually invert the 2x2 UV matrix
    float det = U1.x * U2.y - U2.x * U1.y;
    mat<2, 2, float> u_inv;
    u_inv[0][0] = U2.y / det;
    u_inv[0][1] = -U2.x / det;
    u_inv[1][0] = -U1.y / det;
    u_inv[1][1] = U1.x / det;

    tb = e * u_inv;//through some linear algebra transformation

    Vec3f P = Vec3f(PV * bar);
    Vec3f N = Vec3f(NV * bar).normalize();
    Vec2f uv = UV * bar;

    //sample the normal
    int NM_x = std::max(0, std::min(NM.width() - 1, static_cast<int>(uv.x * NM.width())));
    int NM_y = std::max(0, std::min(NM.height() - 1, static_cast<int>((1.0f - uv.y) * NM.height())));
    Vec3f n = { NM.get(NM_x, NM_y).bgra[2] / 255.f * 2.f - 1.f, 
                NM.get(NM_x, NM_y).bgra[1] / 255.f * 2.f - 1.f, 
                NM.get(NM_x, NM_y).bgra[0] / 255.f * 2.f - 1.f };


    Vec3f T = Vec3f(tb[0][0], tb[1][0], tb[2][0]).normalize();
    Vec3f B = Vec3f(tb[0][1], tb[1][1], tb[2][1]).normalize();
    TBN = { T.x, B.x, N.x,
            T.y, B.y, N.y,
            T.z, B.z, N.z };

    N = (TBN * n).normalize();
```
