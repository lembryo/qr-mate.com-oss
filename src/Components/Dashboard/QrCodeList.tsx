import "handsontable/dist/handsontable.full.min.css"
import Handsontable from "handsontable"
import { Dispatch, SetStateAction } from "react"
import { Options } from "qr-code-styling"

import QrCodeListExportPngButton from "./QrCodeList/QrCodeListExportPngButton.tsx"
import QrCodeListExportCsvButton from "./QrCodeList/QrCodeListExportCsvButton.tsx"
import QrCodeListHandsontable from "./QrCodeList/QrCodeListHandsontable.tsx"
import { useData } from "../../Provider/DataProvider.tsx"

// @ts-ignore
const highlightNewLineRenderer = (handsontable: Handsontable, td, row, col, prop, value, cellProperties): void => {

    // まず既存のTextRendererを呼び出して、標準のテキスト描画を行う
    Handsontable.renderers.TextRenderer.call(
        this,
        handsontable,
        td,
        row,
        col,
        prop,
        value,
        cellProperties)

    // A列(0番目)とB列(1番目)の値を取得し、空白かどうかを判定
    const aVal: any = handsontable.getDataAtCell(row, 0) || ""
    const bVal: any = handsontable.getDataAtCell(row, 1) || ""
    const isAEmpty: boolean = aVal.trim() === ""
    const isBEmpty: boolean = bVal.trim() === ""
    const exactlyOneEmpty: boolean =
        (isAEmpty && !isBEmpty) || (!isAEmpty && isBEmpty)

    // A列 (col === 0) => ファイル名に使えない文字チェック
    if (col === 0 && typeof value === "string") {
        // Windows上でNGとされる文字例: \/:*?"<>|
        // 正規表現でチェック
        const forbiddenPattern = /[\\/:*?"<>|\r\n]/
        if (forbiddenPattern.test(value)) {
            // 薄い赤にする
            td.style.backgroundColor = "#FFCCCC"
        } else {
            // 問題なければクリア
            td.style.backgroundColor = ""
        }
    }

    // B列 (col === 1) => URL形式かどうかチェック
    else if (col === 1 && typeof value === "string") {
        // 簡易的なURL判定の例: プロトコル＋://＋何か文字列
        const urlPattern = /^https?:\/\/.+/i
        if (!urlPattern.test(value) && value.length > 0) {
            // 薄い黄色にする
            td.style.backgroundColor = "#FFCCCC"
        } else {
            td.style.backgroundColor = ""
        }
    }

    // 上記以外の背景色の設定
    // - 片方だけ空 => 薄い黄色 (#FFFFCC)
    if (exactlyOneEmpty) {
        td.style.backgroundColor = "#FFFFCC"
    }
}

// グローバルに登録
// @ts-ignore
Handsontable.renderers.registerRenderer("highlightNewLineRenderer", highlightNewLineRenderer)

type QrCodeListProps = {
    options: Options
    setOptions: Dispatch<SetStateAction<Options>>
}

const QrCodeList = (props: QrCodeListProps) => {

    const {
        options
    } = props
    const {
        data,
        setData
    } = useData()

    return <>
        <QrCodeListHandsontable
            data={data}
            setData={setData}
            style={{
                width: "100vw",
                height: "calc(100vh - 100px)",
                margin: "5px"
            }}
        />

        {/* 画面右下に固定配置 */}
        <div style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "8px"
        }}>
            <QrCodeListExportCsvButton data={data ?? [["", ""]]} />
            <QrCodeListExportPngButton options={options} />
        </div>
    </>
}

export default QrCodeList
