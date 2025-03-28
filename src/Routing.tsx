import "bootswatch/dist/cosmo/bootstrap.min.css"
import "./styles.css"

import { Theme } from "@tauri-apps/api/window"
import { FC, ReactElement, Suspense, useEffect, useState } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import "bootstrap"

import Loading from "./Components/Loading.tsx"
import Dashboard from "./Components/Dashboard/Index.tsx"
import { ToastProvider } from "./Provider/ToastProvider.tsx"
import SideBar from "./Components/SideBar.tsx"
import Project from "./Types/Project.ts"

const Routing: FC = (): ReactElement => {

    const [theme] = useState<Theme>("light")
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {

        // ブラウザ標準のキー操作を無効化してPCアプリのように動作するようにする
        const onkeydown = (e: KeyboardEvent): void => {
            // Ctrl＋S
            if (e.ctrlKey && e.code === "KeyS") {
                e.preventDefault()
            }
            // Ctrl＋F
            if (e.ctrlKey && e.code === "KeyF") {
                e.preventDefault()
            }
            // Esc
            if (e.code === "Escape") {
                e.preventDefault()
            }
            // ブラウザのデフォルトの動作を色々禁止する
            if (e.code === "F1" ||
                e.code === "F2" ||
                e.code === "F3" ||
                e.code === "F3" ||
                e.code === "F5" ||
                e.code === "F5" ||
                e.code === "F6" ||
                e.code === "F7" ||
                e.code === "F8" ||
                e.code === "F9" ||
                e.code === "F10" ||
                e.code === "F11" ||
                e.code === "F12" ||
                (e.ctrlKey && e.code === "KeyR") ||
                (e.ctrlKey && e.code === "KeyS") ||
                (e.ctrlKey && e.code === "KeyF")
            ) {
                e.preventDefault()
            }
            // 終了
            if (e.altKey && e.code === "F4") {
                // Alt+F4はそのままでいい
                // e.preventDefault()
            }
        }

        // 右クリックのコンテキストメニューを無効化
        const oncontextmenu = (): boolean => {
            return false
        }

        window.addEventListener("keydown", onkeydown)
        window.addEventListener("contextmenu", oncontextmenu)

        return (): void => {
            window.removeEventListener("keydown", onkeydown)
            window.removeEventListener("contextmenu", oncontextmenu)
        }
    }, [])

    const router = createBrowserRouter([
        {
            path: "/",
            Component(): ReactElement {
                return <>
                    <ToastProvider>
                        <SideBar theme={theme} projects={projects} />
                        <main className="main" data-bs-theme={theme}>
                            <Outlet />
                        </main>
                    </ToastProvider>
                </>
            },
            errorElement: <></>,
            children: [
                {
                    path: "/",
                    element: <Suspense fallback={<Loading theme={theme} />} children={<Dashboard />} />
                }
            ]
        }
    ])

    return <>
        <RouterProvider router={router} />
    </>
}

export default Routing
