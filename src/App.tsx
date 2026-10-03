import { BrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ReviewProvider } from '@/lib/review';

export default function App() {
  return (
    <ReviewProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ReviewProvider>
  );
}
