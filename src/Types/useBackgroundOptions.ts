import { Dispatch, SetStateAction, useState } from "react"

/**
 * BackgroundOptions
 * 例:
 *   - type: "dot" | "extra-rounded" | "square"
 *   - gradient: グラデーションを使うか
 *   - color: 単色時の色
 *   - color1, color2: グラデーションの開始色/終了色
 *   - gradientType: "linear" or "radial"
 *   - gradientRotation: グラデーション角度(0~360)
 */
export type BackgroundOptions = {
    gradient: boolean
    color: string
    color1: string
    color2: string
    gradientType: "linear" | "radial"
    gradientRotation: number
}

const useBackgroundOptions = (): {
    backgroundOptions: BackgroundOptions
    setBackgroundOptions: Dispatch<SetStateAction<BackgroundOptions>>
    updateBackgroundOptions: (updates: Partial<BackgroundOptions>) => void
} => {

    // まとめてuseState
    const [backgroundOptions, setBackgroundOptions] = useState<BackgroundOptions>({
        gradient: false,
        color: "#FFFFFF",
        color1: "#FFFFFF",
        color2: "#FFFFFF",
        gradientType: "radial",
        gradientRotation: 0
    })

    const updateBackgroundOptions = (updates: Partial<BackgroundOptions>) => {
        setBackgroundOptions((prev) => ({ ...prev, ...updates }))
    }

    return {
        backgroundOptions,
        setBackgroundOptions,
        updateBackgroundOptions
    }
}

export default useBackgroundOptions
