import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ModeProvider, ThemeProvider, Text } from '@edadma/react-tailwind'

export const Whatever: FC = () => {
  console.log('whatever')
  return (
    <ThemeProvider>
      <ModeProvider>
        <p>Whatever</p>
        <Link to="/">
          <Text>Go to Home</Text>
        </Link>
      </ModeProvider>
    </ThemeProvider>
  )
}
