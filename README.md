# Lucky Grouping Tool (幸運分組助手)

這是一個基於 React 與 Vite 開發的線上分組與抽籤工具，提供美觀且流暢的使用者體驗。

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ 特色功能 (Features)

- **📋 名單管理**
  - 支援手動輸入名單
  - 支援 CSV 匯出分組結果

- **👥 分組模式 (Grouping Mode)**
  - **依人數分組**：指定每組多少人，自動計算組數
  - **依組數分組**：指定總共分幾組，自動平均分配人數
  - 隨機打亂演算法

- **🎰 抽籤模式 (Lottery Mode)**
  - 緊張刺激的動畫效果
  - 支援 **「不重複中獎」** 與 **「可重複中獎」** 兩種模式
  - 中獎紀錄即時顯示與重置功能

## 🛠 技術堆疊 (Tech Stack)

- **Core**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: GitHub Actions

## 🚀 快速開始 (Getting Started)

### 1. 安裝環境 (Installation)

確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18+)。

```bash
# 安裝所有相依套件
npm install
```

### 2. 啟動開發伺服器 (Development)

```bash
# 啟動本地開發環境
npm run dev
```
啟動後，請開啟瀏覽器訪問終端機顯示的網址 (通常是 `http://localhost:5173`)。

### 3. 建置專案 (Build)

```bash
# 進行生產環境建置
npm run build
# 預覽建置結果
npm run preview
```

## 🔄 自動部署 (Deployment)

本專案已設定 **GitHub Actions**，推送程式碼到 GitHub後即可自動部署。

### 設定步驟：
1. 將程式碼推送到 GitHub Repository 的 `main` 分支。
2. GitHub Action `Deploy to GitHub Pages` 會自動開始執行打包與部署。
3. 等待 Action 執行成功後，前往 GitHub Repo 的 **Settings** > **Pages**。
4. 在 **Build and deployment** > **Source** 選擇 **Deploy from a branch**。
5. **Branch** 選擇 `gh-pages` / `/ (root)`，然後儲存。
6. 您的網站將會在 GitHub Pages 上線 (例如: `https://<username>.github.io/<repo-name>/`)。

## 📂 專案結構 (Project Structure)

```
.
├── components/        # React 元件 (分組、抽籤、輸入邏輯)
├── utils/             # 工具函式 (Shuffle 演算法等)
├── App.tsx            # 主要應用程式入口
├── vite.config.ts     # Vite 設定檔
└── .github/workflows  # GitHub Actions 部署流程
```

## 📝 相關設定檔案

- **.gitignore**: 已設定忽略 `node_modules`, `dist`, `.env` 等不必要檔案。
- **package.json**: 定義了專案腳本與相依套件。

---
*Original Project Source: [AI Studio](https://ai.studio/apps/drive/1dTh96mu6LoosHk0HqP3sPqM6v56f9gd8)*
