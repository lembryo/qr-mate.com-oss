import { Options } from "qr-code-styling"
import { FC, ReactElement, useState } from "react"
import { pictureDir } from "@tauri-apps/api/path"
import { open } from "@tauri-apps/plugin-dialog"

import QrCodeExportDialog from "../Dialog/QrCodeExportDialog.tsx"
import { useData } from "../../../Provider/DataProvider.tsx"
import ErrorDialog, { ErrorDialogRecord } from "../Dialog/ErrorDialog.tsx"
import QrCodeData from "../../../Types/QrCodeData.ts"

type QrCodeListExportPngButtonProps = {
    options: Options
}

const QrCodeListExportPngButton: FC<QrCodeListExportPngButtonProps> = (props: QrCodeListExportPngButtonProps): ReactElement => {

    const { options } = props
    const {
        data
    } = useData()

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
        <button
            className="btn btn-primary"
            onClick={(): void => {
                check()
            }}
        >
            QRコード出力
        </button>

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

export default QrCodeListExportPngButton
