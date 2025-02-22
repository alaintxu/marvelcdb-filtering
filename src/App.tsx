import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css';
import MainLayout from "./components/MainLayout";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { enableMapSet } from 'immer';

enableMapSet();  // To enable Set in Redux.
const queryClient = new QueryClient();

const App = () => {

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MainLayout />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App;
