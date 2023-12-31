import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupStore } from './redux/store.ts';
import App from './App.tsx';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={setupStore()}>
    <App />
  </Provider>
);
