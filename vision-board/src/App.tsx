import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LifeVisionBoard from './pages/LifeVisionBoard'
import QuantumTest from './pages/QuantumTest'

const queryClient = new QueryClient()

function App() {
  // Switch to QuantumTest to see the quantum/HUD dashboard
  // Change this to <LifeVisionBoard /> to go back
  return (
    <QueryClientProvider client={queryClient}>
      <QuantumTest />
    </QueryClientProvider>
  )
}

export default App
