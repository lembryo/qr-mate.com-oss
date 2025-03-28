// useCornersDotOptions.ts
import { Dispatch, SetStateAction, useState } from "react"

/**
 * CornersDotOptions
 * 例:
 *   - type: "dot" | "square"
 *   - gradient: グラデーションを使うか
 *   - color: 単色時の色
 *   - color1, color2: グラデーションの開始色/終了色
 *   - gradientType: "linear" or "radial"
 *   - gradientRotation: グラデーション角度(0~360)
 */
export type CornersDotOptions = {
    type: "dot" | "square"
    gradient: boolean
    color: string
    color1: string
    color2: string
    gradientType: "linear" | "radial"
    gradientRotation: number
}

const useCornersDotOptions = (): {
    cornersDotOptions: CornersDotOptions
    setCornersDotOptions: Dispatch<SetStateAction<CornersDotOptions>>
    updateCornersDotOptions: (updates: Partial<CornersDotOptions>) => void
} => {

    const [cornersDotOptions, setCornersDotOptions] = useState<CornersDotOptions>({
        type: "square",
        gradient: false,
        color: "#000000",
        color1: "#000000",
        color2: "#000000",
        gradientType: "radial",
        gradientRotation: 0
    })

    const updateCornersDotOptions = (updates: Partial<CornersDotOptions>) => {
        setCornersDotOptions((prev) => ({ ...prev, ...updates }))
    }

    return {
        cornersDotOptions,
        setCornersDotOptions,
        updateCornersDotOptions
    }
}

export default useCornersDotOptions
