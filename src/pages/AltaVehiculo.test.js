import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import AltaVehiculo from './AltaVehiculo';

// Mocks
jest.mock('axios');
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas Unitarias - Alta de Vehículo', () => {

  beforeEach(() => {
    // Limpiamos mocks y preparamos sesión
    jest.clearAllMocks();
    const user = { id: 1, nombre: 'Jesica', apellidos: 'Moreno' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(user));
  });

  test('debe mostrar el modal de confirmación cuando el registro es exitoso', async () => {
    // 1. Mock de Axios
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <BrowserRouter {...routerProps}>
        <AltaVehiculo />
      </BrowserRouter>
    );

    // 2. Rellenamos campos con una pequeña pausa para asegurar el estado
    fireEvent.change(screen.getByPlaceholderText(/Matrícula/i), { target: { value: '1234ABC', name: 'matricula' } });
    fireEvent.change(screen.getByPlaceholderText(/Marca/i), { target: { value: 'Toyota', name: 'marca' } });
    fireEvent.change(screen.getByPlaceholderText(/Modelo/i), { target: { value: 'Corolla', name: 'modelo' } });
    fireEvent.change(screen.getByPlaceholderText(/Año/i), { target: { value: '2020', name: 'anio' } });
    fireEvent.change(screen.getByPlaceholderText(/Nº bastidor/i), { target: { value: 'BS12345', name: 'bastidor' } });

    // 3. Obtenemos el botón y lo pulsamos
    const btnAdd = screen.getByRole('button', { name: /Añadir/i });
    fireEvent.click(btnAdd);

    // 4. Búsqueda simplificada y robusta
    // Usamos una función de búsqueda que ignore mayúsculas/minúsculas y espacios extra
    const modalMsg = await screen.findByText(/alta de vehículo confirmada/i, {}, { timeout: 3000 });

    expect(modalMsg).toBeInTheDocument();
  });

  test('debe cerrar la modal al pulsar Aceptar y navegar al perfil', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <BrowserRouter {...routerProps}>
        <AltaVehiculo />
      </BrowserRouter>
    );

    // Forzamos la aparición de la modal enviando el form
    fireEvent.click(screen.getByRole('button', { name: /Añadir/i }));

    // Esperar a que el botón "Aceptar" esté disponible en el DOM
    const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
    fireEvent.click(btnAceptar);

    // Verificamos navegación y desaparición
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/perfil');
      expect(screen.queryByText(/Alta de vehículo confirmada/i)).not.toBeInTheDocument();
    });
  });

  test('input "anio" debe limitar a 4 caracteres vía onInput', () => {
    render(
      <BrowserRouter {...routerProps}>
        <AltaVehiculo />
      </BrowserRouter>
    );

    const anioInput = screen.getByPlaceholderText(/Año/i);

    // El evento onInput dispara tu lógica de slice(0,4)
    fireEvent.input(anioInput, { target: { value: '20265' } });
    expect(anioInput.value).toBe('2026');

    // Verificamos que con 4 o menos no corta
    fireEvent.input(anioInput, { target: { value: '202' } });
    expect(anioInput.value).toBe('202');
  });

  test('debe ejecutar el bloque catch: loguear error y mostrar alert si axios falla', async () => {
    // 1. Preparamos los espías para la consola y el alert
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

    // 2. Forzamos a Axios a fallar
    const errorSimulado = new Error('Error de servidor');
    axios.post.mockRejectedValue(errorSimulado);

    // 3. Renderizamos y disparamos el evento
    render(
      <BrowserRouter {...routerProps}>
        <AltaVehiculo />
      </BrowserRouter>
    );

    // Buscamos el botón que dispara handleRegistro 
    const btnRegistro = screen.getByRole('button', { name: /Añadir/i });
    fireEvent.click(btnRegistro);

    // 4. Verificaciones del bloque CATCH
    await waitFor(() => {
      // Comprobamos que el alert se llamó con el texto exacto de tu código
      expect(alertSpy).toHaveBeenCalledWith("Hubo un error al registrar los datos.");

      // Comprobamos que console.error recibió el mensaje y el objeto del error
      expect(consoleSpy).toHaveBeenCalledWith("Error en el registro:", errorSimulado);
    });

    // 5. Limpieza: Restauramos las funciones originales
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});