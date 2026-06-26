---
title: Conda 环境配置
date: 2026-06-26 11:13:17
tags:
---

# Conda 环境配置
## 由来
    写这篇文章因为开发过程中，启动Python 时候发现环境不对，使用 Conda 时候发现Channel 如何配置都失效。
## 原因分析
    Conda 环境配置会读取 多个配置
    # 检查所有可能的配置文件位置
    dir $HOME\.condarc
    dir C:\ProgramData\anaconda3\.condarc
    dir $HOME\.conda\*
    要删除掉 C:\ProgramData\anaconda3\.condarc
    如果不删除，conda 还会使用 C:\ProgramData\anaconda3\.condarc
    所有原因是 多个配置文件共存导致
## 修改
    将 C:\ProgramData\anaconda3\.condarc 设置 C:\ProgramData\anaconda3\.condarc.bak

## 重新配置
    重新 修改 C:\Users\Administrator\.condarc
````yaml
    channels:
        - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
        - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
        - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r/
        - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2/
    ssl_verify: false
    show_channel_urls: true
````
## 检查


    conda config --show channels

    (ocr_env) λ conda config --show channels
channels:
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r/
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2/

  我这个使用HTTP ，中国国内镜像，可以加快速度。
