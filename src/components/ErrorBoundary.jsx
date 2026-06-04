import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white' }}>
          <h2 style={{ color: '#ef4444' }}>Что-то пошло не так</h2>
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Ошибка:</summary>
            <pre style={{ background: '#1a1a2e', padding: '10px', borderRadius: '8px', overflow: 'auto' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
