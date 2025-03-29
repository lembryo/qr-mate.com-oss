import { FC, ReactElement, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Options } from "qr-code-styling"

import QrCodeSetting from "./QrCodeSetting.tsx"
import QrCodeList from "./QrCodeList.tsx"
import QrCodeReading from "./QrCodeReading.tsx"
import QrCodeData from "../../Types/QrCodeData.ts"

const Index: FC = (): ReactElement => {

    const [options, setOptions] = useState<Options>({
        data: "https://qr-mate.com/oss",
        width: 256,
        height: 256,
        margin: 10
    })
    const [data, setData] = useState<QrCodeData[]>([])

    return <>
        <Tabs
            defaultActiveKey="qr-code-setting"
            id="qr-code-tab"
            fill
        >
            <Tab eventKey="qr-code-setting" title="QRコード設定">
                <QrCodeSetting
                    options={options}
                    setOptions={setOptions}
                    data={data}
                    setData={setData}
                />
            </Tab>
            <Tab eventKey="qr-code-list" title="QRコードリスト">
                <QrCodeList
                    options={options}
                    setOptions={setOptions}
                    data={data}
                    setData={setData}
                />
            </Tab>
            <Tab eventKey="qr-code-reading" title="QRコード読み込み">
                <QrCodeReading
                    options={options}
                    setOptions={setOptions}
                    data={data}
                    setData={setData}
                />
            </Tab>
        </Tabs>
    </>
}

export default Index
