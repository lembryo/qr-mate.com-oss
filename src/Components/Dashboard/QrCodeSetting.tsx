import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from "react"
import { InputGroup, Tab, Tabs } from "react-bootstrap"
import QRCodeStyling, { Options } from "qr-code-styling"

import DotsOptionsComponent from "./Options/DotsOptions.tsx"
import useDotsOptions from "../../Types/useDotsOptions.ts"

import CornersSquareOptionsComponent from "./Options/CornersSquareOptionsComponent.tsx"
import useCornersSquareOptions from "../../Types/useCornersSquareOptions.ts"

import CornersDotOptionsComponent from "./Options/CornersDotOptionsComponent.tsx"
import useCornersDotOptions from "../../Types/useCornersDotOptions.ts"

import useBackgroundOptions from "../../Types/useBackgroundOptions.ts"
import BackgroundOptionsComponent from "./Options/BackgroundOptionsComponent.tsx"

import QrCodeData from "../../Types/QrCodeData.ts"

type QrGenerateProps = {
    options: Options
    setOptions: Dispatch<SetStateAction<Options>>
    data: QrCodeData[]
    setData: Dispatch<SetStateAction<QrCodeData[]>>
}

const QrCodeSetting: FC<QrGenerateProps> = (props: QrGenerateProps): ReactElement => {

    // QRコード全体用のOptions
    const {
        options,
        setOptions
    } = props

    // 各カスタムフックを呼び出して状態を取得
    const { dotsOptions, updateDotsOptions } = useDotsOptions()
    const { cornersSquareOptions, updateCornersSquareOptions } = useCornersSquareOptions()
    const { cornersDotOptions, updateCornersDotOptions } = useCornersDotOptions()
    const { backgroundOptions, updateBackgroundOptions } = useBackgroundOptions()
    const [image, setImage] = useState<string>()
    const [size, setSize] = useState<number>(256)
    const [margin, setMargin] = useState<number>(10)

    // QRCodeStylingのインスタンス
    const qrRef = useRef<QRCodeStyling | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 初期描画
    useEffect((): void => {
        if (!qrRef.current && containerRef.current) {
            qrRef.current = new QRCodeStyling(options)
            qrRef.current.append(containerRef.current)
        }
    }, [containerRef, options])

    // optionsが変わったら更新
    useEffect((): void => {
        qrRef.current?.update(options)
    }, [options])

    // dotsOptionsが変わったら、optionsに反映
    useEffect((): void => {
        setOptions((prev: Options): Options => ({
            ...prev,
            dotsOptions: {
                type: dotsOptions.type,
                // 単色 or グラデーション
                color: dotsOptions.gradient ? undefined : dotsOptions.color,
                gradient: dotsOptions.gradient
                    ? {
                        type: dotsOptions.gradientType,
                        rotation: (dotsOptions.gradientRotation * Math.PI) / 180,
                        colorStops: [
                            { offset: 0, color: dotsOptions.color1 },
                            { offset: 1, color: dotsOptions.color2 }
                        ]
                    }
                    : undefined
            }
        }))
    }, [dotsOptions])

    // cornersSquareOptionsが変わったら反映
    useEffect((): void => {
        setOptions((options: Options): Options => ({
            ...options,
            cornersSquareOptions: {
                type: cornersSquareOptions.type,
                color: cornersSquareOptions.gradient ? undefined : cornersSquareOptions.color,
                gradient: cornersSquareOptions.gradient
                    ? {
                        type: cornersSquareOptions.gradientType,
                        rotation: (cornersSquareOptions.gradientRotation * Math.PI) / 180,
                        colorStops: [
                            { offset: 0, color: cornersSquareOptions.color1 },
                            { offset: 1, color: cornersSquareOptions.color2 }
                        ]
                    }
                    : undefined
            }
        }))
    }, [cornersSquareOptions])

    // cornersDotOptionsが変わったら反映
    useEffect((): void => {
        setOptions((options: Options): Options => ({
            ...options,
            cornersDotOptions: {
                type: cornersDotOptions.type,
                color: cornersDotOptions.gradient ? undefined : cornersDotOptions.color,
                gradient: cornersDotOptions.gradient
                    ? {
                        type: cornersDotOptions.gradientType,
                        rotation: (cornersDotOptions.gradientRotation * Math.PI) / 180,
                        colorStops: [
                            { offset: 0, color: cornersDotOptions.color1 },
                            { offset: 1, color: cornersDotOptions.color2 }
                        ]
                    }
                    : undefined
            }
        }))
    }, [cornersDotOptions])

    // backgroundOptionsが変わったら反映
    useEffect((): void => {
        setOptions((options: Options): Options => ({
            ...options,
            backgroundOptions: {
                color: backgroundOptions.gradient ? undefined : backgroundOptions.color,
                gradient: backgroundOptions.gradient
                    ? {
                        type: backgroundOptions.gradientType,
                        rotation: (backgroundOptions.gradientRotation * Math.PI) / 180,
                        colorStops: [
                            { offset: 0, color: backgroundOptions.color1 },
                            { offset: 1, color: backgroundOptions.color2 }
                        ]
                    }
                    : undefined
            }
        }))
    }, [backgroundOptions])

    useEffect((): void => {
        setOptions({
            ...options,
            image: image,
            imageOptions: image ? {
                hideBackgroundDots: false,
                imageSize: 0.5,
                margin: 2,
                crossOrigin: "anonymous"
            } : {}
        })
    }, [image])

    useEffect((): void => {
        setOptions({
            ...options,
            width: size,
            height: size
        })
    }, [size])

    useEffect((): void => {
        setOptions({
            ...options,
            margin: margin
        })
    }, [margin])

    const fileUpload = (files: FileList | null): void => {
        if (files && files.length > 0) {
            const file: File = files[0]
            const reader: FileReader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (): void => {
                const image = reader.result?.toString() || ""
                setImage(image)
            }
        }
    }

    return (
        <div className="d-flex">
            {/* 左側: QRコードと中央画像設定 */}
            <div className="mt-2">
                <div style={{ width: 256, marginRight: 20 }}>
                    {/* QRコード本体 */}
                    <div ref={containerRef} />

                    <InputGroup className="mb-2 w-100">
                        {/* 中央画像選択ボタン */}
                        <button
                            className="btn btn-outline-primary form-control w-75"
                            onClick={(): void => {
                                const file: HTMLElement | null = document.getElementById("file")
                                if (file) {
                                    file.click()
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faImage} />
                            <span>
                                画像設定
                            </span>
                        </button>

                        {/* 画像の削除ボタン */}
                        <button
                            className="btn btn-outline-primary form-control"
                            disabled={!image}
                            onClick={(): void => {
                                setImage(undefined)
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </InputGroup>
                    <input
                        id="file"
                        type="file"
                        accept="image/*"
                        style={{
                            display: "none"
                        }}
                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                            fileUpload(event.target.files)
                        }}
                    />
                </div>
            </div>

            {/* 右側: オプション設定 */}
            <div className="mt-2">
                {/* 画像サイズやマージンの設定 */}
                <div className="d-flex mb-2">
                    <div className="form-floating w-50">
                        <input
                            className="form-control"
                            type="number"
                            id="size"
                            value={size}
                            min={64}
                            max={1024}
                            step={16}
                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                setSize(parseInt(event.target.value))
                            }}
                            required={true}
                        />
                        <label htmlFor="size">
                            QRコード画像のサイズ
                        </label>
                    </div>
                    <div className="form-floating w-50">
                        <input
                            className="form-control"
                            type="number"
                            id="size"
                            value={margin}
                            min={0}
                            max={64}
                            step={4}
                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                setMargin(parseInt(event.target.value))
                            }}
                            required={true}
                        />
                        <label htmlFor="size">
                            QR画像の周囲余白
                        </label>
                    </div>
                </div>

                {/* カスタム設定 */}
                <Tabs
                    defaultActiveKey="dots"
                    className="mb-2"
                >
                    <Tab eventKey="dots" title="点の形状" defaultChecked={true}>
                        <DotsOptionsComponent
                            dotsOptions={dotsOptions}
                            updateDotsOptions={updateDotsOptions}
                        />
                    </Tab>
                    <Tab eventKey="corners-square" title="四隅の四角">
                        <CornersSquareOptionsComponent
                            cornersSquareOptions={cornersSquareOptions}
                            updateCornersSquareOptions={updateCornersSquareOptions}
                        />
                    </Tab>
                    <Tab eventKey="corners-dots" title="四隅の点">
                        <CornersDotOptionsComponent
                            cornersDotOptions={cornersDotOptions}
                            updateCornersDotOptions={updateCornersDotOptions}
                        />
                    </Tab>
                    <Tab eventKey="background" title="背景">
                        <BackgroundOptionsComponent
                            backgroundOptions={backgroundOptions}
                            updateBackgroundOptions={updateBackgroundOptions}
                        />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default QrCodeSetting
