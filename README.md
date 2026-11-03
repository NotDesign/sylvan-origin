# 森朔國際 SYLVAN ORIGIN

React + Vite 靜態網站，公開商品目錄、購物車及自動寄送的訂購查詢。

GitHub Pages：以 main 分支的 docs 目錄發布。

`npm ci` 後執行 `npm run build`。成品於 dist；複製至 docs 並包含 .nojekyll 後提交發布。

提交表單會由 FormSubmit 自動寄至 sylvanorigin@gmail.com；收件人須先在 FormSubmit 驗證信中啟用此表單。沒有 API 密鑰、付費帳號或付款卡資料。查詢編號用作聯絡核對，並非伺服器訂單憑證。

寄信服務只確認接收，不能視為已進入收件匣；實際收信仍須核對。逾時或錯誤保留表單及購物車，不會自動重試。

驗證：`node --experimental-strip-types --test src/submission.test.ts`、`npm run build`。
