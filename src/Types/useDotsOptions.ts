import { Dispatch, SetStateAction, useState } from "react"
import { DotType } from "qr-code-styling"

/**
 * DotsOptions
 * 例:
 *   - type: "dot" | "extra-rounded" | "square"
 *   - gradient: グラデーションを使うか
 *   - color: 単色時の色
 *   - color1, color2: グラデーションの開始色/終了色
 *   - gradientType: "linear" or "radial"
 *   - gradientRotation: グラデーション角度(0~360)
 */
export type DotsOptions = {
    type: DotType
    gradient: boolean
    color: string
    color1: string
    color2: string
    gradientType: "linear" | "radial"
    gradientRotation: number
}

/**
 * 点の形状オプションをまとめて管理するカスタムフック
 */
const useDotsOptions = (): {
    dotsOptions: DotsOptions
    setDotsOptions: Dispatch<SetStateAction<DotsOptions>>
    updateDotsOptions: (updates: Partial<DotsOptions>) => void
} => {

    // まとめてuseState
    const [dotsOptions, setDotsOptions] = useState<DotsOptions>({
        type: "square",
        gradient: false,
        color: "#000000",
        color1: "#000000",
        color2: "#000000",
        gradientType: "radial",
        gradientRotation: 0
    })

    /**
     * 部分的に更新するためのヘルパー
     * 例: updateDotsOptions({ color1: "#ff0000" })
     */
    const updateDotsOptions = (updates: Partial<DotsOptions>): void => {
        setDotsOptions((prev) => ({
            ...prev,
            ...updates
        }))
    }

    return {
        dotsOptions,
        setDotsOptions,
        updateDotsOptions
    }
}

export default useDotsOptions
