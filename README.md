# OPEN AI 的 API 代理项目

在国内直接访问 OPEN AI 的 API 存在被封账号的风险，本项目可以快速搭建一个 OPEN AI 的接口代理服务。然后一键部署到腾讯云云函数的国外节点上，比如新加坡地域，不需要特意买一台云服务器，按量付费，成本低，且无需运维。

[![Cloud Studio Template](https://cs-res.codehub.cn/common/assets/icon-badge.svg)](https://cloudstudio.net/#https://github.com/cellbang/openai-proxy.git)

## 本地运行

```bash
yarn start
```

## 配置 AKSK 和地域

```bash
malagu config -m scf
```

## 一键部署

```bash
malagu deploy -m scf
```

## 配置

1. 环境变量 `OPENAI_PROXY_DEFAULT_API_KEY`，配置访问被代理的 OPEN AI API 的默认 API Key。当前客户端请求没有携带认证 API KEY 时使用。

1. 环境变量 `OPENAI_PROXY_CORS_ORIGIN`，配置允许跨域请求策略。
