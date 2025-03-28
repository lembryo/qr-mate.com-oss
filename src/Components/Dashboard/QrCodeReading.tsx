import { listen } from "@tauri-apps/api/event"
import { readFile } from "@tauri-apps/plugin-fs"
import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import jsQR, { QRCode } from "jsqr"
import { Options } from "qr-code-styling"

import QrCodeData from "../../Types/QrCodeData.ts"

type QrCodeReadingProps = {
    options: Options
    setOptions: Dispatch<SetStateAction<Options>>
    data: QrCodeData[]
    setData: Dispatch<SetStateAction<QrCodeData[]>>
}

// 何としても初回のみ実行するためのフラグ
let initialize: boolean = false

const QrCodeReading: FC<QrCodeReadingProps> = (props: QrCodeReadingProps): ReactElement => {

    const {
        setData
    } = props

    const [isLoading, setIsLoading] = useState(false)
    const [qrCodeData, setQrCodeData] = useState<QrCodeData[]>([])

    const ref = useRef<HTMLInputElement>(null)

    useEffect((): void => {
        if (!initialize) {
            // Tauri v2 はブラウザ標準のドラッグ＆ドロップを使えないので Tauri v2 のAPIを使う
            listen("tauri://drag-drop", (event: any): void => {
                const paths: string[] = (event.payload as {
                    paths: string[]
                }).paths
                if (paths.length > 0) {
                    setIsLoading(true)
                    let count: number = 0
                    const qrCodeData: QrCodeData[] = []
                    paths.forEach((path: string): void => {
                        readFile(path)
                            .then((bytes: Uint8Array<ArrayBufferLike>): void => {
                                decodeQrFromRawData(bytes)
                                    .then((data: string | null): void => {
                                        // path からファイル名（拡張子なし）のみを取得（Windows セパレータ対応）
                                        const fileName: string = path.split(/[\\/]/).pop() || ""
                                        const fileNameWithoutExtension: string = fileName.split(".").slice(0, -1).join(".")
                                        if (data) {
                                            qrCodeData.push({
                                                filename: fileNameWithoutExtension,
                                                url: data
                                            })
                                        } else {
                                            qrCodeData.push({
                                                filename: fileNameWithoutExtension,
                                                url: "QRコードが読み取れませんでした..."
                                            })
                                        }
                                    })
                                    .finally((): void => {
                                        count += 1
                                        if (count === paths.length) {
                                            setIsLoading(false)
                                            setQrCodeData(qrCodeData)
                                        }
                                    })
                            })
                            .catch((): void => {
                                count += 1
                            })
                    })
                }
            })
                .then((): void => {
                })
        }
        initialize = true
    }, [])

    useEffect((): void => {
        setData((data: QrCodeData[]): QrCodeData[] => {
            return [...data, ...qrCodeData]
        })
    }, [qrCodeData])

    const files = (files: File[]): void => {
        setIsLoading(true)
        let count: number = 0
        const qrCodeData: QrCodeData[] = []
        for (let i: number = 0; i < files.length; i++) {
            // file から Uint8Array を生成する
            const file: File = files[i]
            const reader = new FileReader()
            reader.onload = (event): void => {
                const result: string | ArrayBuffer | null | undefined = event.target?.result
                if (result instanceof ArrayBuffer) {
                    const bytes = new Uint8Array(result)
                    decodeQrFromRawData(bytes)
                        .then((data: string | null): void => {
                            const fileName: string = file.name.split(/[\\/]/).pop() || ""
                            const fileNameWithoutExtension: string = fileName.split(".").slice(0, -1).join(".")
                            if (data) {
                                qrCodeData.push({
                                    filename: fileNameWithoutExtension,
                                    url: data
                                })
                            } else {
                                qrCodeData.push({
                                    filename: fileNameWithoutExtension,
                                    url: "QRコードが読み取れませんでした..."
                                })
                            }
                        })
                        .finally((): void => {
                            count += 1
                            if (count === files.length) {
                                setIsLoading(false)
                                setQrCodeData(qrCodeData)
                            }
                        })
                }
            }
            reader.onerror = (error): void => {
            }
            // ArrayBufferとして読み込む
            reader.readAsArrayBuffer(file)
        }
    }

    const decodeQrFromRawData = (
        data: Uint8Array
    ): Promise<string | null> => {
        return new Promise((resolve): void => {
            // 1. バイナリデータから Blob を作成
            const blob = new Blob([data])

            // 2. Blob を参照する一時的なオブジェクトURLを生成
            const dataUrl: string = URL.createObjectURL(blob)

            // 3. <img> を生成し、読み込み完了したらCanvasに描画して解析
            const image = new Image()
            image.onload = (): void => {
                // Canvasに描画
                const canvas: HTMLCanvasElement = document.createElement("canvas")
                canvas.width = image.width
                canvas.height = image.height

                const context: CanvasRenderingContext2D | null = canvas.getContext("2d")
                if (!context) {
                    URL.revokeObjectURL(dataUrl)
                    resolve(null)
                    return
                }
                context.drawImage(image, 0, 0, canvas.width, canvas.height)

                // ピクセルデータを jsQR で解析
                const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const code: QRCode | null = jsQR(imageData.data, canvas.width, canvas.height)

                // 後始末
                URL.revokeObjectURL(dataUrl)

                if (code) {
                    resolve(code.data) // QRコードの中身
                } else {
                    resolve(null) // 解析失敗
                }
            }
            image.onerror = (): void => {
                URL.revokeObjectURL(dataUrl)
                resolve(null)
            }
            image.src = dataUrl
        })
    }

    return <>
        <div className="m-2">
            <Card
                className="mb-3 p-3 text-center"
                onClick={(): void => {
                    ref?.current?.click()
                }}
                style={{
                    cursor: "pointer",
                    border: "2px dashed #aaa"
                }}
            >
                <input
                    ref={ref}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        files(event.currentTarget.files)
                    }}
                    style={{
                        display: "none"
                    }}
                />
                {
                    isLoading ? <>
                        <Spinner animation="border" role="status" />
                        <div className="mt-2">読み込み中...</div>
                    </> : <>
                        <h5>ここに画像ファイルをドラッグ＆ドロップ</h5>
                        <div className="text-muted">
                            またはクリックしてファイルを選択
                        </div>
                    </>
                }
            </Card>
        </div>

        <div className="text-center m-2">
            <Button
                variant="outline-secondary"
                onClick={(): void => {
                    setQrCodeData([])
                }}
                className="mb-3"
                disabled={qrCodeData.length === 0}
            >
                結果をクリア
            </Button>
        </div>

        <div className="text-center">
            <h5>読み取り結果:</h5>
            {
                qrCodeData.length === 0 ? <>
                    <div>まだ読み取っていません。</div>
                </> : <>
                    <div>
                        {
                            `${qrCodeData.length.toLocaleString()} 件のQRコードを読み取りました。`
                        }
                    </div>
                </>
            }
        </div>
    </>
}

export default QrCodeReading
