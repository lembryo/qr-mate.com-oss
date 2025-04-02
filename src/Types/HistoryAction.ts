import { ActionType, DestinationType, SourceType } from "./Enum.ts"
import HistoryActionEvent from "./HistoryActionEvent.ts"

type HistoryAction = {
    type: ActionType
    executedAt: Date
    source?: SourceType
    destination?: DestinationType
    events: HistoryActionEvent[]
}

export default HistoryAction
