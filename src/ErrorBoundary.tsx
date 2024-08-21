import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught map error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) return this.props.fallback || <h1>Sorry.. there was a map error</h1>

    return this.props.children
  }
}
