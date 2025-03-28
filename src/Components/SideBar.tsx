import { faQrcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Theme } from "@tauri-apps/api/window"
import { FC, ReactElement } from "react"
import { Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

type SideBarProps = {
    theme: Theme
}

const SideBar: FC<SideBarProps> = (props: SideBarProps): ReactElement => {

    const {
        theme
    } = props

    return <>
        <aside className="sidebar" data-bs-theme={theme}>
            <Nav className="flex-column">
                <Nav.Item className="border-bottom border-primary w-100">
                    <Nav.Link as={Link} to="/" className="w-100">
                        <div className="d-flex align-items-center ms-3 h-100">
                            <FontAwesomeIcon
                                icon={faQrcode}
                                size="xl"
                                className="text-body-secondary w-25"
                            />
                            <span className="text-body-secondary w-75">OSS版</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </aside>
    </>
}

export default SideBar
