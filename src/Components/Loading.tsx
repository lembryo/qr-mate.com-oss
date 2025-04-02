import { Theme } from "@tauri-apps/api/window"
import { FC, ReactElement } from "react"

interface LoadingProps {
    theme?: Theme | undefined
}

const Loading: FC<LoadingProps> = (props: LoadingProps): ReactElement => {

    const { theme } = props

    return <>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
            backgroundColor: theme === "dark" ? "#FFFFFF20" : "#00000020",
            zIndex: 1001
        }}>
            <div className="text-center position-absolute top-50 start-50 w-100 translate-middle">
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
                <div className="text-muted">Loading...</div>
            </div>
        </div>
    </>
}

export default Loading
