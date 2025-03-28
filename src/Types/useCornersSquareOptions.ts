import { Dispatch, SetStateAction, useState } from "react"

/**
 * CornersSquareOptions
 * 例:
 *   - type: "dot" | "extra-rounded" | "square"
 *   - gradient: グラデーションを使うか
 *   - color: 単色時の色
 *   - color1, color2: グラデーションの開始色/終了色
 *   - gradientType: "linear" or "radial"
 *   - gradientRotation: グラデーション角度(0~360)
 */
export type CornersSquareOptions = {
    type: "dot" | "extra-rounded" | "square"
    gradient: boolean
    color: string
    color1: string
    color2: string
    gradientType: "linear" | "radial"
    gradientRotation: number
}

const useCornersSquareOptions = (): {
    cornersSquareOptions: CornersSquareOptions
    setCornersSquareOptions: Dispatch<SetStateAction<CornersSquareOptions>>
    updateCornersSquareOptions: (updates: Partial<CornersSquareOptions>) => void
} => {

    const [cornersSquareOptions, setCornersSquareOptions] = useState<CornersSquareOptions>({
        type: "square",
        gradient: false,
        color: "#000000",
        color1: "#000000",
        color2: "#000000",
        gradientType: "radial",
        gradientRotation: 0
    })

    const updateCornersSquareOptions = (updates: Partial<CornersSquareOptions>): void => {
        setCornersSquareOptions((prev) => ({ ...prev, ...updates }))
    }

    return {
        cornersSquareOptions,
        setCornersSquareOptions,
        updateCornersSquareOptions
    }
}
export default useCornersSquareOptions
