import { Position, Positions as PositionsDef } from '@/typeDefinitions/app'
import PromptList, { PromptItem } from '@/components/chrome/PromptList'

export default function Positions({ positions }: PositionsDef) {
  const uniquePositions = positions.filter(
    (position, index, self) =>
      index === self.findIndex((p) => p.company === position.company)
  )

  return (
    <PromptList aria-label="Companies">
      {uniquePositions.map((position: Position, index: number) => (
        <PromptItem key={index}>{position.company}</PromptItem>
      ))}
    </PromptList>
  )
}
