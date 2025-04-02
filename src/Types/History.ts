import HistoryAction from "./HistoryAction.ts"

type History = {
    name: string
    createdAt: Date
    notes?: string
    actions: HistoryAction[]
}

export default History
