import { writeFile } from "@tauri-apps/plugin-fs"
import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useState } from "react"
import { Button, Modal, ProgressBar } from "react-bootstrap"
import QRCodeStyling, { Options } from "qr-code-styling"

import QrCodeData from "../../../Types/QrCodeData.ts"
import { useToast } from "../../../Provider/ToastProvider.tsx"

type QrExportDialogProps = {
    isShow: boolean
    setIsShow: Dispatch<SetStateAction<boolean>>
    qrCodeData: QrCodeData[]
    options: Options
    directory: string
}

/**
 * QRコードリストをひとつひとつファイル出力するエクスポートダイアログ
 */
const QrCodeExportDialog: FC<QrExportDialogProps> = (props: QrExportDialogProps): ReactElement => {

    const {
        isShow,
        setIsShow,
        qrCodeData,
        options,
        directory
    } = props

    const [isExporting, setIsExporting] = useState(false) // エクスポート中かどうか
    const [currentIndex, setCurrentIndex] = useState(0)   // 何件目まで出力完了したか

    const toast = useToast()

    useEffect(() => {
        if (isShow) {
            // モーダルが表示されたときに初期化
            handleStartExport()
        }
    }, [isShow])

    useEffect((): void => {
        if (currentIndex >= qrCodeData.length) {
            // エクスポートが完了したとき
            setIsExporting(false)
            setCurrentIndex(0)
            setIsShow(false)
        }
    }, [currentIndex])

    // エクスポート開始ボタン押下時
    const handleStartExport = (): void => {
        setCurrentIndex(0)
        setIsExporting(true)

        qrCodeData.forEach((qrCode: QrCodeData): void => {
            const data = {
                ...options,
                data: qrCode.url
            }
            const styling: QRCodeStyling = new QRCodeStyling(data)
            styling.getRawData("png")
                .then((blob: Blob | Buffer<ArrayBufferLike> | null): void => {
                    if (!blob) {
                        return
                    }
                    "arrayBuffer" in blob && blob.arrayBuffer()
                        .then((buffer: ArrayBuffer): void => {
                            const bytes = new Uint8Array(buffer)
                            const file = `${directory}/${qrCode.filename}.png`
                            writeFile(file, bytes)
                                .catch((message: string): void => {
                                    // エクスポート失敗時の処理
                                    toast({
                                        title: "エクスポート失敗",
                                        body: message,
                                        type: "error"
                                    })
                                })
                                .finally((): void => {
                                    setCurrentIndex((prevIndex: number): number => {
                                        return prevIndex + 1
                                    })
                                })
                        })
                        .catch((message): void => {
                            // エクスポート失敗時の処理
                            toast({
                                title: "エクスポート失敗",
                                body: message.toString(),
                                type: "error"
                            })
                            setCurrentIndex((prevIndex: number): number => {
                                return prevIndex + 1
                            })
                        })
                })
                .catch((_: Error): void => {
                    setCurrentIndex((prevIndex: number): number => {
                        return prevIndex + 1
                    })
                })
        })
    }

    // 進捗(0〜100%)を計算
    const progressPercent: number = qrCodeData.length === 0
        ? 0
        : Math.floor((currentIndex / qrCodeData.length) * 100)

    return <>
        {/* モーダル (エクスポートの進捗表示) */}
        <Modal
            show={isShow}
            onHide={(): void => {
                setIsShow(false)
            }}
            backdrop="static" // モーダルの外をクリックしても閉じない
            keyboard={false}  // Escキーでも閉じない
            centered          // 画面中央揃え
        >
            <Modal.Header>
                <Modal.Title>QRコード出力</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {
                    isExporting ? <>
                        <div className="text-center">
                            <div>エクスポート中です。しばらくお待ちください。</div>
                            <div>
                                {
                                    `${currentIndex.toLocaleString()} / ${qrCodeData.length.toLocaleString()} 件 出力完了`
                                }
                            </div>
                        </div>
                        <ProgressBar
                            now={progressPercent}
                            label={`${progressPercent}%`}
                            striped
                            style={{
                                height: "30px",
                                marginTop: "10px"
                            }}
                        />
                    </> : <>
                        {/* エクスポートが終わった後の表示 */}
                        <div className="text-center">
                            <div>エクスポートが完了しました。</div>
                            <div>
                                {
                                    `${currentIndex.toLocaleString()} 件出力完了`
                                }
                            </div>
                        </div>
                        <div className="text-end">
                            <Button
                                variant="secondary"
                                onClick={(): void => {
                                    setIsShow(false)
                                }}
                            >
                                閉じる
                            </Button>
                        </div>
                    </>
                }
            </Modal.Body>
        </Modal>
    </>
}

export default QrCodeExportDialog
