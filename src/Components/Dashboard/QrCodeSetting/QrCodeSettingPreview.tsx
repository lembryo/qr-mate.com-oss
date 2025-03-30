import { FC, ReactElement, useEffect, useRef } from "react"
import QRCodeStyling, { Options } from "qr-code-styling"

type QrCodeSettingPreviewProps = {
    options: Options
}

const QrCodeSettingPreview: FC<QrCodeSettingPreviewProps> = (props: QrCodeSettingPreviewProps): ReactElement => {

    const { options } = props

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

    return <>
        <div style={{ width: 256, marginRight: 20 }}>
            {/* QRコード本体 */}
            <div ref={containerRef} />
        </div>
    </>
}

export default QrCodeSettingPreview
