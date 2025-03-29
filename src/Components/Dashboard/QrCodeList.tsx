import "handsontable/dist/handsontable.full.min.css"

import { documentDir, pictureDir } from "@tauri-apps/api/path"
import { open, save } from "@tauri-apps/plugin-dialog"
import Handsontable from "handsontable"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { Options } from "qr-code-styling"

import ErrorDialog, { ErrorDialogRecord } from "./Dialog/ErrorDialog.tsx"
import QrCodeExportDialog from "./Dialog/QrCodeExportDialog.tsx"
import QrCodeData from "../../Types/QrCodeData.ts"
import { writeFile } from "@tauri-apps/plugin-fs"
import { useToast } from "../../Provider/ToastProvider.tsx"

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
    data: QrCodeData[]
    setData: Dispatch<SetStateAction<QrCodeData[]>>
}

const QrCodeList = (props: QrCodeListProps) => {

    const {
        options,
        data,
        setData
    } = props

    const [handsontable, setHandsontable] = useState<Handsontable | null>(null)
    const [isErrorDialogShow, setIsErrorDialogShow] = useState<boolean>(false)
    const [isQrCodeExportDialogShow, setIsQrCodeExportDialogShow] = useState<boolean>(false)
    const [errors, setErrors] = useState<ErrorDialogRecord[]>([])
    const [qrCodeData, setQrCodeData] = useState<QrCodeData[]>([])
    const [directory, setDirectory] = useState<string>("")

    const handsontableRef = useRef<HTMLDivElement>(null)
    const toast = useToast()

    useEffect(() => {
        let handsontable: Handsontable | null = null
        if (handsontableRef.current) {
            handsontable = new Handsontable(handsontableRef.current, {
                afterChange(changes, source) {
                    if (changes && source !== "loadData") {
                        // 変更後のデータを取得し、Reactのstateを更新
                        const data = handsontable?.getData() || []
                        setData(data.map((row: string[]): QrCodeData => {
                            return {
                                filename: row[0],
                                url: row[1]
                            }
                        }))
                    }
                },
                // @ts-ignore
                afterDocumentKeyDown: (e: KeyboardEvent): void => {
                    // Enterキーでない場合は無視
                    if (e.key !== "Enter") return

                    const selection = handsontable?.getSelected()
                    if (!selection) return

                    // selection[0] は [startRow, startCol, endRow, endCol]
                    const [startRow, startCol] = selection[0]

                    const totalRows = handsontable?.countRows() || 0

                    // 「最終行」かをチェック
                    if (startRow === totalRows - 1) {
                        // 新しい行を末尾に追加
                        handsontable?.alter("insert_row", totalRows)

                        // 追加後、行数が1増えたので「totalRows」行目が新しい行
                        // フォーカスは "startCol"（もともとのカラム位置）へ移す
                        handsontable?.selectCell(totalRows, startCol)
                    }
                },
                autoColumnSize: true,
                autoWrapCol: true,
                autoWrapRow: true,
                bindRowsWithHeaders: false,
                data: [["", ""]],
                cells: () => {
                    const cellProperties = {
                        renderer: ""
                    }
                    cellProperties.renderer = "highlightNewLineRenderer"
                    return cellProperties
                },
                colHeaders: true,
                colWidths: [200, window.innerWidth - 450 - 5 * 2],
                columnSorting: true,
                // @ts-ignore
                contextMenu: {
                    items: {
                        cut: {
                            name: "切り取り"
                        },
                        copy: {
                            name: "コピー"
                        },
                        paste: {
                            name: "貼り付け"
                        },
                        sp: "---------",
                        row_above: {
                            name: "行を挿入"
                        },
                        remove_row: {
                            name: "行を削除"
                        }
                    }
                },
                fillHandle: true,
                filters: true,
                fixedRowsTop: 0,
                // @ts-ignore
                height: "100%",
                manualColumnResize: true,
                manualRowResize: true,
                manualColumnMove: true,
                manualRowMove: true,
                minCols: 2,
                minRows: 1,
                maxCols: 2,
                outsideClickDeselects: true,
                rowHeaderWidth: 50,
                // @ts-ignore
                rowHeaders: true,
                renderAllRows: false,
                search: false,
                trimRows: true,
                trimWhitespace: true,
                // @ts-ignore
                width: "100%",
                wordWrap: false
            })
            setHandsontable(handsontable)
        }

        return (): void => {
            handsontable?.destroy()
        }
    }, [])

    useEffect((): void => {
        if (!handsontable) {
            return
        }
        const loadData: any[][] = data.map((row: QrCodeData): string[] => {
            return [row.filename, row.url]
        })
        if (loadData.length > 0) {
            handsontable?.loadData(loadData)
        }
    }, [data])

    const check = (): void => {
        if (!handsontable) {
            return
        }

        const errors: ErrorDialogRecord[] = []
        const qrCodeData: QrCodeData[] = []

        const data: any[][] = handsontable.getData()
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

    const csv = (): void => {
        documentDir()
            .then((directory: string): void => {
                save({
                    filters: [
                        {
                            name: "CSV",
                            extensions: ["csv"]
                        }
                    ],
                    defaultPath: directory
                })
                    .then((filePath: string | null): void => {
                        if (!filePath) {
                            return
                        }

                        // CSVファイルのBOMを設定
                        const BOM = "\uFEFF"
                        // 行数・列数を取得
                        const rowCount: number = handsontable?.countRows() || 0
                        const colCount: number = handsontable?.countCols() || 0

                        // CSV文字列を組み立て
                        let text: string = BOM  // BOM付きで開始

                        for (let row: number = 0; row < rowCount; row++) {
                            // 1行分のセルを格納する配列
                            const rowArray: string[] = []
                            for (let col: number = 0; col < colCount; col++) {
                                // セルデータを取得
                                let value: string = handsontable?.getDataAtCell(row, col) || ""
                                // ダブルクオート " を "" にエスケープ
                                value = value.replace(/"/g, `""`)
                                // 必ずダブルクオートで括る
                                rowArray.push(`"${value}"`)
                            }
                            // カンマ区切りにして改行
                            text += rowArray.join(",") + "\r\n"
                        }

                        // CSVファイルとして保存
                        const bytes: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(text)
                        writeFile(filePath, bytes)
                            .then((): void => {
                                toast({
                                    title: "通知",
                                    body: "CSVファイルを保存しました"
                                })
                            })
                            .catch((): void => {
                                toast({
                                    title: "通知",
                                    body: "CSVファイルを保存できませんでした",
                                    type: "error"
                                })
                            })
                    })
            })
    }

    return <>
        <div ref={handsontableRef}
             style={{
                 width: "100vw",
                 height: `calc(100vh - 100px)`,
                 margin: "5px",
                 overflowY: "auto"
             }}
        >
        </div>

        {/* 画面右下に固定配置 */}
        <div style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "8px"
        }}>
            <button
                className="btn btn-secondary"
                onClick={(): void => {
                    csv()
                }}
            >
                CSV保存
            </button>
            <button
                className="btn btn-primary"
                onClick={(): void => {
                    check()
                }}
            >
                QRコード出力
            </button>
        </div>

        {/* QRコードエクスポートダイアログ */}
        <QrCodeExportDialog
            isShow={isQrCodeExportDialogShow}
            setIsShow={setIsQrCodeExportDialogShow}
            qrCodeData={qrCodeData}
            options={options}
            directory={directory}
        />

        {/* エラー表示ダイアログ */}
        <ErrorDialog
            isShow={isErrorDialogShow}
            setShow={setIsErrorDialogShow}
            errors={errors}
            qrCodeData={qrCodeData}
            options={options}
        />
    </>
}

export default QrCodeList
