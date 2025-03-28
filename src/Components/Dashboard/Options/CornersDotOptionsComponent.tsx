import { ChangeEvent, FC, ReactElement } from "react"

import { CornersDotOptions } from "../../../Types/useCornersDotOptions.ts"

type CornersDotOptionsProps = {
    cornersDotOptions: CornersDotOptions
    updateCornersDotOptions: (updates: Partial<CornersDotOptions>) => void
}

const CornersDotOptionsComponent: FC<CornersDotOptionsProps> = (props: CornersDotOptionsProps): ReactElement => {

    const {
        cornersDotOptions,
        updateCornersDotOptions
    } = props
    const {
        type,
        gradient,
        color,
        color1,
        color2,
        gradientType,
        gradientRotation
    } = cornersDotOptions

    return <>
        <select
            className="form-control mb-2"
            value={type}
            onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                updateCornersDotOptions({ type: e.target.value as typeof type })
            }}
        >
            <option value="dot">ドット</option>
            <option value="square">四角</option>
        </select>

        {/* グラデーションON/OFF */}
        <div className="form-check form-switch mb-2">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="cornersDotGradientSwitch"
                checked={gradient}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                    updateCornersDotOptions({
                        gradient: e.target.checked
                    })
                }}
            />
            <label className="form-check-label" htmlFor="cornersDotGradientSwitch">
                四隅の点の色のグラデーション
            </label>
        </div>

        {
            !gradient ? <>
                <label className="form-label me-2">四隅の点の色（単色）</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                        updateCornersDotOptions({
                            color: e.target.value
                        })
                    }}
                />
            </> : <>
                <div className="mb-2">
                    <label className="form-label me-2">色(1)</label>
                    <input
                        type="color"
                        value={color1}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersDotOptions({
                                color1: e.target.value
                            })
                        }}
                    />
                    <label className="form-label ms-3 me-2">色(2)</label>
                    <input
                        type="color"
                        value={color2}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersDotOptions({
                                color2:
                                e.target.value
                            })
                        }}
                    />
                </div>

                <div className="form-check form-switch mb-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="cornersDotGradientTypeSwitch"
                        checked={gradientType === "linear"}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateCornersDotOptions({
                                gradientType: e.target.checked ? "linear" : "radial"
                            })
                        }}
                    />
                    <label className="form-check-label" htmlFor="cornersDotGradientTypeSwitch">
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
                                updateCornersDotOptions({
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

export default CornersDotOptionsComponent
