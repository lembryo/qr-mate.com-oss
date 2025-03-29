import { faAward } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Theme } from "@tauri-apps/api/window"
import { FC, ReactElement, useState } from "react"
import { Nav } from "react-bootstrap"

import UpgradeSuggestDialog from "./Dashboard/Dialog/UpgradeSuggestDialog.tsx"

type SideBarProps = {
    theme: Theme
}

const SideBar: FC<SideBarProps> = (props: SideBarProps): ReactElement => {

    const {
        theme
    } = props

    const [isUpgradeSuggestDialogShow, setIsUpgradeSuggestDialogShow] = useState<boolean>(false)

    return <>
        <aside className="sidebar" data-bs-theme={theme}>
            <Nav className="flex-column">
                <Nav.Item
                    className="border-bottom border-primary w-100"
                    onClick={(): void => {
                        setIsUpgradeSuggestDialogShow(true)
                    }}
                >
                    <Nav.Link className="w-100">
                        <div className="d-flex align-items-center ms-3 h-100">
                            <FontAwesomeIcon
                                icon={faAward}
                                size="xl"
                                className="text-body-secondary w-25"
                            />
                            <span className="text-body-secondary w-75">
                                製品版のご案内
                            </span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </aside>
        <UpgradeSuggestDialog
            isShow={isUpgradeSuggestDialogShow}
            setIsShow={setIsUpgradeSuggestDialogShow}
        />
    </>
}

export default SideBar
