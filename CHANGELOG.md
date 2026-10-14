# Changelog

All notable changes to **ColonyFlow** will be documented in this file.

---

## [v2.05] - 2026-10-14

### 🇯🇵 日本語

#### 🚀 新機能
1. **画面の印刷 / PDF 保存（Print）**
   - ヘッダーに **Print** ボタンを追加しました（デスクトップアプリでは File メニューの「Print / Save as PDF…」、Cmd+P でも実行できます）。
   - 表示中の画面を、デザイン・レイアウトを保ったまま印刷、または PDF として保存できます。背景色・枠の色も印刷されます。
   - **Dashboard** は A4 縦、**Location / Timeline** は A4 横の1枚に自動で縮小して収めます。その他の画面は幅に合わせて縮小します。
   - **Timeline** は、画面で表示している範囲（スクロール位置）のまま印刷されます。
   - Dashboard は画面と同じ2列レイアウト（カレンダー＋Active Tasks）で印刷されます。
   - ヘッダー周りの灰色の枠など、画面専用の装飾（影・ぼかし）は印刷時に除去します。
   - **Pedigree** も A4 縦の1枚に収めて印刷します。
   - **印刷日時**（Printed: YYYY/MM/DD HH:MM）を、全ページの右下に自動で入れます。
   - Mice / Cages など長い表で、1ページ目が空白になる問題を修正しました（表が1ページ目から始まり、複数ページに続きます）。
   - **Location** は Room（見出し＋ラックのグリッド）がページをまたがないようにし、1ページ目に最初の Room が収まるよう自動で縮小します。1枚に収める必要はなく、Room が複数ある場合は複数ページになります。
   - 印刷時はページ全体の背景色を白にし、**ダークモードでもライトモードと同じ配色**で印刷します。

---

### 🇺🇸 English

#### 🚀 New Features
1. **Print / Save as PDF of the current screen:**
   - Added a **Print** button to the header (also available as File → "Print / Save as PDF…" and Cmd+P in the desktop app).
   - Prints or saves the displayed screen as PDF while preserving its design and layout, including background and border colors.
   - **Dashboard** is fit onto a single A4 portrait page; **Location / Timeline** onto a single A4 landscape page. Other screens are scaled to the page width.
   - **Timeline** prints exactly the range currently shown on screen (scroll position preserved).
   - Dashboard keeps the on-screen two-column layout (Calendar + Active Tasks).
   - Screen-only effects (shadows, blur) are removed when printing to avoid grey boxes around the header.
   - **Pedigree** is also fit onto a single A4 portrait page.
   - A **print timestamp** ("Printed: YYYY/MM/DD HH:MM") is automatically added at the bottom-right of every page.
   - Fixed a bug where long tables (Mice / Cages) left the first page blank; tables now start on page 1 and continue across pages.
   - **Location** never splits a room (heading + rack grid) across pages and scales so the first room fits on page 1; multiple rooms flow onto additional pages.
   - The page background colour is removed when printing, and **dark mode prints with the same light colours** as light mode.

---

## [v2.04] - 2026-10-14

### 🇯🇵 日本語

#### 🚀 改善点
1. **仔の登録時に母マウスのステータスを自動更新**
   - Mating タブで litter（仔）を登録すると、母マウス（Dam）のステータスが `Pregnant` の場合に自動で `Nursing` へ変更されるようにしました。
   - `Pregnant` 以外のステータスは変更しません。また、離乳済み（Weaned / Inactive）の litter を登録した場合も変更しません。

---

### 🇺🇸 English

#### 🚀 Improvements
1. **Automatic dam status update when pups are recorded:**
   - When a litter is saved from the Mating tab, the dam's status is automatically changed from `Pregnant` to `Nursing`.
   - Other statuses are left untouched, and saving a litter that is already Weaned / Inactive does not change the dam.

---

## [v2.03] - 2026-10-13

### 🇯🇵 日本語

#### 🚀 改善点
1. **Breeding Timeline の縦スクロール統一**
   - 左側のリスト（MOUSELINE / UNIT）と右側のガントチャートを1つのスクロールコンテナにまとめ、縦スクロールが連動するようにしました。
   - 左側リストは横スクロール時に左端へ固定され、列見出しとマウスラインのグループ見出しはスクロール中も上部に固定されます。

2. **コード品質の改善**
   - Timeline コンポーネントの lint エラー・警告（不要コード、未使用 import、`useEffect` の依存配列）をすべて解消しました。

---

### 🇺🇸 English

#### 🚀 Improvements
1. **Unified vertical scrolling in Breeding Timeline:**
   - The left list (MOUSELINE / UNIT) and the right Gantt chart now share a single scroll container, so vertical scrolling moves both together.
   - The left list stays pinned to the left edge during horizontal scrolling, and the column header and mouseline group headers stay pinned to the top.

2. **Code quality:**
   - Resolved all lint errors and warnings in the Timeline component (dead code, unused imports, `useEffect` dependencies).

---

## [v2.02] - 2026-09-23

### 🇯🇵 日本語

#### 🚀 新機能 & 改善点
1. **マウス一覧（Mice）からのクイック交配（Add Mating）**
   - マウス一覧テーブルでのチェックボックス選択時に、一括操作バー（Bulk Actions）へ「**Add Mating**」ボタンを追加しました。
   - ♂1匹と♀1匹を選択している場合、Apple Blueでボタンが強調され、`♂[Tag] × ♀[Tag]` のバッジが表示されます。
   - クリックすると、父親（Sire）・母親（Dam）・系統（Line）・本日の開始日・母親の現在の収容ケージが自動入力された状態で交配追加モーダルが即座に起動します。
   - ♂または♀のみを選択している場合は、青背景なしのシンプルなゴーストボタンとして表示されます。

