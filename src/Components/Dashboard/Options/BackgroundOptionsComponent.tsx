// BackgroundOptionsComponent.tsx
import React, { FC } from "react"
import { BackgroundOptions } from "./useBackgroundOptions"

type BackgroundOptionsProps = {
    backgroundOptions: BackgroundOptions
    updateBackgroundOptions: (updates: Partial<BackgroundOptions>) => void
}

const BackgroundOptionsComponent: FC<BackgroundOptionsProps> = ({
                                                                    backgroundOptions,
                                                                    updateBackgroundOptions
                                                                }) => {
    const { gradient, color, color1, color2, gradientType, gradientRotation } = backgroundOptions

    return (
        <div>
            <div className="form-check form-switch mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="backgroundGradientSwitch"
                    checked={gradient}
                    onChange={(e) => {
                        updateBackgroundOptions({ gradient: e.target.checked })
                    }}
                />
                <label className="form-check-label" htmlFor="backgroundGradientSwitch">
                    背景色をグラデーションにする
                </label>
            </div>

            {!gradient ? (
                <>
                    <label className="form-label me-2">背景色（単色）</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => updateBackgroundOptions({ color: e.target.value })}
                    />
                </>
            ) : (
                <>
                    <div className="mb-2">
                        <label className="form-label me-2">色(1)</label>
                        <input
                            type="color"
                            value={color1}
                            onChange={(e) => updateBackgroundOptions({ color1: e.target.value })}
                        />
                        <label className="form-label ms-3 me-2">色(2)</label>
                        <input
                            type="color"
                            value={color2}
                            onChange={(e) => updateBackgroundOptions({ color2: e.target.value })}
                        />
                    </div>

                    <div className="form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="backgroundGradientTypeSwitch"
                            checked={gradientType === "linear"}
                            onChange={(e) => {
                                updateBackgroundOptions({
                                    gradientType: e.target.checked ? "linear" : "radial"
                                })
                            }}
                        />
                        <label className="form-check-label" htmlFor="backgroundGradientTypeSwitch">
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
                                onChange={(e) =>
                                    updateBackgroundOptions({ gradientRotation: parseInt(e.target.value, 10) })
                                }
                            />
                            <span className="ms-2">{gradientRotation}°</span>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default BackgroundOptionsComponent
