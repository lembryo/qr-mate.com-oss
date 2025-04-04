import { Dispatch, FC, ReactElement, SetStateAction, useState } from "react"
import { Options } from "qr-code-styling"

import QrCodeSettingCenterImage from "./QrCodeSetting/QrCodeSettingCenterImage.tsx"
import QrCodeSettingPreview from "./QrCodeSetting/QrCodeSettingPreview.tsx"
import QrCodeSettingOptions from "./QrCodeSetting/QrCodeSettingOptions.tsx"


type QrGenerateProps = {
    activeTab: string
    options: Options
    setOptions: Dispatch<SetStateAction<Options>>
}

const QrCodeSetting: FC<QrGenerateProps> = (props: QrGenerateProps): ReactElement => {

    // QRコード全体用のOptions
    const {
        options,
        setOptions
    } = props

    const [image, setImage] = useState<string>()

    return <>
        <div className="d-flex" style={{
            maxWidth: "880px"
        }}>
            {/* 左側: QRコードと中央画像設定 */}
            <div className="mt-2">
                <QrCodeSettingPreview
                    options={options}
                />
                <QrCodeSettingCenterImage
                    image={image}
                    setImage={setImage}
                />
            </div>


            {/* 右側: オプション設定 */}
            <div className="mt-2">
                <QrCodeSettingOptions
                    options={options}
                    setOptions={setOptions}
                    image={image}
                    setImage={setImage}
                />
            </div>
        </div>
    </>
}

export default QrCodeSetting
