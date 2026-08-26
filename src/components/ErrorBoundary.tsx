import { Component, type ReactNode } from "react";
import { Button } from "./ui";

interface Props  { children: ReactNode }
interface State  { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    private handleReset = () => {
        this.setState({ error: null });
        window.location.href = "/";
    };

    render() {
        if (this.state.error) {
            return (
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="w-14 h-14 rounded-2xl bg-red-900/30 border border-red-800/50 flex items-center justify-center text-2xl mx-auto mb-4">
                            ⚠
                        </div>
                        <h1 className="text-lg font-semibold text-zinc-100 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-sm text-zinc-500 mb-6 font-mono break-all">
                            {this.state.error.message}
                        </p>
                        <Button onClick={this.handleReset}>Go home</Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}