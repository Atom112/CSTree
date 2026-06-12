---
id: performance-tuning
title: 性能分析与调优
summary: 性能调优是系统的"体检"和"治疗"——先测量、找出瓶颈、再优化。"先测再改"是黄金法则，不要凭感觉优化
difficulty: advanced
order: 14
parent: security-coding
children: []
related: []
prerequisites:
  - security-coding
tags:
  - software-eng
  - performance
  - profiling
createdAt: 2026-06-12
---

## 调优步骤

1. **测量**：用 profiler 找到瓶颈（不是靠猜）
2. **分析**：确定瓶颈在 CPU、内存、I/O、网络？
3. **优化**：针对性修改
4. **再测量**：确认有效果

## 常用工具

```bash
# CPU Profiling
perf top              # 看 CPU 热点
gprof ./program       # 函数级时间分析

# 内存分析
valgrind --tool=memcheck ./program  # 内存泄漏检测
heaptrack ./program    # 堆内存分析

# I/O 分析
iostat -x 1          # 磁盘 I/O
iotop                # 进程级 I/O

# 网络
tcpdump              # 抓包分析
ping/mtr/traceroute  # 网络延迟
```

## 小结

| 领域 | 常见问题 | 优化方向 |
|:----:|:--------:|:--------:|
| **CPU** | 热点函数 | 算法优化、缓存、并行 |
| **内存** | 泄漏、GC 频繁 | 对象池、缓存策略 |
| **I/O** | 磁盘读写频繁 | 缓存、异步、批量 |
| **网络** | 延迟高 | CDN、连接池、压缩 |

**为什么先学这个？** 软件工程板块全部完成！至此所有计划中的核心板块都已创建完成。
