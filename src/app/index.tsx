import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WidgetDemo from 'src/pages/WidgetDemo';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/widget" element={<WidgetDemo />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
