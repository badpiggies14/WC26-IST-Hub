import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('[FIFA 2026 HUB] Render failure', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-state">
          <h2>Could Not Render This View</h2>
          <p>The app recovered safely. Refresh data or return to the schedule.</p>
          <button className="btn btn-primary" type="button" onClick={() => this.setState({ error: null })}>
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
