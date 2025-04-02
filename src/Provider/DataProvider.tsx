import { createContext, Dispatch, ReactElement, SetStateAction, useContext, useState } from "react"

import History from "../Types/History.ts"

// コンテキストの型定義
type DataContextType = {
    data: string[][]
    setData: Dispatch<SetStateAction<string[][]>>
    histories: History[]
    setHistories: Dispatch<SetStateAction<History[]>>
}

// コンテキストの生成（初期値は undefined としてエラーチェックを行う）
const DataContext = createContext<DataContextType | undefined>(undefined)

// DataProvider コンポーネント：グローバル状態を管理する
export const DataProvider = ({ children }: any): ReactElement => {

    const [data, setData] = useState<string[][]>([["", ""]])
    const [histories, setHistories] = useState<History[]>([])

    return <>
        <DataContext.Provider
            value={{
                data,
                setData,
                histories,
                setHistories
            }}
        >
            {children}
        </DataContext.Provider>
    </>
}

export const useData = (): DataContextType => {
    const context: DataContextType | undefined = useContext(DataContext)
    if (!context) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}
