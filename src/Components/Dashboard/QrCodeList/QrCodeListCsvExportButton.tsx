import { documentDir } from "@tauri-apps/api/path"
import { save } from "@tauri-apps/plugin-dialog"
import { writeFile } from "@tauri-apps/plugin-fs"

import { useToast } from "../../../Provider/ToastProvider.tsx"

type QrCodeListCsvExportButtonProps = {
    data: string[][]
}

const QrCodeListCsvExportButton = (props: QrCodeListCsvExportButtonProps) => {

    const { data } = props

    const toast = useToast()

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

                        // CSV文字列を組み立て
                        let text: string = "\uFEFF" // BOM付きで開始
                        data.forEach((row: string[]): void => {
                            if (!row) {
                                return
                            }
                            row.forEach((cell: string): void => {
                                // セルデータを取得
                                let value: string = cell || ""
                                // ダブルクオート " を "" にエスケープ
                                value = value.replace(/"/g, `""`)
                                // 必ずダブルクオートで括る
                                text += `"${value}",`
                            })
                            // 最後のカンマを削除して改行
                            text = text.slice(0, -1) + "\r\n"
                        })

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
        <button
            className="btn btn-secondary"
            onClick={(): void => {
                csv()
            }}
        >
            CSV保存
        </button>
    </>
}

export default QrCodeListCsvExportButton
