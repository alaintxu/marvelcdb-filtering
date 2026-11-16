import './App.css';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import MainLayout from "./components/MainLayout";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { enableMapSet } from 'immer';

enableMapSet();  // To enable Set in Redux.

const App = () => {

  return (
    <ErrorBoundary>
      <Theme theme={neutralTheme} mode="dark">
        <Provider store={store}>
          <MainLayout />
        </Provider>
      </Theme>
    </ErrorBoundary>
  )
}

export default App;
