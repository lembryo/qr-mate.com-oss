import "bootswatch/dist/lux/bootstrap.min.css"
import "./styles.css"

import { FC, ReactElement, Suspense } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import "bootstrap"

const App: FC = (): ReactElement => {

    const router = createBrowserRouter([
        {
            path: `/`,
            Component(): ReactElement {
                return <>
                    <Outlet />
                </>
            },
            errorElement: <></>,
            children: [
                {
                    path: `/`,
                    element: <Suspense fallback={<></>} children={<>Hello</>} />
                }
            ]
        }
    ])

    return <>
        <RouterProvider router={router} />
    </>
}

export default App
