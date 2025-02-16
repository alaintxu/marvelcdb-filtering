import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css';
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const App = () => {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MainLayout />
      </QueryClientProvider>
    </>
  )
}

export default App;
