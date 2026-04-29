import { Position, Positions as PositionsDef } from '@/typeDefinitions/app'
import PromptList from '@/components/chrome/PromptList'

export default function Positions({ positions }: PositionsDef) {
  const uniquePositions = positions.filter(
    (position, index, self) =>
      index === self.findIndex((p) => p.company === position.company)
  )

  return (
    <PromptList aria-label="Companies">
      {uniquePositions.map((position: Position, index: number) => (
        <PromptList.Item key={index}>{position.company}</PromptList.Item>
      ))}
    </PromptList>
  )
}
