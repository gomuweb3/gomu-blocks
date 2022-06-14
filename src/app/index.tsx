import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WidgetMobile from 'src/pages/WidgetMobile';
import WidgetWide from 'src/pages/WidgetWide';
import WidgetPlain from 'src/pages/WidgetPlain';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WidgetMobile />} />
          <Route path="/widget-wide" element={<WidgetWide />} />
          <Route path="/widget-plain" element={<WidgetPlain />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
