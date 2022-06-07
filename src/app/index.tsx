import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WidgetMobile from 'src/pages/WidgetMobile';
import WidgetWide from 'src/pages/WidgetWide';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WidgetMobile />} />
          <Route path="/widget-wide" element={<WidgetWide />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
