import { faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import QRCodeStyling, { DotType, Options } from "qr-code-styling"

type QrGenerateProps = {
    options: Options
    setOptions: Dispatch<SetStateAction<Options>>
}

const QrGenerate: FC<QrGenerateProps> = (props: QrGenerateProps): ReactElement => {

    const {
        options,
        setOptions
    } = props

    const [qr, setQr] = useState<QRCodeStyling | null>(null)
    const [image, setImage] = useState<string>("")
    const [size, setSize] = useState<number>(256)
    const [margin, setMargin] = useState<number>(10)

    const [dotsoptionsType, setDotsoptionsType] = useState<DotType>("square")
    const [dotsoptionsGradient, setDotsoptionsGradient] = useState<boolean>(false)
    const [dotsoptionsColor, setDotsoptionsColor] = useState<string>("#000000")
    const [dotsoptionsColor1, setDotsoptionsColor1] = useState<string>("#000000")
    const [dotsoptionsColor2, setDotsoptionsColor2] = useState<string>("#000000")
    const [dotsoptionsGradientType, setDotsoptionsGradientType] = useState<"linear" | "radial">("radial")
    const [dotsoptionsGradientRotation, setDotsoptionsGradientRotation] = useState<number>(0)

    const [cornersSquareoptionsType, setCornersSquareoptionsType] = useState<"dot" | "extra-rounded" | "square">("square")
    const [cornersSquareoptionsColor, setCornersSquareoptionsColor] = useState<string>("#000000")
    const [cornersSquareoptionsGradient, setCornersSquareoptionsGradient] = useState<boolean>(false)
    const [cornersSquareoptionsGradientType, setCornersSquareoptionsGradientType] = useState<"linear" | "radial">("radial")
    const [cornersSquareoptionsColor1, setCornersSquareoptionsColor1] = useState<string>("#000000")
    const [cornersSquareoptionsColor2, setCornersSquareoptionsColor2] = useState<string>("#000000")
    const [cornersSquareoptionsGradientRotation, setCornersSquareoptionsGradientRotation] = useState<number>(0)

    const [cornersDotoptionsType, setCornersDotoptionsType] = useState<"dot" | "square">("square")
    const [cornersDotoptionsColor, setCornersDotoptionsColor] = useState<string>("#000000")
    const [cornersDotoptionsGradient, setCornersDotoptionsGradient] = useState<boolean>(false)
    const [cornersDotoptionsGradientType, setCornersDotoptionsGradientType] = useState<"linear" | "radial">("radial")
    const [cornersDotoptionsGradientColor1, setCornersDotoptionsGradientColor1] = useState<string>("#000000")
    const [cornersDotoptionsGradientColor2, setCornersDotoptionsGradientColor2] = useState<string>("#000000")
    const [cornersDotoptionsGradientRotation, setCornersDotoptionsGradientRotation] = useState<number>(0)

    const [backgroundoptionsColor, setBackgroundoptionsColor] = useState<string>("#FFFFFF")
    const [backgroundoptionsGradient, setBackgroundoptionsGradient] = useState<boolean>(false)
    const [backgroundoptionsGradientType, setBackgroundoptionsGradientType] = useState<"linear" | "radial">("radial")
    const [backgroundoptionsGradientColor1, setBackgroundoptionsGradientColor1] = useState<string>("#FFFFFF")
    const [backgroundoptionsGradientColor2, setBackgroundoptionsGradientColor2] = useState<string>("#FFFFFF")
    const [backgroundoptionsGradientRotation, setBackgroundoptionsGradientRotation] = useState<number>(0)

    const ref = useRef<HTMLDivElement>(null)

    useEffect((): void => {
        if (ref.current && !qr) {
            const styling: QRCodeStyling = new QRCodeStyling(options)
            styling.append(ref.current)
            setQr(styling)
        }
    }, [])

    useEffect((): void => {
        qr?.update(options)
    }, [options])

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

    useEffect((): void => {
        setOptions({
            ...options,
            image: image,
            imageoptions: {
                hideBackgroundDots: false,
                imageSize: 0.5,
                margin: 2,
                crossOrigin: "anonymous"
            }
        })
    }, [image])

    useEffect((): void => {
        const gradient = dotsoptionsGradient ? {
            type: dotsoptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: dotsoptionsColor1
                },
                {
                    offset: 1,
                    color: dotsoptionsColor2
                }
            ],
            rotation: (dotsoptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            dotsoptions: {
                type: dotsoptionsType,
                color: dotsoptionsColor,
                gradient: gradient
            }
        })
    }, [dotsoptionsType, dotsoptionsGradient, dotsoptionsColor, dotsoptionsColor1, dotsoptionsColor2, dotsoptionsGradientType, dotsoptionsGradientRotation])

    useEffect((): void => {
        const gradient = cornersSquareoptionsGradient ? {
            type: cornersSquareoptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: cornersSquareoptionsColor1
                },
                {
                    offset: 1,
                    color: cornersSquareoptionsColor2
                }
            ],
            rotation: (cornersSquareoptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            cornersSquareoptions: {
                type: cornersSquareoptionsType,
                color: cornersSquareoptionsColor,
                gradient: gradient
            }
        })
    }, [cornersSquareoptionsType, cornersSquareoptionsGradient, cornersSquareoptionsColor, cornersSquareoptionsColor1, cornersSquareoptionsColor2, cornersSquareoptionsGradientType, cornersSquareoptionsGradientRotation])

    useEffect((): void => {
        const gradient = cornersDotoptionsGradient ? {
            type: cornersDotoptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: cornersDotoptionsGradientColor1
                },
                {
                    offset: 1,
                    color: cornersDotoptionsGradientColor2
                }
            ],
            rotation: (cornersDotoptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            cornersDotoptions: {
                type: cornersDotoptionsType,
                color: cornersDotoptionsColor,
                gradient: gradient
            }
        })
    }, [cornersDotoptionsType, cornersDotoptionsGradient, cornersDotoptionsColor, cornersDotoptionsGradientColor1, cornersDotoptionsGradientColor2, cornersDotoptionsGradientType, cornersDotoptionsGradientRotation])

    useEffect((): void => {
        const gradient = backgroundoptionsGradient ? {
            type: backgroundoptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: backgroundoptionsGradientColor1
                },
                {
                    offset: 1,
                    color: backgroundoptionsGradientColor2
                }
            ],
            rotation: (backgroundoptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            backgroundoptions: {
                color: backgroundoptionsColor,
                gradient: gradient
            }
        })
    }, [backgroundoptionsGradientType, backgroundoptionsGradient, backgroundoptionsColor, backgroundoptionsGradientColor1, backgroundoptionsGradientColor2, backgroundoptionsGradientRotation])

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

    return <>
        <div className="mt-2">
            <div className="d-flex">
                <div style={{
                    width: "288px"
                }}>
                    <div ref={ref} className="mx-2" style={{
                        height: "256px"
                    }}></div>
                    <div className="d-flex mx-2" style={{
                        maxWidth: `${size}px`
                    }}>
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={(): void => {
                                const file: HTMLElement | null = document.getElementById("file")
                                if (file) {
                                    file.click()
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faImage} />
                            <span>
                               QR真ん中の画像を設定
                            </span>
                        </button>
                    </div>
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
                <div>
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
                                QR画像サイズ
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
                                余白
                            </label>
                        </div>
                    </div>
                    <Tabs
                        defaultActiveKey="dots"
                        className="mb-2"
                    >
                        <Tab eventKey="dots" title="点の形状">
                            <select
                                className="form-control"
                                value={dotsoptionsType}
                                onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                                    setDotsoptionsType(event.target.value as DotType)
                                }}
                            >
                                <option value="rounded">丸み</option>
                                <option value="dots">ドット</option>
                                <option value="classy">クラシック</option>
                                <option value="classy-rounded">クラシックで更に丸み</option>
                                <option value="square">四角</option>
                                <option value="extra-rounded">特に丸く</option>
                            </select>
                            <div className="d-flex m-2">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="dots-color-gradient"
                                        checked={dotsoptionsGradient}
                                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                            setDotsoptionsGradient(event.target.checked)
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="dots-color-gradient">
                                        点の色のグラデーション
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex m-2">
                                {
                                    !dotsoptionsGradient ? <div className="d-flex">
                                        <input
                                            type="color"
                                            className="form-control form-control-color ms-2"
                                            id="dots-color"
                                            value={dotsoptionsColor}
                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                setDotsoptionsColor(event.target.value)
                                            }}
                                        />
                                        <label htmlFor="dots-color" className="form-label">
                                            点の色（単色）
                                        </label>
                                    </div> : <div>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="dots-color-1"
                                                    value={dotsoptionsColor1}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setDotsoptionsColor1(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="dots-color-1" className="form-label">
                                                    点の色 (1)
                                                </label>
                                            </div>
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="dots-color-2"
                                                    value={dotsoptionsColor2}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setDotsoptionsColor2(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="dots-color-2" className="form-label">
                                                    点の色 (2)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="dots-color-gradient-type"
                                                    checked={dotsoptionsGradientType === "linear"}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setDotsoptionsGradientType(event.target.checked ? "linear" : "radial")
                                                    }}
                                                />
                                                <label className="form-check-label"
                                                       htmlFor="dots-color-gradient-type">
                                                    グラデーションを線形にする
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            dotsoptionsGradientType === "linear" ? <>
                                                <div className="d-flex m-2">
                                                    <div>
                                                        <label htmlFor="dots-color-gradient-rotation"
                                                               className="form-label">
                                                            グラデーションの角度
                                                        </label>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            id="dots-color-gradient-rotation"
                                                            min="0"
                                                            max="360"
                                                            value={dotsoptionsGradientRotation}
                                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                                setDotsoptionsGradientRotation(parseInt(event.target.value))
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        {
                                                            dotsoptionsGradientRotation
                                                        }
                                                    </div>
                                                </div>
                                            </> : <></>
                                        }
                                    </div>
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="corners-square" title="四隅の四角">
                            <select
                                className="form-control"
                                value={cornersSquareoptionsType}
                                onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                                    setCornersSquareoptionsType(event.target.value as "dot" | "extra-rounded" | "square")
                                }}
                            >
                                <option value="dot">ドット</option>
                                <option value="extra-rounded">特に丸く</option>
                                <option value="square">四角</option>
                            </select>
                            <div className="d-flex m-2">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="corners-square-color-gradient"
                                        checked={cornersSquareoptionsGradient}
                                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                            setCornersSquareoptionsGradient(event.target.checked)
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="corners-square-color-gradient">
                                        四隅の四角の色のグラデーション
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex m-2">
                                {
                                    !cornersSquareoptionsGradient ? <div className="d-flex">
                                        <input
                                            type="color"
                                            className="form-control form-control-color ms-2"
                                            id="dots-color"
                                            value={cornersSquareoptionsColor}
                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                setCornersSquareoptionsColor(event.target.value)
                                            }}
                                        />
                                        <label htmlFor="dots-color" className="form-label">
                                            四角の色（単色）
                                        </label>
                                    </div> : <div>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="dots-color-1"
                                                    value={cornersSquareoptionsColor1}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersSquareoptionsColor1(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="dots-color-1" className="form-label">
                                                    四角の色 (1)
                                                </label>
                                            </div>
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="dots-color-2"
                                                    value={cornersSquareoptionsColor2}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersSquareoptionsColor2(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="dots-color-2" className="form-label">
                                                    四角の色 (2)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="dots-color-gradient-type"
                                                    checked={cornersSquareoptionsGradientType === "linear"}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersSquareoptionsGradientType(event.target.checked ? "linear" : "radial")
                                                    }}
                                                />
                                                <label className="form-check-label"
                                                       htmlFor="dots-color-gradient-type">
                                                    クラデーションを線形にする
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            cornersSquareoptionsGradientType === "linear" ? <>
                                                <div className="d-flex m-2">
                                                    <div>
                                                        <label htmlFor="dots-color-gradient-rotation"
                                                               className="form-label">
                                                            グラデーションの角度
                                                        </label>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            id="dots-color-gradient-rotation"
                                                            min="0"
                                                            max="360"
                                                            value={cornersSquareoptionsGradientRotation}
                                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                                setCornersSquareoptionsGradientRotation(parseInt(event.target.value))
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        {
                                                            cornersSquareoptionsGradientRotation
                                                        }
                                                    </div>
                                                </div>
                                            </> : <></>
                                        }
                                    </div>
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="corners-dots" title="四隅の点">
                            <select
                                className="form-control"
                                value={cornersDotoptionsType}
                                onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                                    setCornersDotoptionsType(event.target.value as "dot" | "square")
                                }}
                            >
                                <option value="dot">ドット</option>
                                <option value="square">四角</option>
                            </select>
                            <div className="d-flex m-2">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="dots-color-gradient"
                                        checked={cornersDotoptionsGradient}
                                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                            setCornersDotoptionsGradient(event.target.checked)
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="dots-color-gradient">
                                        四隅の点の色のグラデーション
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex m-2">
                                {
                                    !cornersDotoptionsGradient ? <div className="d-flex">
                                        <input
                                            type="color"
                                            className="form-control form-control-color ms-2"
                                            id="corners-dots-color"
                                            value={cornersDotoptionsColor}
                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                setCornersDotoptionsColor(event.target.value)
                                            }}
                                        />
                                        <label htmlFor="corners-dots-color" className="form-label">
                                            四隅の点の色（単色）
                                        </label>
                                    </div> : <div>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="corners-dots-color-1"
                                                    value={cornersDotoptionsGradientColor1}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersDotoptionsGradientColor1(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="corners-dots-color-1" className="form-label">
                                                    四隅の点の色 (1)
                                                </label>
                                            </div>
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="corners-dots-color-2"
                                                    value={cornersDotoptionsGradientColor2}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersDotoptionsGradientColor2(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="corners-dots-color-2" className="form-label">
                                                    四隅の点の色 (2)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="corners-dots-color-gradient-type"
                                                    checked={cornersDotoptionsGradientType === "linear"}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setCornersDotoptionsGradientType(event.target.checked ? "linear" : "radial")
                                                    }}
                                                />
                                                <label className="form-check-label"
                                                       htmlFor="corners-dots-color-gradient-type">
                                                    クラデーションを線形にする
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            cornersDotoptionsGradientType === "linear" ? <>
                                                <div className="d-flex m-2">
                                                    <div>
                                                        <label htmlFor="corners-dots-color-gradient-rotation"
                                                               className="form-label">
                                                            グラデーションの角度
                                                        </label>
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            id="corners-dots-color-gradient-rotation"
                                                            min="0"
                                                            max="360"
                                                            value={cornersDotoptionsGradientRotation}
                                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                                setCornersDotoptionsGradientRotation(parseInt(event.target.value))
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        {
                                                            cornersDotoptionsGradientRotation
                                                        }
                                                    </div>
                                                </div>
                                            </> : <></>
                                        }
                                    </div>
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="background" title="背景">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="background-color-gradient"
                                    checked={backgroundoptionsGradient}
                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                        setBackgroundoptionsGradient(event.target.checked)
                                    }}
                                />
                                <label className="form-check-label" htmlFor="background-color-gradient">
                                    背景色のグラデーション
                                </label>
                            </div>
                            <div className="d-flex m-2">
                                {
                                    !backgroundoptionsGradient ? <>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="background-color"
                                                    value={backgroundoptionsColor}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setBackgroundoptionsColor(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="background-color" className="form-label">
                                                    背景色（単色）
                                                </label>
                                            </div>
                                        </div>
                                    </> : <div>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="background-color-1"
                                                    value={backgroundoptionsGradientColor1}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setBackgroundoptionsGradientColor1(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="background-color-1" className="form-label">
                                                    背景色 (1)
                                                </label>
                                            </div>
                                            <div className="d-flex">
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color ms-2"
                                                    id="background-color-2"
                                                    value={backgroundoptionsGradientColor2}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                        setBackgroundoptionsGradientColor2(event.target.value)
                                                    }}
                                                />
                                                <label htmlFor="background-color-2" className="form-label">
                                                    背景色 (2)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <div className="m-2">
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id="background-color-gradient-type"
                                                        checked={backgroundoptionsGradientType === "linear"}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                            setBackgroundoptionsGradientType(event.target.checked ? "linear" : "radial")
                                                        }}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor="background-color-gradient-type">
                                                        グラデーションを線形にする
                                                    </label>
                                                </div>
                                            </div>
                                            {
                                                backgroundoptionsGradientType === "linear" ? <>
                                                    <div className="d-flex m-2">
                                                        <div>
                                                            <label
                                                                htmlFor="background-dots-color-gradient-rotation"
                                                                className="form-label">
                                                                グラデーションの角度
                                                            </label>
                                                            <input
                                                                type="range"
                                                                className="form-range"
                                                                id="background-dots-color-gradient-rotation"
                                                                min="0"
                                                                max="360"
                                                                value={backgroundoptionsGradientRotation}
                                                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                                    setBackgroundoptionsGradientRotation(parseInt(event.target.value))
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            {
                                                                backgroundoptionsGradientRotation
                                                            }
                                                        </div>
                                                    </div>
                                                </> : <></>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </>
}

export default QrGenerate
