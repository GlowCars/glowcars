import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Servicios from './Servicios';

// Mock de useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <Servicios />', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter {...routerProps}>
        <Servicios />
      </BrowserRouter>
    );
  };

  test('debe renderizar los cuatro títulos de servicios correctamente', () => {
    renderComponent();
    
    expect(screen.getByText('Mantenimiento')).toBeInTheDocument();
    expect(screen.getByText('Diagnósticos')).toBeInTheDocument();
    expect(screen.getByText('Reparaciones')).toBeInTheDocument();
    expect(screen.getByText('Presupuestos')).toBeInTheDocument();
  });

  test('debe renderizar las imágenes de los servicios con sus textos alternativos', () => {
    renderComponent();
    
    expect(screen.getByAltText('aceite')).toBeInTheDocument();
    expect(screen.getByAltText('diagnosis')).toBeInTheDocument();
    expect(screen.getByAltText('reapraciones')).toBeInTheDocument(); // Nota: escrito igual que en tu código
    expect(screen.getByAltText('presuuesto')).toBeInTheDocument();   // Nota: escrito igual que en tu código
  });

  test('debe navegar a /citas con el estado "Mantenimiento" al pulsar el primer botón', () => {
    renderComponent();
    
    const botones = screen.getAllByRole('button', { name: /Pide tu cita/i });
    fireEvent.click(botones[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/citas', {
      state: { tipoServicio: 'Mantenimiento' }
    });
  });

  test('debe navegar a /citas con el estado "Diagnóstico" al pulsar el segundo botón', () => {
    renderComponent();
    
    const botones = screen.getAllByRole('button', { name: /Pide tu cita/i });
    fireEvent.click(botones[1]);

    expect(mockNavigate).toHaveBeenCalledWith('/citas', {
      state: { tipoServicio: 'Diagnóstico' }
    });
  });

  test('debe navegar a /citas con el estado "Reparación" al pulsar el tercer botón', () => {
    renderComponent();
    
    const botones = screen.getAllByRole('button', { name: /Pide tu cita/i });
    fireEvent.click(botones[2]);

    expect(mockNavigate).toHaveBeenCalledWith('/citas', {
      state: { tipoServicio: 'Reparación' }
    });
  });

  test('debe navegar a /citas con el estado "Presupuesto" al pulsar el cuarto botón', () => {
    renderComponent();
    
    const botones = screen.getAllByRole('button', { name: /Pide tu cita/i });
    fireEvent.click(botones[3]);

    expect(mockNavigate).toHaveBeenCalledWith('/citas', {
      state: { tipoServicio: 'Presupuesto' }
    });
  });
});