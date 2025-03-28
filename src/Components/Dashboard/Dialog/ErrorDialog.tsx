import { pictureDir } from "@tauri-apps/api/path"
import { open } from "@tauri-apps/plugin-dialog"
import { CSSProperties, Dispatch, FC, ReactElement, SetStateAction, useState } from "react"
import { Accordion, Button, Modal } from "react-bootstrap"

import QrCodeData from "../../../Types/QrCodeData.ts"
import QrCodeExportDialog from "./QrCodeExportDialog.tsx"
import { Options } from "qr-code-styling"

export type ErrorDialogRecord = {
    text: string
    style: CSSProperties
}

type ErrorDialogProps = {
    isShow: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    errors: ErrorDialogRecord[]
    qrCodeData: QrCodeData[]
    options: Options
}

/**
 * エラー一覧をモーダルで表示するダイアログ:
 *  - 先頭10件だけ表示 + '...'（折りたたまれた状態）をデフォルトに
 *  - 「すべて展開」ボタンで完全表示に切り替え可能
 *  - 見た目はReact Bootstrapのコンポーネントを組み合わせて装飾
 */
const ErrorDialog: FC<ErrorDialogProps> = (props: ErrorDialogProps): ReactElement => {

    const {
        isShow,
        setShow,
        errors,
        qrCodeData,
        options
    } = props

    // 「折りたたむ or 全部見る」トグル
    const [showAll, setShowAll] = useState<boolean>(false)
    const [isQrCodeExportDialogShow, setIsQrCodeExportDialogShow] = useState<boolean>(false)
    const [directory, setDirectory] = useState<string>("")

    // エラーが無ければダイアログ自体を出さない
    if (!errors || errors.length === 0) {
        return <></>
    }

    const displayedErrors: ErrorDialogRecord[] = showAll
        ? errors
        : errors.length > 10
            ? [...errors.slice(0, 10), { text: "...", style: { color: "gray" } }]
            : errors

    const close = (): void => {
        setShow(false)
    }

    const save = (): void => {
        pictureDir()
            .then((directory: string): void => {
                open({
                    directory: true,
                    defaultPath: directory,
                })
                    .then((directory: string | null): void => {
                        if (!directory) {
                            return
                        }
                        setDirectory(directory)
                        if (qrCodeData.length > 0) {
                            setIsQrCodeExportDialogShow(true)
                        }
                    })
            })
        close()
    }

    return <>
        <Modal
            show={isShow}
            onHide={close}
            size="lg"
            centered
            style={{
                zIndex: 10050
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>エラーが発生しました</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-muted">
                    下記の通り、合計 {errors.length.toLocaleString()} 件のエラーがあります。
                </p>
                {/* Accordion でエラー表示全体を囲む */}
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            エラー詳細を展開
                        </Accordion.Header>
                        <Accordion.Body>
                            {/* エラー一覧 */}
                            {
                                displayedErrors.map((error: ErrorDialogRecord, index: number): ReactElement => {
                                    return <div key={index} style={error.style ?? {}}>
                                        {index + 1}. {error.text}
                                    </div>
                                })
                            }
                            {
                                errors.length > 10 && (
                                    <div className="mt-2">
                                        {
                                            !showAll ? <>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={(): void => {
                                                        setShowAll(true)
                                                    }}
                                                >
                                                    すべて表示 ({errors.length.toLocaleString()} 件)
                                                </Button>
                                            </> : <>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={(): void => {
                                                        setShowAll(false)
                                                    }}
                                                >
                                                    先頭10件だけ表示
                                                </Button>
                                            </>
                                        }
                                    </div>
                                )
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={(): void => {
                        save()
                    }}
                >
                    {
                        `問題のない ${props.qrCodeData.length.toLocaleString()} 件のQRコードを作成`
                    }
                </Button>
            </Modal.Footer>
        </Modal>

        {/* QRコードエクスポートダイアログ */}
        <QrCodeExportDialog
            isShow={isQrCodeExportDialogShow}
            setIsShow={setIsQrCodeExportDialogShow}
            qrCodeData={qrCodeData}
            options={options}
            directory={directory}
        />
    </>
}

export default ErrorDialog
