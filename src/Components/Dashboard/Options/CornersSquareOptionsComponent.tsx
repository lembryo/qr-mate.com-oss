import { ChangeEvent, FC, ReactElement } from "react"

import { CornersSquareOptions } from "../../../Types/useCornersSquareOptions.ts"

type CornersSquareOptionsProps = {
    cornersSquareOptions: CornersSquareOptions
    updateCornersSquareOptions: (updates: Partial<CornersSquareOptions>) => void
}

const CornersSquareOptionsComponent: FC<CornersSquareOptionsProps> = (props: CornersSquareOptionsProps): ReactElement => {

    const {
        cornersSquareOptions,
        updateCornersSquareOptions
    } = props
    const {
        type,
        gradient,
        color,
        color1,
        color2,
        gradientType,
        gradientRotation
    } = cornersSquareOptions

    return <>
        {/* タイプ選択 */}
        <select
            className="form-control mb-2"
            value={type}
            onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                updateCornersSquareOptions({
                    type: e.target.value as typeof type
                })
            }}
        >
            <option value="dot">ドット</option>
            <option value="extra-rounded">特に丸く</option>
            <option value="square">四角</option>
        </select>

        {/* グラデーションON/OFF */}
        <div className="form-check form-switch mb-2">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="cornersSquareGradientSwitch"
                checked={gradient}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                    updateCornersSquareOptions({ gradient: e.target.checked })
                }}
            />
            <label className="form-check-label" htmlFor="cornersSquareGradientSwitch">
                四隅の四角の色のグラデーション
            </label>
        </div>

        {
            !gradient ? <>
                {/* 単色 */}
                <label className="form-label me-2">四隅の四角の色（単色）</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                        updateCornersSquareOptions({
                            color: e.target.value
                        })
                    }}
                />
            </> : <>
                {/* グラデーション */}
                <div className="mb-2">
                    <label className="form-label me-2">色 (1)</label>
                    <input
                        type="color"
                        value={color1}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersSquareOptions({
                                color1: e.target.value
                            })
                        }}
                    />
                    <label className="form-label ms-3 me-2">色 (2)</label>
                    <input
                        type="color"
                        value={color2}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersSquareOptions({
                                color2: e.target.value
                            })
                        }}
                    />
                </div>

                <div className="form-check form-switch mb-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="cornersSquareGradientTypeSwitch"
                        checked={gradientType === "linear"}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersSquareOptions({
                                gradientType: e.target.checked ? "linear" : "radial"
                            })
                        }}
                    />
                    <label className="form-check-label" htmlFor="cornersSquareGradientTypeSwitch">
                        グラデーションを線形にする
                    </label>
                </div>

                {
                    gradientType === "linear" && <>
                        <label className="form-label me-2">グラデーションの角度</label>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            value={gradientRotation}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                updateCornersSquareOptions({
                                    gradientRotation: parseInt(e.target.value, 10)
                                })
                            }
                        />
                        <span className="ms-2">{gradientRotation}°</span>
                    </>
                }
            </>
        }
    </>
}

export default CornersSquareOptionsComponent
