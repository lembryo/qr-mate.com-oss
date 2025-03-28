import { Dispatch, FC, ReactElement, SetStateAction, useRef, useState } from "react"

import Config from "../../Types/Config.ts"
import QRCodeStyling, { DotType, Options } from "qr-code-styling"

type QrGenerateProps = {
    config: Config
    setConfig: Dispatch<SetStateAction<Config>>
}

const QrGenerate: FC<QrGenerateProps> = (props: QrGenerateProps): ReactElement => {

    const [qr, setQr] = useState<QRCodeStyling | null>(null)
    const [options, setOptions] = useState<Options>({
        data: data,
        width: 256,
        height: 256,
        margin: 10
    })
    const [image, setImage] = useState<string>("")
    const [size, setSize] = useState<number>(256)
    const [margin, setMargin] = useState<number>(10)

    const [dotsOptionsType, setDotsOptionsType] = useState<DotType>("square")
    const [dotsOptionsGradient, setDotsOptionsGradient] = useState<boolean>(false)
    const [dotsOptionsColor, setDotsOptionsColor] = useState<string>("#000000")
    const [dotsOptionsColor1, setDotsOptionsColor1] = useState<string>("#000000")
    const [dotsOptionsColor2, setDotsOptionsColor2] = useState<string>("#000000")
    const [dotsOptionsGradientType, setDotsOptionsGradientType] = useState<"linear" | "radial">("radial")
    const [dotsOptionsGradientRotation, setDotsOptionsGradientRotation] = useState<number>(0)

    const [cornersSquareOptionsType, setCornersSquareOptionsType] = useState<"dot" | "extra-rounded" | "square">("square")
    const [cornersSquareOptionsColor, setCornersSquareOptionsColor] = useState<string>("#000000")
    const [cornersSquareOptionsGradient, setCornersSquareOptionsGradient] = useState<boolean>(false)
    const [cornersSquareOptionsGradientType, setCornersSquareOptionsGradientType] = useState<"linear" | "radial">("radial")
    const [cornersSquareOptionsColor1, setCornersSquareOptionsColor1] = useState<string>("#000000")
    const [cornersSquareOptionsColor2, setCornersSquareOptionsColor2] = useState<string>("#000000")
    const [cornersSquareOptionsGradientRotation, setCornersSquareOptionsGradientRotation] = useState<number>(0)

    const [cornersDotOptionsType, setCornersDotOptionsType] = useState<"dot" | "square">("square")
    const [cornersDotOptionsColor, setCornersDotOptionsColor] = useState<string>("#000000")
    const [cornersDotOptionsGradient, setCornersDotOptionsGradient] = useState<boolean>(false)
    const [cornersDotOptionsGradientType, setCornersDotOptionsGradientType] = useState<"linear" | "radial">("radial")
    const [cornersDotOptionsGradientColor1, setCornersDotOptionsGradientColor1] = useState<string>("#000000")
    const [cornersDotOptionsGradientColor2, setCornersDotOptionsGradientColor2] = useState<string>("#000000")
    const [cornersDotOptionsGradientRotation, setCornersDotOptionsGradientRotation] = useState<number>(0)

    const [backgroundOptionsColor, setBackgroundOptionsColor] = useState<string>("#FFFFFF")
    const [backgroundOptionsGradient, setBackgroundOptionsGradient] = useState<boolean>(false)
    const [backgroundOptionsGradientType, setBackgroundOptionsGradientType] = useState<"linear" | "radial">("radial")
    const [backgroundOptionsGradientColor1, setBackgroundOptionsGradientColor1] = useState<string>("#FFFFFF")
    const [backgroundOptionsGradientColor2, setBackgroundOptionsGradientColor2] = useState<string>("#FFFFFF")
    const [backgroundOptionsGradientRotation, setBackgroundOptionsGradientRotation] = useState<number>(0)

    const ref = useRef<HTMLDivElement>(null)
    const toast = useToast()

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

    const fileWrite = (): void => {

    }

    useEffect(() => {
        if (ref.current) {
            const styling: QRCodeStyling = new QRCodeStyling(options)
            styling.append(ref.current)
            setQr(styling)
        }
    }, [])

    useEffect(() => {
        qr?.update(options)
    }, [options])

    useEffect(() => {
        setOptions({
            ...options,
            data: data
        })
    }, [data])

    useEffect(() => {
        setOptions({
            ...options,
            width: size,
            height: size
        })
    }, [size])

    useEffect(() => {
        setOptions({
            ...options,
            margin: margin
        })
    }, [margin])

    useEffect(() => {
        setOptions({
            ...options,
            image: image,
            imageOptions: {
                hideBackgroundDots: false,
                imageSize: 0.5,
                margin: 2,
                crossOrigin: "anonymous"
            }
        })
    }, [image])

    useEffect(() => {
        const gradient = dotsOptionsGradient ? {
            type: dotsOptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: dotsOptionsColor1
                },
                {
                    offset: 1,
                    color: dotsOptionsColor2
                }
            ],
            rotation: (dotsOptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            dotsOptions: {
                type: dotsOptionsType,
                color: dotsOptionsColor,
                gradient: gradient
            }
        })
    }, [dotsOptionsType, dotsOptionsGradient, dotsOptionsColor, dotsOptionsColor1, dotsOptionsColor2, dotsOptionsGradientType, dotsOptionsGradientRotation])

    useEffect(() => {
        const gradient = cornersSquareOptionsGradient ? {
            type: cornersSquareOptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: cornersSquareOptionsColor1
                },
                {
                    offset: 1,
                    color: cornersSquareOptionsColor2
                }
            ],
            rotation: (cornersSquareOptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            cornersSquareOptions: {
                type: cornersSquareOptionsType,
                color: cornersSquareOptionsColor,
                gradient: gradient
            }
        })
    }, [cornersSquareOptionsType, cornersSquareOptionsGradient, cornersSquareOptionsColor, cornersSquareOptionsColor1, cornersSquareOptionsColor2, cornersSquareOptionsGradientType, cornersSquareOptionsGradientRotation])

    useEffect(() => {
        const gradient = cornersDotOptionsGradient ? {
            type: cornersDotOptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: cornersDotOptionsGradientColor1
                },
                {
                    offset: 1,
                    color: cornersDotOptionsGradientColor2
                }
            ],
            rotation: (cornersDotOptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            cornersDotOptions: {
                type: cornersDotOptionsType,
                color: cornersDotOptionsColor,
                gradient: gradient
            }
        })
    }, [cornersDotOptionsType, cornersDotOptionsGradient, cornersDotOptionsColor, cornersDotOptionsGradientColor1, cornersDotOptionsGradientColor2, cornersDotOptionsGradientType, cornersDotOptionsGradientRotation])

    useEffect(() => {
        const gradient = backgroundOptionsGradient ? {
            type: backgroundOptionsGradientType,
            colorStops: [
                {
                    offset: 0,
                    color: backgroundOptionsGradientColor1
                },
                {
                    offset: 1,
                    color: backgroundOptionsGradientColor2
                }
            ],
            rotation: (backgroundOptionsGradientRotation * Math.PI) / 180
        } : undefined
        setOptions({
            ...options,
            backgroundOptions: {
                color: backgroundOptionsColor,
                gradient: gradient
            }
        })
    }, [backgroundOptionsGradientType, backgroundOptionsGradient, backgroundOptionsColor, backgroundOptionsGradientColor1, backgroundOptionsGradientColor2, backgroundOptionsGradientRotation])

    return <>
        QR生成
    </>
}

export default QrGenerate
