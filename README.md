# 宝贝日记 - Railway 部署指南

## 部署步骤（约10分钟）

### 第1步：上传代码到 GitHub
1. 打开 https://github.com，注册/登录
2. 右上角「+」→「New repository」
3. 仓库名填 `baobao-diary`，选 **Public**，点「Create repository」
4. 点「uploading an existing file」，把压缩包里所有文件拖进去，点「Commit changes」

### 第2步：Railway 部署
1. 打开 https://railway.com，点「Login」用 GitHub 账号登录
2. 登录后点「New Project」
3. 选「Deploy from GitHub repo」
4. 选择你刚创建的 `baobao-diary` 仓库
5. Railway 会自动检测并开始构建（约2-3分钟）
6. 构建完成后点左侧项目名 → 「Settings」→「Networking」→「Generate Domain」
7. 得到一个网址如 `https://baobao-diary-xxx.railway.app`

### 第3步：iPhone 添加到主屏幕
1. 用 iPhone **Safari** 打开上面的网址
2. 点底部分享按钮（□↑）
3. 下拉找「添加到主屏幕」→ 点「添加」
4. 桌面出现「宝贝日记」图标，点击全屏使用 🎉
