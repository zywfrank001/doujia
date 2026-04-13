---
title: Nanobot 入门
date: 2026-04-07 11:03:26
tags:
- AI
- Nanobot
categories:
- AI
---

# Nano bot 入门

## Nano bot 介绍

    Nanobot 可以说是一个简化版本的OpenClaw，对于技术人员来说可以快速上手，避免调试复杂的 Openclaw 
    当然了解Nanobot 思路也可以为了解OpenClaw 做铺垫
## Nanobot 结构

    Nanobot 架构图
    ![Nanobot 架构图](https://raw.githubusercontent.com/Nanobot-AI/Nanobot-AI.github.io/main/images/Nanobot%20%E6%9E%B6%E6%9E%84.png)
###  Nanobot 运行环境
    Python >3.11 官方要求大于3.11 ，大家可以安装 3.12 版本的Python
    使用UV来创建一个Python 运行环境
##### 命令详解
    nanobot onboard 初始化一个空的配置文件，如果有一天你的nanobot 的配置很乱，就可以通过nanobot onboard 重新初始化一个配置文件 
    
    nanobot gateway 
        启动nanobot的网关，用于连接外部的Channel ，如果你希望通过QQ或者微信来和nanobot 沟通，让他干活等等，需要在运行nanobot gateway ，相当于在服务器启动一个web 服务，提供接口给外部调用
    nanobot agent 系列
    nanobot agent -m ‘’ 发起一次性的聊天，nanobot 不会loop 等待用户输入，直接返回然后退出命令行
    nanobot agent 开启命令行，并loop 等待用户输入
    nanobot agent --no-markdown 启动命令行，但是不支持markdown
    nanobot agent --logs 在对话中显示nanobot 的日志，默认不 显示日志

    nanobot status 显示nanobot 的运行状态
    nanobot provider login openai-codex 用于登录指定的provider，这个openao是一个例子 如果你使用openRouter 就可以登录openRouter
    nanobot channel login 用于登录指定的Channle 比如登录qq 或者 whatsApp 等等
    nanobot chanels status 显示nanobot 的Channel 状态

### 框架详解

#### Provider
    提供模型服务的集成商，比如有名的OpenRouter ，他们就是模型的二道贩子，帮我购买模型，屏蔽掉购买不同厂家模型的账号复杂度等等
    我认为以后的大模型一定会到达平民级别，大家都可以使用
    模型服务提供者，比如OpenAI ，OpenRouter ，HuggingFace ，Baidu ，Google ，Amazon ，Alibaba ，Tencent ，YouDao ，Bing ，ChatGPT ，ElevenLabs ，Midjourney ，StabilityAI ，StabilityLM ，OpenAI Codex ，OpenAI Codex Lite ，OpenAI Codex Pro ，OpenAI Codex Pro Lite ，OpenAI Codex Pro Pro ，OpenAI Codex Pro Pro Lite ，OpenAI Codex Pro Pro Pro ，OpenAI Code
#### Agent
    这个概念其实就是描述nanobot 自己，nanobot 就是 LLM 的一个Agent ，Nanobot 充当一个代理，将用户和模型连结起来，nanobot 的服务核心就是 agentLoop 一个无限循环，实现Re-Act设计模式

#### Gateway

    连接外部的桥梁

#### Channel

    具体连接的渠道，比如QQ 微信等等，，这样你可以在QQ 上就可以运行nanobot

#### AgentLoop 

    Nanobot 的核心代码逻辑，接受用户的请求，调用模型，读取历史等等代码。在一个循环内完成



