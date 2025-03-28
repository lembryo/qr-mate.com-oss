import { FC, ReactElement, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"

import QrGenerate from "./QrGenerate.tsx"
import Qr from "../../Types/Qr.ts"
import Config from "../../Types/Config.ts"

const Index: FC = (): ReactElement => {

    const [qrs, setQrs] = useState<Qr[]>([])
    const [config, setConfig] = useState<Config>({})

    return <>
        <Tabs
            defaultActiveKey="generate"
            id="qr-code-tab"
            fill
        >
            <Tab eventKey="generate" title="QR生成">
                <QrGenerate
                    config={config}
                    setConfig={setConfig}
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
