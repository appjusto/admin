import { BasicErrorPage } from 'pages/error/BasicErrorPage';
import { Component, ErrorInfo, ReactNode } from 'react';

interface CustomError extends Error {
  name: string;
  message: string;
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: CustomError | null;
}

class MainErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };
  //context

  public static getDerivedStateFromError(error: CustomError): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: CustomError, errorInfo: ErrorInfo) {
    console.error('MainErrorBoundary:', error, errorInfo);
    if (error.name === 'ChunkLoadError' || error.message?.includes('ChunkLoadError')) {
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return <BasicErrorPage description={this.state.error?.message} />;
    }
    return this.props.children;
  }
}

export default MainErrorBoundary;
