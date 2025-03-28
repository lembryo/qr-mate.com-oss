import { ChangeEvent, FC, ReactElement } from "react"
import { DotType } from "qr-code-styling"

import { DotsOptions } from "../../../Types/useDotsOptions.ts"

type DotsOptionsProps = {
    dotsOptions: DotsOptions
    updateDotsOptions: (updates: Partial<DotsOptions>) => void
}

const DotsOptionsComponent: FC<DotsOptionsProps> = (props: DotsOptionsProps): ReactElement => {

    const {
        dotsOptions,
        updateDotsOptions
    } = props
    const {
        type,
        gradient,
        color,
        color1,
        color2,
        gradientType,
        gradientRotation
    } = dotsOptions

    return <>
        <select
            className="form-control mb-2"
            value={type}
            onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                // 「type」を更新
                updateDotsOptions({
                    type: e.target.value as DotType
                })
            }}
        >
            <option value="rounded">丸み</option>
            <option value="dots">ドット</option>
            <option value="classy">クラシック</option>
            <option value="classy-rounded">クラシックで更に丸み</option>
            <option value="square">四角</option>
            <option value="extra-rounded">特に丸く</option>
        </select>

        <div className="form-check form-switch mb-2">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="dotsColorGradientSwitch"
                checked={gradient}
                onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    updateDotsOptions({
                        gradient: event.target.checked
                    })
                }}
            />
            <label className="form-check-label" htmlFor="dotsColorGradientSwitch">
                点の色のグラデーション
            </label>
        </div>

        {
            !gradient ? <>
                <label className="form-label me-2">単色</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                        updateDotsOptions({
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
                            updateDotsOptions({
                                color1: e.target.value
                            })
                        }}
                    />
                    <label className="form-label ms-3 me-2">色(2)</label>
                    <input
                        type="color"
                        value={color2}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            updateDotsOptions({
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
                        id="dotsGradientType"
                        checked={gradientType === "linear"}
                        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                            updateDotsOptions({
                                gradientType: event.target.checked ? "linear" : "radial"
                            })
                        }}
                    />
                    <label className="form-check-label" htmlFor="dotsGradientType">
                        線形グラデーションにする
                    </label>
                </div>

                {gradientType === "linear" && (
                    <>
                        <label className="form-label me-2">グラデーションの角度</label>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            value={gradientRotation}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                updateDotsOptions({
                                    gradientRotation: parseInt(e.target.value)
                                })
                            }
                        />
                        <span className="ms-2">
                            {gradientRotation}°
                        </span>
                    </>
                )}
            </>
        }
    </>
}

export default DotsOptionsComponent
