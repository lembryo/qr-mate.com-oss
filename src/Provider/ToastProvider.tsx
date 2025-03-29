import React, { createContext, ReactElement, useContext, useState } from "react"
import { Toast as RBToast, ToastContainer } from "react-bootstrap"
import { createPortal } from "react-dom"

type ToastTypes = "success" | "error" | "warning" | "info"

export type ToastData = {
    type?: ToastTypes
    body: string | ReactElement
    title?: string
    subtitle?: string
    delay?: number
    img?: string
}

const ToastContext = createContext((_: ToastData): void => {
})

export const useToast = () => {
    return useContext(ToastContext)
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const [show, setShow] = useState(false)
    const [toastKey, setToastKey] = useState(0)

    const [type, setType] = useState<ToastTypes>("info")
    const [body, setBody] = useState<string | ReactElement>("")
    const [title, setTitle] = useState<string>("通知")
    const [subtitle, setSubtitle] = useState<string>("")
    const [delay, setDelay] = useState<number>(4000)
    const [img, setImg] = useState<string>()

    const showToast = (data: ToastData): void => {
        setToastKey(toastKey + 1)
        setType(data.type ?? "info")
        setBody(data.body)
        setTitle(data.title ?? "通知")
        setSubtitle(data.subtitle ?? "")
        setDelay(data.delay ?? 4000)
        setImg(data.img)
        setShow(true)
    }

    return <ToastContext.Provider value={showToast}>
        {children}

        {
            createPortal(
                <ToastContainer
                    position="top-center"
                    className="p-3"
                    style={{
                        zIndex: 99999
                    }}
                >
                    <RBToast
                        key={toastKey}
                        onClose={(): void => {
                            setShow(false)
                        }}
                        show={show}
                        delay={delay}
                        autohide
                    >
                        <RBToast.Header>
                            {
                                img && <img
                                    src={img}
                                    alt={title}
                                    className="rounded me-2"
                                    style={{ width: 20, height: 20 }}
                                />
                            }
                            <strong className={`me-auto text-${type}`}>
                                {
                                    title
                                }
                            </strong>
                            <small className={`text-${type}`}>
                                {
                                    subtitle
                                }
                            </small>
                        </RBToast.Header>
                        <RBToast.Body style={{ whiteSpace: "pre-wrap" }}>
                            {
                                body
                            }
                        </RBToast.Body>
                    </RBToast>
                </ToastContainer>,
                document.body
            )
        }
    </ToastContext.Provider>
}
