import { FC } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ModeProvider, ThemeProvider, Text } from '@edadma/react-tailwind'

export const Whatever: FC = () => {
  const navigate = useNavigate()

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
