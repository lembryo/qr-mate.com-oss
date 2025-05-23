import { CSSProperties, FC, ReactElement, useEffect, useRef, useState } from "react"
import Handsontable from "handsontable"

import { useData } from "../../../Provider/DataProvider.tsx"

type QrCodeListHandsontableProps = {
    style: CSSProperties
}

const QrCodeListHandsontable: FC<QrCodeListHandsontableProps> = (props: QrCodeListHandsontableProps): ReactElement => {

    const { style } = props
    const {
        data,
        setData
    } = useData()

    const [handsontable, setHandsontable] = useState<Handsontable | null>(null)

    const handsontableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (handsontableRef.current && !handsontable) {
            const instance: Handsontable = new Handsontable(handsontableRef.current, {
                afterChange(changes, source) {
                    if (changes && source !== "loadData") {
                        // 変更後のデータを取得し、Reactのstateを更新
                        const data = instance?.getData() || []
                        setData(data)
                    }
                },
                // @ts-ignore
                afterDocumentKeyDown: (e: KeyboardEvent): void => {
                    // Enterキーでない場合は無視
                    if (e.key !== "Enter") return

                    const selection = instance.getSelected()
                    if (!selection) return

                    // selection[0] は [startRow, startCol, endRow, endCol]
                    const [startRow, startCol] = selection[0]

                    const totalRows = instance.countRows() || 0

                    // 「最終行」かをチェック
                    if (startRow === totalRows - 1) {
                        // 新しい行を末尾に追加
                        instance.alter("insert_row", totalRows)

                        // 追加後、行数が1増えたので「totalRows」行目が新しい行
                        // フォーカスは "startCol"（もともとのカラム位置）へ移す
                        instance.selectCell(totalRows, startCol)
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
                colHeaders: [
                    "ファイル名",
                    "URL"
                ],
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
            setHandsontable(instance)
        }
    }, [])

    useEffect((): void => {
        if (data && data.length > 0 && handsontable) {
            handsontable.loadData([
                ...data
            ])
        }
    }, [handsontable, data])

    return <>
        <div ref={handsontableRef} style={style}></div>
    </>
}

export default QrCodeListHandsontable
