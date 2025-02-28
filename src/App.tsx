import './App.css';
import MainLayout from "./components/MainLayout";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { enableMapSet } from 'immer';

enableMapSet();  // To enable Set in Redux.

const App = () => {

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <MainLayout />
      </Provider>
    </ErrorBoundary>
  )
}

export default App;
