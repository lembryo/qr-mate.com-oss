import React from "react"
import { createRoot } from "react-dom/client"

import Routing from "./Routing.tsx"

const root: HTMLElement | null = document.getElementById("root")

if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <Routing />
        </React.StrictMode>
    )
}
