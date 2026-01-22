import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LifeVisionBoard from './pages/LifeVisionBoard'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LifeVisionBoard />
    </QueryClientProvider>
  )
}

export default App
