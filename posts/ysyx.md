---
title: ysyx
date: 2026-04-05
tags: [study]
head:
  - - meta
    - name: perspective
      content: tinf
  - - meta
    - name: perspective
      content: tinf
---

record

---

## The basic of digital and logic circuits

### NOR

$ V_{GS} < 0 $

| A | B | P1      | P2      | N1           | N2           | Y |
| - | - | ------- | ------- | ------------ | ------------ | --- |
| 1 | 1 | cut-0ff | conductivity | conductivity | conductivity | 0 | 
| 0 | 1 | conductivity | cut-off | cut-off | conductivity | 0 |
| 1 | 0 | cut-off | ~~cut-off~~(conductivity) | conductivity |  cut-off | 0 |
| 0 | 0 | conductivity | conductivity | cut-off | cut-off | 1 |

### Three input NAND

6

6(AND) + 4(NAND) =10

Y=~(A & B & C)

### XOR

| A | B | des | Y |
| - | - | -------- | - |
| 1 | 0 | A & ~B | 1 |
| 0 | 1 | ~A & B | 1 |

Y = A ^ B = (A & ~B) | (~A & B)

* **2 NOT**
* **2 AND**
* **1 OR**
* **Total:** 4 + 12 + 6 = **22**
* Y = (A AND NOT B) OR (NOT A AND B)`.

### 3_8

output4

0 0 0

if:

0 0 0
1 0 0
0 1 1
1 1 0

0 0 0
1 0 0
0 1 0
1 1 1

but these assumption is established on pure 2 nums...



1

1 0 0 0    ->   下0 上0
0 1 0 0    ->   下1 上0
0 0 1 0    ->   下0 上1
0 0 0 1    ->   下1 上1

0 0  0
0 1


