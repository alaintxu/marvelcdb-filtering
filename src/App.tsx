import './App.css';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import MainLayout from "./components/MainLayout";
import AstryxI18nProvider from "./components/AstryxI18nProvider";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { enableMapSet } from 'immer';

enableMapSet();  // To enable Set in Redux.

const App = () => {

  return (
    <ErrorBoundary>
      <Theme theme={neutralTheme} mode="dark">
        <AstryxI18nProvider>
          <Provider store={store}>
            <MainLayout />
          </Provider>
        </AstryxI18nProvider>
      </Theme>
    </ErrorBoundary>
  )
}

export default App;
