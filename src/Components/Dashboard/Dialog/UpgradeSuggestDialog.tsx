import { Dispatch, FC, ReactElement, SetStateAction } from "react"
import { Button, Modal } from "react-bootstrap"
import { open } from "@tauri-apps/plugin-shell"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare, faEnvelope } from "@fortawesome/free-solid-svg-icons"

type UpgradeSuggestDialogProps = {
    isShow: boolean
    setIsShow: Dispatch<SetStateAction<boolean>>
}

const UpgradeSuggestDialog: FC<UpgradeSuggestDialogProps> = (props: UpgradeSuggestDialogProps): ReactElement => {

    const {
        isShow,
        setIsShow
    } = props

    return <>
        <Modal
            show={isShow}
            onHide={(): void => {
                setIsShow(false)
            }}
            centered
            size="lg"
            style={{
                zIndex: 10050
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>製品版へのアップグレード</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* 製品版のメリットをアピール */}
                <div className="text-center">
                    <div className="m-2">
                        <img
                            src="/logo.png"
                            alt="QR Mate"
                            style={{
                                width: "100%"
                            }}
                        />
                    </div>
                    <div className="m-2">
                        <h5>🧩 製品版 QR Mate のご紹介</h5>
                        <div className="text-start">
                            <div>ご利用中のQR Mateはオープンソース版（OSS）です。</div>
                            <div>製品版では、業務用途に特化した以下の機能がご利用いただけます</div>
                        </div>
                        <div className="text-start">
                            <div className="m-2">
                                ✅ プロジェクト履歴管理機能
                            </div>
                            <div className="ms-4 me-2">
                                QRコードの生成履歴や読み取り履歴を記録します
                            </div>
                        </div>
                        <div className="text-start">
                            <div className="m-2">
                                ✅ QRコードZIP圧縮保存機能
                            </div>
                            <div className="ms-4 me-2">
                                大量出力時のファイル管理を効率化します。
                            </div>
                        </div>
                        <div className="text-start">
                            <div className="m-2">
                                ✅ リアルタイムカメラ読み取り機能
                            </div>
                            <div className="ms-4 me-2">
                                PCに接続したカメラからQRコードを連続スキャン可能。
                            </div>
                        </div>
                        <div className="text-start">
                            <div className="m-2">
                                🔒 完全オフライン対応
                            </div>
                            <div className="ms-4 me-2">
                                インターネット不要で、セキュリティを重視する法人利用に最適です。
                            </div>
                        </div>
                        <div className="text-start">
                            <div className="m-2">
                                📦 製品版はソースコード・権利付きでご提供可能です。
                            </div>
                            <div className="ms-4 me-2">
                                詳細は開発元までお問い合わせください。
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="info"
                    onClick={(): void => {
                        // メールアプリを開く
                        open("mailto:mao.lembryo@gmail.com")
                            .then((): void => {
                            })
                    }}
                >
                    <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                    <span>
                        メール
                    </span>
                </Button>
                <Button
                    variant="success"
                    onClick={(): void => {
                        // 製品版ページへ誘導する
                        open("https://qr-mate.com/upgrade")
                            .then((): void => {
                            })
                    }}
                >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-1" />
                    <span>
                        QR Mate 詳細
                    </span>
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default UpgradeSuggestDialog
