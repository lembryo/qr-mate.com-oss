# QR Mate OSS – 高速・高機能なオフラインQRコード生成アプリ（オープンソース版）

![QR Mate Logo](./public/logo.png)

**QR Mate OSS** は、完全オフラインで動作するQRコード生成・カスタマイズアプリです。  
Excelやスプレッドシートからの大量データ貼り付けに対応し、シンプルで高速な一括QR生成を実現します。  
スタンドアロンなアプリとして、セキュリティを重視した現場業務にも適応可能です。

---

## 🚀 特徴

- ✅ **完全オフライン対応** – インターネット接続が無い環境でも完全動作
- ✅ **QRコードの一括生成（PNG形式）**
- ✅ **QRコード画像ファイルからの連続読み取り・ファイル保存**
- ✅ **自由なデザインカスタマイズ**
    - 色変更・形状選択・中央ロゴ挿入対応
- ✅ **ExcelやGoogleスプレッドシートなどから大量データを貼り付け対応**
- ✅ **Tauri + Rust + React による高パフォーマンス構成**
- ✅ **MITライセンスで自由に利用・改変可能**
- ✅ **Windows(x86_64) / macOS(Intel & Apple Silicon) / Linux(x86_64) 対応**

---

## 🔒 製品版限定の追加機能（非公開）

オープンソース版に含まれない機能一覧：

- ☑️ **QRコード生成・読み込み履歴**
- ☑️ **CSV・Excelファイル直接読み込み**
- ☑️ **ZIP圧縮一括保存機能**
- ☑️ **WebカメラによるリアルタイムQRコード読み取り**

> 👉 これらの機能は法人向け製品版にて提供予定です。  
> 製品版導入・権利譲渡をご希望の場合は、このドキュメント最下部の連絡先よりお問い合わせください。

---

## 📦 インストール・ビルド手順

### 📁 1. クローン

```bash
git clone https://github.com/lembryo/qr-mate.com-oss.git
cd qr-mate.com-oss
```

### ⚙️ 2. 依存関係のインストール

```bash
npm install
```

### 🛠️ 3. アプリ起動（開発モード）

```bash
npm run tauri dev
```

### 📦 4. アプリのビルド（配布用）

```bash
npm run tauri build
```

---

## 💬 スクリーンショット

<table>
  <tr>
    <td><img src="./public/screenshot_setting.png" alt="QR Mate OSS 設定画面" /></td>
    <td><img src="./public/screenshot_list.png" alt="QR Mate OSS リスト画面" /></td>
    <td><img src="./public/screenshot_reading.png" alt="QR Mate OSS 読み込み画面" /></td>
  </tr>
</table>

---

## 📄 ライセンス

このプロジェクトは **MITライセンス** のもとで公開されています。  
自由に利用・複製・改変・再配布いただけます。

---

## 🙋 製品版 / 権利譲渡のお問い合わせ

QR Mateの製品版では、以下の機能を追加で提供しています：

- ☑️ QRコード生成・読み込み履歴
- ☑️ CSV・Excelファイル直接読み込み
- ☑️ ZIP圧縮一括保存機能
- ☑️ WebカメラによるリアルタイムQRコード読み取り

製品版導入、またはアプリの**権利ごと譲渡のご相談**は以下までご連絡ください：

📧 **[mao.lembryo@gmail.com](mailto:mao.lembryo@gmail.com)**

---

## ⭐ Star で応援！

もしこのアプリが気に入ったら、GitHubでStarをいただけると励みになります 🙌  
ぜひ自由に使ってください！

---