2. **交配追加（Add Mating）における親マウス選択の強化**
   - **ケージ番号（Location）表示**: 父親・母親の選択ドロップダウンの候補リストに、各マウスが現在収容されているケージ番号（例: `Cage: B-02`）を表示するようにしました。
   - **ケージ番号でのインクリメンタル検索**: IDやTagだけでなく、ケージ番号を入力しても即座に対象マウスを絞り込めるようになりました。
   - **候補の適切なフィルタリング（Stock / Matingのみ）**: 交配可能な親マウスとして、ステータスが `Stock`（待機中）または `Mating`（交配中）のマウスのみを選択肢に表示し、実験中（Experiment）や授乳中（Nursing）、妊娠中（Pregnant）、離乳直後のマウスの誤選択を防止しました。

3. **Locationビュー（ラック/ケージ配置）の視認性改善**
   - **Experiment（実験中）ケージ**: 枠線をパープル（`#8b5cf6`）の2px実線、背景を淡いパープル（`rgba(139, 92, 246, 0.08)`）に設定し、他の通常ケージと溶け込まず一目で視認できるようにしました。
   - **Pregnant（妊娠中）ケージ**: 枠線を Nursing と共通のオリーブグリーン（`#84cc16`）、背景を透過（カード標準背景）に変更し、授乳中（Nursing）との統一感を保ちつつ状態を識別可能にしました。
   - **ステータス凡例（Legend）**: 繁殖のライフステージの流れに沿って、並び順を `Mating → Pregnant → Nursing` に更新しました。

---

### 🇺🇸 English

#### 🚀 Features & Enhancements
1. **Quick "Add Mating" from Mice Table:**
   - Added an **"Add Mating"** button to the bulk action bar when selecting mice in the Mice table.
   - When exactly one male (♂) and one female (♀) are selected, the button is highlighted in Apple Blue with a dynamic `♂[Tag] × ♀[Tag]` badge.
   - Clicking opens the Add Mating modal with Sire, Dam, Mouseline, Start Date, and Dam's current cage automatically pre-filled.
   - When only a male or female is selected, it renders in a subtle ghost style without blue background.

2. **Enhanced Parent Mouse Selection in Add Mating Modal:**
   - **Cage Location Display:** Added the current cage number (e.g., `Cage: B-02`) directly next to each mouse in the Sire and Dam candidate dropdown lists.
   - **Incremental Search by Cage:** Search input now matches cage numbers in addition to Mouse ID and Tag.
   - **Streamlined Candidate Filtering (Stock & Mating only):** Dropdowns now strictly display available parent candidates (`Stock` and `Mating` statuses), preventing accidental selection of experimental, pregnant, or nursing mice.

3. **Cage Status Visibility in Location View (Rack Grid):**
   - **Experiment Cages:** Features a distinctive 2px purple border (`#8b5cf6`) and a subtle purple background tint (`rgba(139, 92, 246, 0.08)`), making active experiment cages stand out at a glance while preserving UI harmony.
   - **Pregnant Cages:** Updated to an olive green border (`#84cc16`, matching Nursing) with a transparent background.
   - **Status Legend:** Re-ordered legend indicators to follow natural reproductive progression: `Mating → Pregnant → Nursing`.

---

## [v2.0.1] - 2026-09-12

- **Full Colony Data Excel Export (.xlsx):** Added a one-click export feature in the Help modal to download all registered colony data (Mice, Cages, Matings, Litters, Rooms, Mouselines) as a single Excel workbook (.xlsx).
- **Cage Occupant Inspection Popup in Location:** Clicking any cage in the Location view now displays an interactive modal showing comprehensive details of all occupant mice.
- **Unregistered Pups Count Badge in Location:** Cages containing nursing litters with unregistered pups now display a clean badge (e.g. "+8 pups") directly on the rack grid.
- **Automatic Parent Status Reversion upon Weaning:** When litters are weaned, parent mice (Sire/Dam) that are no longer part of any other active matings are automatically transitioned from "Mating" back to "Stock" status.
- **Robust Sticky Footer Across All Tabs:** Re-engineered layout containers across all tabs to ensure the footer consistently anchors to the bottom of the viewport.
- **UI & Navigation Enhancements:** Direct shortcut button from Cage Label Printing modal to Global Settings, unified Help guide typography, and streamlined footer actions.

---

## [v2.00] - 2026-09-09

- **Apple HIG Design System Renewal:** Completely unified the interface following macOS and iOS Human Interface Guidelines.
- **macOS Sheet-Style Modal Windows:** Redesigned all modal popups with native macOS sheet layouts, traffic-light close controls, and clear action bars.
- **Original Biological Mouse Icon & Life-Stage Hierarchy:** Redesigned adult mouse and pup icons with minimalistic line-art styling.
- **Optimized Header Dropdowns:** Elevated dropdowns above calendar/timeline layers.
- **Integrated Appearance Settings:** Moved theme toggle into Settings modal as segmented control.

---

## [v1.9.6] - 2026-09-09

- **Manage Navigation Dropdown:** 1-click access to specific views (Mice, Cages, Matings, Litters, Rooms & Racks, Mouseline).
- **Fixed Header & Table Scrolling:** Tables scroll within independent containers while search/action toolbars stay pinned.
- **Sticky Table Headers:** Table column headers remain visible during vertical scrolling.

---

## [v1.9.5] - 2026-08-20

- **Pedigree Popup in Mouse Edit:** Direct access to pedigree tree from mouse edit modal.
