# 台灣公司查詢系統 - 雙 API 版本

這是一個整合多個資料來源的台灣公司查詢系統，支援：
1. **第三方 API** - opendata.vip 和 g0v 資料
2. **財政部/經濟部開放資料** - 官方商工登記資料

## 🚀 功能特色

- ✅ 雙資料來源切換
- ✅ 支援公司名稱或統一編號查詢
- ✅ 即時查詢結果
- ✅ 響應式設計（支援手機、平板、電腦）
- ✅ 錯誤處理與備用方案

## 📦 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **HTTP 請求**: Axios

## 🛠️ 安裝步驟

### 1. 安裝相依套件

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

### 3. 開啟瀏覽器

訪問 [http://localhost:3000](http://localhost:3000)

## 📋 API 說明

### 第三方 API

**主要來源**: opendata.vip
- 優點：免申請、即用即查
- 缺點：覆蓋範圍可能有限

**備用來源**: g0v 公司資料
- 優點：開放資料、社群維護
- 缺點：更新頻率不確定

### 財政部/經濟部資料

**主要來源**: 經濟部商工登記 API
- 優點：官方資料、最權威
- 缺點：**需要申請權限**（請至 https://data.gcis.nat.gov.tw/ 填寫使用告知書）

**備用方案**: 其他政府開放資料
- 如果沒有 API 權限，系統會嘗試其他來源

## 🔍 使用方式

### 查詢公司名稱
```
輸入：台積電
或
輸入：台灣積體電路
```

### 查詢統一編號
```
輸入：97176009
```

## 📊 查詢結果包含

- 統一編號
- 公司名稱
- 公司狀態
- 資本額
- 代表人
- 公司地址
- 設立日期
- 營業項目（部分資料源）

## 🚢 部署到 Vercel

### 方法 1: 使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

### 方法 2: GitHub 整合

1. 將專案推送到 GitHub
2. 在 Vercel Dashboard 匯入專案
3. 自動部署

## ⚙️ 環境變數（選用）

如果你有申請到經濟部 API 權限，可以設定：

```env
# .env.local
GCIS_API_KEY=your_api_key_here
```

## 📝 注意事項

### 關於經濟部 API

如果想要使用官方經濟部資料，需要：

1. 前往 https://data.gcis.nat.gov.tw/
2. 下載並填寫「使用告知書」
3. 寄送至 opendata.gcis@gmail.com
4. 提供你的外部 IP 位址
5. 等待審核（通常 1-3 天）

### API 限制

- 第三方 API 可能有查詢頻率限制
- 經濟部 API 需要 IP 白名單
- 建議兩種來源都試試看

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 👨‍💻 作者

**Tao Chun Liu** - PM Mayors

## 📄 授權

MIT License

## 🔗 相關連結

- [經濟部商工資料開放平台](https://data.gcis.nat.gov.tw/)
- [政府資料開放平台](https://data.gov.tw/)
- [Next.js 文件](https://nextjs.org/docs)

---

**提示**：如果第三方 API 無法使用，建議改用「財政部資料」選項，或申請經濟部 API 權限以獲得最佳體驗。

'''mermaid
flowchart TD
  %% 高階使用者旅程 (User Journey)
  subgraph Awareness["Awareness / 發現"]
    A1[訪客來到網站或行銷頁面<br/>(廣告 / 社群 / 搜尋)]
    A2[閱讀產品價值與摘要]
  end

  subgraph Consideration["Consideration / 考慮"]
    C1[瀏覽功能、方案與價格]
    C2[比較、查看範例或評價]
  end

  subgraph Conversion["Conversion / 轉換"]
    V1[註冊或登入]
    V2[選擇方案或加入購物車]
    V3[付款或確認交易]
  end

  subgraph Activation["Activation / 啟用"]
    Act1[新手導引 / Onboarding]
    Act2[完成第一個核心任務（成功使用產品）]
  end

  subgraph Retention["Retention / 留存"]
    R1[收到通知、電子郵件或提醒]
    R2[再次回訪並持續使用]
  end

  subgraph Support["Support & Feedback / 支援與回饋"]
    S1[查詢說明、FAQ 或聯絡客服]
    S2[提交意見回饋與評價]
  end

  subgraph Account["Account / 帳戶管理"]
    Acc1[設定、付款與偏好管理]
    Acc2[登出或刪除帳號]
  end

  A1 --> A2
  A2 --> C1
  C1 --> C2
  C2 --> V1
  V1 --> V2
  V2 --> V3
  V3 --> Act1
  Act1 --> Act2
  Act2 --> R1
  R1 --> R2
  R2 --> S2
  S1 --> S2
  R2 --> Acc1
  Acc1 --> Acc2
