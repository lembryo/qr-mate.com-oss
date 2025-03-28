import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useState } from "react"
import { Button, Modal, ProgressBar } from "react-bootstrap"
import { Options } from "qr-code-styling"

import QrCodeData from "../../../Types/QrCodeData.ts"

type QrExportDialogProps = {
    isShow: boolean
    setIsShow: Dispatch<SetStateAction<boolean>>
    qrCodeData: QrCodeData[]
    options: Options
}

/**
 * QRコードリストをひとつひとつファイル出力するエクスポートダイアログ
 */
const QrCodeExportDialog: FC<QrExportDialogProps> = (props: QrExportDialogProps): ReactElement => {

    const {
        isShow,
        setIsShow,
        qrCodeData
    } = props

    const [isExporting, setIsExporting] = useState(false) // エクスポート中かどうか
    const [currentIndex, setCurrentIndex] = useState(0)   // 何件目まで出力完了したか

    useEffect(() => {
        if (isShow) {
            // モーダルが表示されたときに初期化
            handleStartExport()
                .then(() => {
                })
        }
    }, [isShow])

    // エクスポート開始ボタン押下時
    const handleStartExport = async () => {
        setCurrentIndex(0)
        setIsExporting(true)

        // TODO: 実際のエクスポート処理を実装する
        try {
            // 全件ループしながら1件ずつファイル出力
            for (let i = 0; i < qrCodeData.length; i++) {
                console.log(i)
                await dummyWait(1 * 1000)

                // i番目の書き出し終了
                setCurrentIndex(i + 1)
            }
        } catch (error) {
            console.error("エクスポート中にエラー", error)
            // 必要ならユーザ通知など
        } finally {
            setIsExporting(false)
        }
    }

    // 閉じるボタン押下時
    const handleClose = (): void => {
        setIsShow(false)
    }

    // 進捗(0〜100)
    const progressPercent: number = qrCodeData.length === 0
        ? 0
        : Math.floor((currentIndex / qrCodeData.length) * 100)

    // 便宜的に非同期待機する関数 (デモ用)
    async function dummyWait(ms: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, ms))
    }

    return <>
        {/* モーダル (エクスポートの進捗表示) */}
        <Modal
            show={isShow}
            onHide={handleClose}
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
                            <Button variant="secondary" onClick={handleClose}>
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
