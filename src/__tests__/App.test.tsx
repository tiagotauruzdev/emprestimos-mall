import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock the components to avoid complex rendering
vi.mock('../pages/Index', () => ({
  default: function MockIndex() {
    return <div data-testid="index-page">Index Page</div>;
  }
}));

vi.mock('../pages/Equipamentos', () => ({
  default: function MockEquipamentos() {
    return <div data-testid="equipamentos-page">Equipamentos Page</div>;
  }
}));

vi.mock('../pages/ComoFunciona', () => ({
  default: function MockComoFunciona() {
    return <div data-testid="como-funciona-page">Como Funciona Page</div>;
  }
}));

vi.mock('../pages/Contato', () => ({
  default: function MockContato() {
    return <div data-testid="contato-page">Contato Page</div>;
  }
}));

vi.mock('../pages/NotFound', () => ({
  default: function MockNotFound() {
    return <div data-testid="not-found-page">Not Found Page</div>;
  }
}));

vi.mock('../components/Navbar', () => ({
  default: function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  }
}));

// Import the actual components after mocking
import Index from '../pages/Index';
import Equipamentos from '../pages/Equipamentos';
import ComoFunciona from '../pages/ComoFunciona';
import Contato from '../pages/Contato';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Test component that mimics App routing structure
const TestApp = ({ initialRoute }: { initialRoute: string }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Equipamentos />} />
              <Route path="/home" element={<Index />} />
              <Route path="/equipamentos" element={<Equipamentos />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </MemoryRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

describe('App Routing', () => {
  test('renders Equipamentos component on "/" route', () => {
    render(<TestApp initialRoute="/" />);
    expect(screen.getByTestId('equipamentos-page')).toBeInTheDocument();
  });

  test('renders Index component on "/home" route', () => {
    render(<TestApp initialRoute="/home" />);
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  test('renders Equipamentos component on "/equipamentos" route for backward compatibility', () => {
    render(<TestApp initialRoute="/equipamentos" />);
    expect(screen.getByTestId('equipamentos-page')).toBeInTheDocument();
  });

  test('renders ComoFunciona component on "/como-funciona" route', () => {
    render(<TestApp initialRoute="/como-funciona" />);
    expect(screen.getByTestId('como-funciona-page')).toBeInTheDocument();
  });

  test('renders Contato component on "/contato" route', () => {
    render(<TestApp initialRoute="/contato" />);
    expect(screen.getByTestId('contato-page')).toBeInTheDocument();
  });

  test('renders NotFound component for invalid routes', () => {
    render(<TestApp initialRoute="/invalid-route" />);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});