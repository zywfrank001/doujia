---
title: Unity变量在 Inspector 中的显示规则和常用特性
date: 2025-12-25 16:55:26
tags:
- Unity
- C#
categories:
- Unity 入门
- C#
- 游戏开发
---

理解 Unity 中变量在 Inspector 中的显示规则和常用特性（Attribute），是高效组织脚本、提升开发效率的关键。下面这张表格汇总了核心规则，帮你快速掌握。

| 访问修饰符 | 默认 Inspector 显示 | 序列化（值被保存） | 常用特性/备注 |
| :--- | :--- | :--- | :--- |
| **`public`** | **显示** | **是** | 默认即可显示和编辑，常用于需在 Inspector 中配置或供其他脚本访问的变量。 |
| **`private` / `protected`** | **不显示** | **否** | 配合 `[SerializeField]` 特性可强制其显示和序列化。 |
| **任何修饰符 + `[HideInInspector]`** | **不显示** | **是（仅对原为public的字段）** | 变量值会被保存，但不在 Inspector 中显示，避免不必要的编辑干扰。 |
| **自定义类/结构体** | **不显示** | **否** | 必须在类/结构体定义前添加 `[System.Serializable]` 特性，才能显示和序列化。 |

---

### 🎨 常用特性注解详解

特性（Attribute）是放在变量、类或方法上方括号 `[...]` 中的标记，用于赋予特殊行为。以下是 Inspector 优化中最常用的一些特性。

1.  **`[Header("标题文字")]`**
    在 Inspector 中为变量上方添加一个标题，用于**逻辑分组**，让面板更清晰。
    ```csharp
    [Header("角色属性")]
    public int health;
    public int attack;
    ```

2.  **`[Tooltip("提示信息")]`**
    为变量添加**悬浮提示**。当鼠标悬停在 Inspector 中的变量名上时，会显示该提示文字，非常适合用于说明变量的用途。
    ```csharp
    [Tooltip("这是角色的移动速度，值越大角色移动越快。")]
    public float moveSpeed;
    ```

3.  **`[Space(高度值)]`**
    在变量前添加**垂直间距**。可以传入像素值参数（如 `[Space(20)]`）来设置间距大小，默认为 6 像素。用于优化布局，避免拥挤。

4.  **`[Range(最小值, 最大值)]`**
    将数值型变量（int, float）在 Inspector 中显示为一个**滑动条**，并限制输入范围，常用于血量、比例等需要限制范围的参数。
    ```csharp
    [Range(0, 100)]
    public int criticalChance; // 暴击几率会被限制在0到100之间
    ```

5.  **`[Multiline(行数)]` 与 `[TextArea(最小行, 最大行)]`**
    两者都用于为字符串创建**多行文本输入框**。
    - `[Multiline]` 提供一个固定行数的输入框。
    - `[TextArea]` 更强大，可以设置行数范围并提供滚动条，适合输入大段文字。
    ```csharp
    [Multiline(3)]
    public string description1;
    [TextArea(3, 5)] // 最少显示3行，最多5行
    public string description2;
    ```

6.  **`[ContextMenu("方法名")]`**
    在 Inspector 中该**脚本组件的上下文菜单**（点击齿轮图标或右键出现的菜单）中添加一个按钮。点击后会调用所标记的方法，非常适合用来添加一些测试功能或快捷操作。
    ```csharp
    [ContextMenu("执行初始化")]
    private void InitData()
    {
        // 初始化逻辑
    }
    ```

---

### ⚙️ 组件与脚本行为控制

这类特性用于管理组件间的依赖和脚本的执行行为。

1.  **`[RequireComponent(typeof(所需组件))]`**
    添加在**类定义上方**。当把脚本挂到 GameObject 上时，如果该物体上没有指定类型的组件，Unity 会自动添加。例如，一个移动脚本需要刚体，可声明 `[RequireComponent(typeof(Rigidbody))]`，防止遗漏。

2.  **`[DisallowMultipleComponent]`**
    添加在**类定义上方**。防止在**同一个 GameObject 上挂载多个该脚本**，例如游戏管理器通常只需要一个实例。

3.  **`[ExecuteInEditMode]` 或 `[ExecuteAlways]`**
    添加在**类定义上方**。让脚本在 **Unity 编辑器模式（非播放模式）下也能执行**其回调函数（如 `Update`, `OnRender` 等），常用于编辑器工具开发或实时预览效果。`[ExecuteAlways]` 是更新、更推荐使用的特性。

---

### 💡 实用技巧与最佳实践

- **组合使用**：多个特性可以同时应用在一个变量上，用逗号分隔。
    ```csharp
    [Header("设置"), Tooltip("这是一个重要的速度参数"), Range(0, 10), SerializeField]
    private float _importantSpeed;
    ```

- **慎用 public 变量**：出于面向对象封装性原则，如果变量不需要被其他脚本访问，应优先声明为 `[SerializeField] private`，而不是 `public`。这能减少不必要的脚本间耦合。

- **注意不可序列化的类型**：某些类型如 `Dictionary<T,U>` 默认无法在 Inspector 中显示和序列化，需要自行处理或使用替代结构。
