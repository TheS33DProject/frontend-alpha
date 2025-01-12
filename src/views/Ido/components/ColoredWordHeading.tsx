import { Colors, Heading, TextProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

interface HeadingProps extends TextProps {
  text: string
  firstColor?: keyof Colors
}

const ColoredWordHeading: React.FC<HeadingProps> = ({ text, firstColor, mb = '0px', ...props }) => {
  const { theme } = useTheme()
  const split = text.split(' ')
  const firstWord = split[0]
  const remainingWords = split.slice(1).join(' ')
  const displayedColor = (theme.colors[firstColor] as string) ?? theme.colors.secondary

  return (
    <Heading as="h2" mb={mb} {...props}>
      <span style={{ color: displayedColor }}>{firstWord} </span>
      {remainingWords}
    </Heading>
  )
}

export default ColoredWordHeading
