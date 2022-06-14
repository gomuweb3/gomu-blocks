import { QueryClient, QueryClientProvider } from 'react-query';
import WidgetPlain from 'src/pages/WidgetPlain';

const queryClient = new QueryClient();

const Widget = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetPlain />
    </QueryClientProvider>
  );
};

export default Widget;
