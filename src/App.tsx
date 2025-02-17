import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css';
import MainLayout from "./components/MainLayout";
import { Provider } from "react-redux";
import store from "./store/configureStore";

const queryClient = new QueryClient();

const App = () => {

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainLayout />
      </QueryClientProvider>
    </Provider>
  )
}

export default App;
