import { useRef, useState, type DragEvent, type KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"

export type ConjugationTableRow = {
    pronoun: string
    forms: string[]
}

type ConjugationTableProps = {
    columns: string[]
    rows: ConjugationTableRow[]
    rowHeading?: string
}

export default function ConjugationTable({ columns, rows, rowHeading }: ConjugationTableProps) {
    const { t } = useTranslation()
    const columnCount = columns.length + 1
    const cells = rows.flatMap(({ pronoun, forms }) => [pronoun, ...forms])
    const [cellOrder, setCellOrder] = useState(() => cells.map((_, index) => index))
    const [dragOverCell, setDragOverCell] = useState<number | null>(null)
    const [status, setStatus] = useState("")
    const draggedCell = useRef<number | null>(null)

    const isRowCorrect = (order: number[], rowIndex: number) => {
        const rowStart = rowIndex * columnCount
        const pronoun = cells[order[rowStart]]
        const expectedRow = rows.find((row) => row.pronoun === pronoun)

        return (
            expectedRow !== undefined &&
            expectedRow.forms.every(
                (form, columnIndex) => cells[order[rowStart + columnIndex + 1]] === form,
            )
        )
    }

    const swapCells = (firstIndex: number, secondIndex: number) => {
        const firstIsPronoun = firstIndex % columnCount === 0
        const secondIsPronoun = secondIndex % columnCount === 0

        if (firstIndex === secondIndex || firstIsPronoun !== secondIsPronoun) {
            return
        }

        const nextOrder = [...cellOrder]
        ;[nextOrder[firstIndex], nextOrder[secondIndex]] = [
            nextOrder[secondIndex],
            nextOrder[firstIndex],
        ]
        setCellOrder(nextOrder)
        setStatus(
            rows.every((_, index) => isRowCorrect(nextOrder, index))
                ? t("common.allRowsCorrect")
                : "",
        )
    }

    const shuffleCells = () => {
        const shuffled = cells.map((_, index) => index)
        const pronounPositions = shuffled.filter((index) => index % columnCount === 0)
        const formPositions = shuffled.filter((index) => index % columnCount !== 0)

        const shufflePositions = (positions: number[]) => {
            const values = positions.map((position) => shuffled[position])

            for (let index = values.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1))
                ;[values[index], values[randomIndex]] = [values[randomIndex], values[index]]
            }

            if (values.every((value, index) => value === positions[index])) {
                ;[values[0], values[1]] = [values[1], values[0]]
            }

            positions.forEach((position, index) => {
                shuffled[position] = values[index]
            })
        }

        shufflePositions(pronounPositions)
        shufflePositions(formPositions)
        setCellOrder(shuffled)
        setStatus("")
    }

    const handleCellKeyDown = (event: KeyboardEvent<HTMLTableCellElement>, index: number) => {
        let targetIndex: number | null = null

        if (event.key === "ArrowUp" && index >= columnCount) {
            targetIndex = index - columnCount
        } else if (event.key === "ArrowDown" && index < cellOrder.length - columnCount) {
            targetIndex = index + columnCount
        } else if (event.key === "ArrowLeft" && index % columnCount > 0) {
            targetIndex = index - 1
        } else if (event.key === "ArrowRight" && index % columnCount < columnCount - 1) {
            targetIndex = index + 1
        }

        if (targetIndex !== null) {
            event.preventDefault()
            swapCells(index, targetIndex)
        }
    }

    const getCellProps = (cellIndex: number, valueIndex: number) => ({
        "aria-label": cells[valueIndex],
        tabIndex: 0,
        draggable: true,
        className: dragOverCell === cellIndex ? "conjugation-table__cell--drag-over" : undefined,
        onKeyDown: (event: KeyboardEvent<HTMLTableCellElement>) =>
            handleCellKeyDown(event, cellIndex),
        onDragStart: (event: DragEvent<HTMLTableCellElement>) => {
            draggedCell.current = cellIndex
            event.dataTransfer.effectAllowed = "move"
            event.dataTransfer.setData("text/plain", String(valueIndex))
        },
        onDragOver: (event: DragEvent<HTMLTableCellElement>) => {
            event.preventDefault()
            if (
                draggedCell.current !== null &&
                (draggedCell.current % columnCount === 0) !== (cellIndex % columnCount === 0)
            ) {
                setDragOverCell(null)
                return
            }
            event.dataTransfer.dropEffect = "move"
            setDragOverCell(cellIndex)
        },
        onDrop: (event: DragEvent<HTMLTableCellElement>) => {
            event.preventDefault()
            if (draggedCell.current !== null) {
                swapCells(draggedCell.current, cellIndex)
            }
            draggedCell.current = null
            setDragOverCell(null)
        },
        onDragEnd: () => {
            draggedCell.current = null
            setDragOverCell(null)
        },
    })

    return (
        <div className="conjugation-table">
            <button className="conjugation-table__shuffle" type="button" onClick={shuffleCells}>
                {t("common.shuffle")}
            </button>
            <p className="conjugation-table__status" aria-live="polite">
                {status}
            </p>
            <div className="conjugation-table__wrapper">
                <table className="conjugation-table__grid">
                    <thead>
                        <tr>
                            <th scope="col">{rowHeading ?? t("possessiveDeclension.case")}</th>
                            {columns.map((column) => (
                                <th key={column} scope="col">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => {
                            const rowStart = rowIndex * columnCount

                            return (
                                <tr
                                    key={row.pronoun}
                                    className={
                                        isRowCorrect(cellOrder, rowIndex)
                                            ? "conjugation-table__row--correct"
                                            : undefined
                                    }
                                >
                                    {Array.from({ length: columnCount }, (_, columnIndex) => {
                                        const cellIndex = rowStart + columnIndex
                                        const valueIndex = cellOrder[cellIndex]
                                        const cellProps = getCellProps(cellIndex, valueIndex)

                                        return columnIndex === 0 ? (
                                            <th key={cellIndex} scope="row" {...cellProps}>
                                                {cells[valueIndex]}
                                            </th>
                                        ) : (
                                            <td key={cellIndex} {...cellProps}>
                                                {cells[valueIndex]}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
