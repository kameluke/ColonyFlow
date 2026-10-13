# ColonyFlow - マウスコロニー管理システム

ColonyFlow（コロニーフロー）は、研究現場におけるマウス飼育・交配・系統管理を効率化するための Apple 風モダン UI を採用した管理システムです。

---

## 🚀 プラットフォーム構成

本リポジトリには以下の3つの形式が用意されています：

1. **Web版（ルートディレクトリ）**
   - ローカルの Node.js サーバーで動作するブラウザ版
   - 起動コマンド: `npm run dev`
2. **Mac デスクトップアプリ版（`desktop-app/`）**
   - Electron ベースのスタンドアロン Mac アプリ（.app / .dmg）
   - 書類フォルダ（`~/Documents/ColonyFlow/`）にデータを安全に自動保存
   - 詳細は `desktop-app/ColonyFlow_配布用_インストール手順と注意事項.md` を参照
3. **iPad 単体アプリ版（`ipad-app/`）**
   - Capacitor + Next.js (Static Export) によるネイティブ iPadOS アプリ
   - Mac との常時接続や外部サーバー不要、**iPad 単体でオフライン動作**
   - Xcode を使って手元の iPad に無料で直接インストール可能
   - 詳細は [iPad_Install_Guide.md](./iPad_Install_Guide.md) を参照

---

## 📱 iPad へのインストール方法（概要）

Mac に無料の **Xcode**（App Store から入手可能）をインストールし、以下の手順で手元の iPad 実機に転送できます：

1. `ipad-app/ios/App/App.xcodeproj` を Xcode で開く
2. 無料の Apple ID で署名（Signing）を設定
3. iPad をケーブル接続し、Xcode 上部の再生ボタン（▶）を押すだけで iPad にインストール完了

詳しいステップ・バイ・ステップの手順は [iPad_Install_Guide.md](./iPad_Install_Guide.md) をご覧ください。
