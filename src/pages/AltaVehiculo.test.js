import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import AltaVehiculo from './AltaVehiculo';

// Simulamos axios y la navegación
jest.mock('axios');
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Pruebas Unitarias - Alta de Vehículo', () => {
  
  beforeEach(() => {
    // Simulamos que hay un usuario en sesión para el useEffect
    const user = { id: 1, nombre: 'Jesica', apellidos: 'Moreno' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(user));
    jest.clearAllMocks();
  });

  test('debe renderizar correctamente el título y el botón de añadir', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AltaVehiculo />
    </BrowserRouter>
    );

    expect(screen.getByText(/Alta de Vehículo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir/i })).toBeInTheDocument();
  });

  test('debe actualizar el campo matrícula cuando el usuario escribe', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AltaVehiculo />
    </BrowserRouter>
    );

    const inputMatricula = screen.getByPlaceholderText(/Matrícula/i);
    fireEvent.change(inputMatricula, { target: { value: '1234ABC', name: 'matricula' } });
    
    expect(inputMatricula.value).toBe('1234ABC');
  });

  test('debe mostrar el modal de confirmación cuando el registro es exitoso', async () => {
    // Simulamos respuesta 201 Created de la API
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AltaVehiculo />
    </BrowserRouter>
    );

    // Rellenamos datos obligatorios
    fireEvent.change(screen.getByPlaceholderText(/Matrícula/i), { target: { value: '1234ABC', name: 'matricula' } });
    fireEvent.change(screen.getByPlaceholderText(/Marca/i), { target: { value: 'Toyota', name: 'marca' } });
    fireEvent.change(screen.getByPlaceholderText(/Modelo/i), { target: { value: 'Corolla', name: 'modelo' } });
    fireEvent.change(screen.getByPlaceholderText(/Año/i), { target: { value: '2020', name: 'anio' } });
    fireEvent.change(screen.getByPlaceholderText(/Nº bastidor/i), { target: { value: 'BS12345', name: 'bastidor' } });

    // Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Añadir/i }));

    // Esperamos a que aparezca el mensaje del modal 
    await waitFor(() => {
      expect(screen.getByText(/Alta de vehículo confirmada/i)).toBeInTheDocument();
    });
  });
});