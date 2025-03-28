import { FC, ReactElement, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Options } from "qr-code-styling"

import QrGenerate from "./QrGenerate.tsx"

const Index: FC = (): ReactElement => {

    const [options, setOptions] = useState<Options>({
        data: "https://qr-mate.com/oss",
        width: 256,
        height: 256,
        margin: 10
    })

    return <>
        <Tabs
            defaultActiveKey="generate"
            id="qr-code-tab"
            fill
        >
            <Tab eventKey="generate" title="QR生成">
                <QrGenerate
                    options={options}
                    setOptions={setOptions}
                />
            </Tab>
            <Tab eventKey="list" title="生成リスト">
                生成リスト
            </Tab>
            <Tab eventKey="read" title="QR読み込み">
                QR読み込み
            </Tab>
        </Tabs>
    </>
}

export default Index
