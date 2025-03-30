import { InputGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction } from "react"

type QrCodeSettingCenterImageProps = {
    image: string | undefined
    setImage: Dispatch<SetStateAction<string | undefined>>
}

const QrCodeSettingCenterImage: FC<QrCodeSettingCenterImageProps> = (props: QrCodeSettingCenterImageProps): ReactElement => {

    const {
        image,
        setImage
    } = props

    const fileUpload = (files: FileList | null): void => {
        if (files && files.length > 0) {
            const file: File = files[0]
            const reader: FileReader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (): void => {
                const image: string = reader.result?.toString() || ""
                setImage(image)
            }
        }
    }

    return <>
        <InputGroup className="mb-2 w-100">
            {/* 中央画像選択ボタン */}
            <button
                className="btn btn-outline-primary form-control w-75"
                onClick={(): void => {
                    const file: HTMLElement | null = document.getElementById("file")
                    if (file) {
                        file.click()
                    }
                }}
            >
                <FontAwesomeIcon icon={faImage} />
                <span>画像設定</span>
            </button>

            {/* 画像の削除ボタン */}
            <button
                className="btn btn-outline-primary form-control"
                disabled={!image}
                onClick={(): void => {
                    setImage(undefined)
                }}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </InputGroup>
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
    </>
}

export default QrCodeSettingCenterImage
