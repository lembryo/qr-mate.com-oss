import "handsontable/dist/handsontable.full.min.css"

import { pictureDir } from "@tauri-apps/api/path"
import { open } from "@tauri-apps/plugin-dialog"
import Handsontable from "handsontable"
import { Dispatch, SetStateAction, useState } from "react"
import { Options } from "qr-code-styling"

import { ErrorDialogRecord } from "./Dialog/ErrorDialog.tsx"
import QrCodeData from "../../Types/QrCodeData.ts"
import QrCodeListHandsontable from "./QrCodeList/QrCodeListHandsontable.tsx"
import QrCodeListCsvExportButton from "./QrCodeList/QrCodeListCsvExportButton.tsx"

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

    // 2) A列(0番目)とB列(1番目)の値を取得し、空白かどうかを判定
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
    //   - 片方だけ空 => 薄い黄色 (#ffffcc)
    //   - 両方空 or 両方空でない => 背景色なし（白）
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
    data: string[][]
    setData: Dispatch<SetStateAction<string[][]>>
}

const QrCodeList = (props: QrCodeListProps) => {

    const {
        options,
        data,
        setData
    } = props

    const [isErrorDialogShow, setIsErrorDialogShow] = useState<boolean>(false)
    const [isQrCodeExportDialogShow, setIsQrCodeExportDialogShow] = useState<boolean>(false)
    const [errors, setErrors] = useState<ErrorDialogRecord[]>([])
    const [qrCodeData, setQrCodeData] = useState<QrCodeData[]>([])
    const [directory, setDirectory] = useState<string>("")

    const check = (): void => {
        const errors: ErrorDialogRecord[] = []
        const qrCodeData: QrCodeData[] = []

        // 空行を削除
        data.filter((row: string[]): boolean => {
            return row.some((cell: string): boolean => {
                return cell !== "" && cell !== null
            })
        }).forEach((row: string[], index: number): void => {
            // 1列目が空でない場合、2列目も空でないことを確認
            if (row[0] !== "" && row[1] === "") {
                errors.push({
                    text: `${(index + 1).toLocaleString()} 行目のURLが空です`,
                    style: {
                        backgroundColor: "#FFFFCC"
                    }
                })
                return
            }
            // 2列目が空でない場合、1列目も空でないことを確認
            else if (row[0] === "" && row[1] !== "") {
                errors.push({
                    text: `${(index + 1).toLocaleString()} 行目のファイル名が空です`,
                    style: {
                        backgroundColor: "#FFFFCC"
                    }
                })
                return
            }
            // 1列目が空でない場合、2列目もURL形式であることを確認
            if (row[0] !== "" && row[1] !== "") {
                const urlPattern = /^https?:\/\/.+/i
                if (!urlPattern.test(row[1])) {
                    errors.push({
                        text: `${(index + 1).toLocaleString()} 行目のURLが不正です`,
                        style: {
                            backgroundColor: "#FFCCCC"
                        }
                    })
                    return
                }
            }
            // 1列目が空でない場合、2列目もファイル名形式であることを確認
            if (row[0] !== "" && row[1] !== "") {
                const forbiddenPattern = /[\\/:*?"<>|\r\n]/
                if (forbiddenPattern.test(row[0])) {
                    errors.push({
                        text: `${(index + 1).toLocaleString()} 行目のファイル名が不正です`,
                        style: {
                            backgroundColor: "#FFCCCC"
                        }
                    })
                    return
                }
            }
            // 1列目の重複をチェック
            const duplicateRowIndex: number = data.findIndex((r: string[], i: number): boolean => {
                return i !== index && r[0] === row[0]
            })
            if (duplicateRowIndex !== -1) {
                errors.push({
                    text: `${(index + 1).toLocaleString()} 行目のファイル名が重複しています`,
                    style: {
                        backgroundColor: "#FFCCCC"
                    }
                })
                return
            }
            qrCodeData.push({
                filename: row[0],
                url: row[1]
            })
        })
        setErrors(errors)
        setQrCodeData(qrCodeData)
        if (errors.length > 0) {
            setIsErrorDialogShow(true)
        } else if (qrCodeData.length > 0) {
            pictureDir()
                .then((directory: string): void => {
                    open({
                        directory: true,
                        defaultPath: directory
                    })
                        .then((directory: string | null): void => {
                            if (!directory) {
                                return
                            }
                            setDirectory(directory)
                            if (qrCodeData.length > 0) {
                                setIsQrCodeExportDialogShow(true)
                            }
                        })
                })
        }
    }

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
            <QrCodeListCsvExportButton
                data={data}
            />
            <button
                className="btn btn-primary"
                onClick={(): void => {
                    check()
                }}
            >
                QRコード出力
            </button>
        </div>

        {/*/!* QRコードエクスポートダイアログ *!/*/}
        {/*<QrCodeExportDialog*/}
        {/*    isShow={isQrCodeExportDialogShow}*/}
        {/*    setIsShow={setIsQrCodeExportDialogShow}*/}
        {/*    qrCodeData={qrCodeData}*/}
        {/*    options={options}*/}
        {/*    directory={directory}*/}
        {/*/>*/}

        {/*/!* エラー表示ダイアログ *!/*/}
        {/*<ErrorDialog*/}
        {/*    isShow={isErrorDialogShow}*/}
        {/*    setShow={setIsErrorDialogShow}*/}
        {/*    errors={errors}*/}
        {/*    qrCodeData={qrCodeData}*/}
        {/*    options={options}*/}
        {/*/>*/}
    </>
}

export default QrCodeList
