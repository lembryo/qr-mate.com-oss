import { FC, ReactElement, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Options } from "qr-code-styling"

import QrCodeSetting from "./QrCodeSetting.tsx"
import QrCodeList from "./QrCodeList.tsx"
import QrCodeReading from "./QrCodeReading.tsx"

const Index: FC = (): ReactElement => {

    const [options, setOptions] = useState<Options>({
        data: "https://qr-mate.com/oss",
        width: 256,
        height: 256,
        margin: 10
    })
    const [activeTab, setActiveTab] = useState<string>("qr-code-setting")

    return <>
        <Tabs
            defaultActiveKey="qr-code-setting"
            id="qr-code-tab"
            fill
            unmountOnExit={true}
            onSelect={(activeTab: string | null): void => {
                if (activeTab) {
                    setActiveTab(activeTab)
                }
            }}
        >
            <Tab eventKey="qr-code-setting" title="QRコード設定">
                <QrCodeSetting
                    activeTab={activeTab}
                    options={options}
                    setOptions={setOptions}
                />
            </Tab>
            <Tab eventKey="qr-code-list" title="QRコードリスト">
                <QrCodeList
                    activeTab={activeTab}
                    options={options}
                    setOptions={setOptions}
                />
            </Tab>
            <Tab eventKey="qr-code-reading" title="QRコード読み込み">
                <QrCodeReading
                    activeTab={activeTab}
                    options={options}
                    setOptions={setOptions}
                />
            </Tab>
        </Tabs>
    </>
}

export default Index
