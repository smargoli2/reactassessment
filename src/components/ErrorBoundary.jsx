import React, { Component } from 'react';
import { Button } from '@mui/material';

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;