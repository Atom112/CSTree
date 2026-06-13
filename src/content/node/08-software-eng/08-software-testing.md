---
id: software-testing
title: 软件测试（单元/集成/E2E）
summary: 软件测试是保证代码质量的核心手段——单元测试测函数，集成测试测模块协作，E2E 测试测完整业务流程
difficulty: intermediate
order: 8
parent: solid-principles
children:
  - ci-cd
related: []
prerequisites:
  - solid-principles
tags:
  - software-eng
  - testing
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔍 写代码不测试——就像考完不检查

你写完了系统的"登录功能"，觉得没问题就上线了。结果第二天，100 个用户无法登录——因为密码含特殊字符时验证逻辑出错了。

**测试的价值**：不是"测出 Bug"，而是**在用户发现 Bug 之前自己发现它**。

> 🏪 **类比：质检流水线**
>
> 一家奶茶店">
> - **不做测试**：做好直接给客人——"这杯太甜了""这杯没有珍珠"→ 客户体验极差
> - **单元测试**：每一杯做好后，店员自己尝一口（单独验证每个功能）
> - **集成测试**：两杯同时做，看流程能不能配合好（验证模块间协作）
> - **E2E 测试**：模拟一个完整流程——"点单→付钱→取奶茶→喝完"（端到端验证）

---

## 🏔️ 测试金字塔

最经典的测试策略是**测试金字塔**：

```
      /\           E2E 测试（少而贵）
     /  \          端到端测试：模拟用户完整操作
    /    \
   /      \
  /________\      集成测试（中）
 /          \      测试模块之间协作
/____________\
|  单元测试（多而快） |
|  测试单个函数/方法  |
|____________________|
```

**核心原则**：底层（单元测试）多写，上层（E2E）少写。

### ① 单元测试（Unit Test）——测试最小的"零件"

**测什么**：单个函数、单个方法——隔离测试。

```python
# 待测试的函数
def calculate_grade(score):
    if score >= 90: return "优秀"
    if score >= 80: return "良好"
    if score >= 70: return "中等"
    if score >= 60: return "及格"
    return "不及格"

# 单元测试
def test_calculate_grade():
    assert calculate_grade(95) == "优秀"
    assert calculate_grade(85) == "良好"
    assert calculate_grade(75) == "中等"
    assert calculate_grade(65) == "及格"
    assert calculate_grade(55) == "不及格"
    assert calculate_grade(100) == "优秀"  # 边界值
    assert calculate_grade(59) == "不及格"  # 边界值
    assert calculate_grade(0) == "不及格"   # 边界值
```

**特点**：运行快（毫秒级）、定位精确（哪个函数出错一目了然）、容易写。

**覆盖率（Coverage）**：衡量"有多少代码被测试覆盖"。

```bash
# 用 pytest 跑测试看覆盖率
pytest --cov=myapp tests/
# 输出：Name           Stmts   Miss  Cover
#       grade.py          10      1    90%
```

> ✅ **好目标**：核心逻辑的单元测试覆盖 > 80%。但不要追求 100%——有些代码（如 UI 渲染）不值得单元测试。

### ② 集成测试（Integration Test）——测试零件能不能组装好

**测什么**：多个模块一起工作——数据库 + 业务逻辑 + API。

```python
def test_create_user_integration():
    # 测试"创建用户"的全流程：API → 业务层 → 数据库
    response = client.post("/api/users", json={
        "name": "张三",
        "email": "zhangsan@example.com"
    })
    assert response.status_code == 201
    
    # 验证数据确实写入了数据库
    user = db.session.query(User).filter_by(email="zhangsan@example.com").first()
    assert user is not None
    assert user.name == "张三"
```

**特点**：比单元测试慢（涉及真实数据库/网络）、能发现"模块间接口不匹配"的问题。

### ③ E2E 测试（End-to-End Test）——模拟真实用户

**测什么**：从用户界面操作到后台服务——完整业务流程。

```python
# E2E 测试——用 Selenium 模拟浏览器操作
def test_user_checkout():
    driver = webdriver.Chrome()
    driver.get("https://shop.example.com")
    driver.find_element(By.ID, "username").send_keys("张三")
    driver.find_element(By.ID, "password").send_keys("123456")
    driver.find_element(By.ID, "login-btn").click()
    driver.find_element(By.ID, "add-to-cart").click()
    driver.find_element(By.ID, "checkout").click()
    
    assert "下单成功" in driver.page_source
    driver.quit()
```

**特点**：最接近真实用户体验、最慢（可能几分钟）、最脆弱（UI 变一点点就失败）。

---

## 🧪 TDD（测试驱动开发）——先写测试再写代码

TDD 的工作流程是"红-绿-重构"循环：

```
1. 红：先写一个会失败的测试（还没写功能代码）
2. 绿：写最简代码让测试通过
3. 重构：优化代码，保持测试通过

每次循环只加一个功能点。

示例：
# 第 1 步：先写测试（会失败）
def test_is_even():
    assert is_even(4) == True
    assert is_even(3) == False

# 第 2 步：写最简实现让测试通过
def is_even(n):
    return n % 2 == 0

# 第 3 步：重构（这里太简单了，不需要重构）
# 然后循环：再加一个测试（比如处理负数）...
```

> 💡 **TDD 的价值**：
> - 写代码前就想清楚"到底要什么"（测试就是需求）
> - 自然的代码设计（因为测试要求代码是可测的 → 自然就解耦了）
> - 安全网（改代码时，测试告诉你"有没有改坏"）

---

## 📋 测试策略选择

| 类型 | 数量 | 速度 | 维护成本 | 定位问题 |
|:----:|:----:|:----:|:--------:|:--------:|
| **单元测试** | 多 | ⚡ 毫秒 | 低 | 精确到函数 |
| **集成测试** | 中 | ⏱ 秒 | 中 | 模块间接口 |
| **E2E 测试** | 少 | 🐢 分钟 | 高 | 全流程 |

**建议比例**（Google 推荐的 70/20/10）：
- 70% 单元测试
- 20% 集成测试
- 10% E2E 测试

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **单元测试** | 测单个函数——快、多、精确 |
| **集成测试** | 测模块间协作——确保零件能组装 |
| **E2E 测试** | 测完整流程——模拟真实用户 |
| **测试金字塔** | 多写单元测试、少写 E2E |
| **TDD** | 先写测试再写代码——红绿重构循环 |
| **覆盖率** | 衡量测试覆盖了多少代码——核心逻辑 > 80% |
| **边界值** | 0、空值、极限值——Bug 最容易出现在边界 |

> 🎯 **小练习**：为之前的"计算学生成绩等级"函数写完整的 TDD 测试——包括正常值、边界值、异常输入（负数、超过 100 的分数等）。

**为什么先学这个？** 测试是质量保障的第一步。但要持续保障质量，需要把测试自动化——[[ci-cd|CI/CD 与 DevOps]]。
