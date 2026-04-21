import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Citas from './Citas';

// 1. Variables de control para los mocks (Deben empezar por "mock")
let mockLocationState = 'Mantenimiento';
const mockNavigate = jest.fn();

// 2. Mock de react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: mockLocationState,
        pathname: '/citas',
    }),
}));

jest.mock('axios');

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

const mockUser = { id: '123', nombre: 'Juan', apellidos: 'Pérez' };
const mockVehiculos = [
    { id_vehiculo: '1', matricula: '1234ABC', marca: 'Toyota', modelo: 'Corolla' }
];

describe('Pruebas en el componente <Citas />', () => {

    beforeAll(() => {
        // Silenciamos errores de keys de React
        jest.spyOn(console, 'error').mockImplementation((msg) => {
            if (msg.includes('Each child in a list should have a unique "key" prop')) return;
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockLocationState = 'Mantenimiento'; // Limpiamos el estado entre tests
        Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUser));

        axios.post.mockImplementation((url) => {
            if (url.includes('/vehiculos')) return Promise.resolve({ data: mockVehiculos });
            if (url.includes('/createCita')) return Promise.resolve({ data: { success: true } });
            return Promise.reject(new Error('URL no encontrada'));
        });
    });

    test('debe cargar los datos del usuario y los vehículos al montar', async () => {
        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        expect(screen.getAllByText(mockUser.nombre).length).toBeGreaterThan(0);
        await waitFor(() => {
            expect(screen.getByText(/1234ABC Toyota Corolla/i)).toBeInTheDocument();
        });
    });

    test('debe sincronizar el servicioSeleccionado con el campo tipo del formulario', async () => {
    // 1. Preparamos el sessionStorage (VITAL: si falla el parse, no llega al IF)
    const mockUserSession = { id: '123', nombre: 'Juan', apellidos: 'Pérez' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUserSession));

    // 2. Preparamos el estado de navegación ANTES del render
    const servicioMock = 'Mantenimiento';
    mockLocationState = { servicioSeleccionado: servicioMock };

    // 3. Renderizamos el componente
    await act(async () => {
        render(
            <BrowserRouter {...routerProps}>
                <Citas />
            </BrowserRouter>
        );
    });

    // 4. Buscamos el elemento select
    const selectTipo = document.querySelector('select[name="tipo"]');

    // 5. Verificamos que el IF se ejecutó correctamente
    // Usamos waitFor porque setFormCita es asíncrono dentro del useEffect
    await waitFor(() => {
        expect(selectTipo.value).toBe(servicioMock);
    }, { timeout: 2000 });

    // 6. Verificamos que el spread operator (...prev) funciona al cambiar otro campo
    const inputMotivo = screen.getByPlaceholderText(/Motivo/i);
    fireEvent.change(inputMotivo, { target: { value: 'Revisión técnica', name: 'motivo' } });

    // Comprobamos que el valor del IF persiste y el nuevo también está
    expect(selectTipo.value).toBe(servicioMock);
    expect(inputMotivo.value).toBe('Revisión técnica');
});
    test('debe enviar el formulario correctamente y navegar', async () => {
        window.alert = jest.fn(); // Mock de alert para evitar errores en JSDOM

        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        // Rellenar formulario
        fireEvent.change(document.querySelector('select[name="vehiculo"]'), { target: { value: '1', name: 'vehiculo' } });
        fireEvent.change(document.querySelector('select[name="tipo"]'), { target: { value: 'Reparación', name: 'tipo' } });
        fireEvent.change(document.getElementById('fecha-input'), { target: { value: '2026-05-20', name: 'fecha' } });
        fireEvent.change(screen.getByPlaceholderText(/Motivo/i), { target: { value: 'Revisión anual', name: 'motivo' } });

        // Enviar
        fireEvent.click(screen.getByRole('button', { name: /Solicitar cita/i }));

        await waitFor(() => {
            // Verificamos que los datos enviados a Axios sean los correctos
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/createCita'),
                expect.objectContaining({
                    vehiculo: '1',
                    tipo: 'Reparación',
                    motivo: 'Revisión anual'
                })
            );
        });
    });

    test('debe ejecutar el bloque catch y mostrar error en consola si axios.post falla en fetchDatos', async () => {
        // 1. Espiamos el console.error para verificar que se llame
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // 2. Definimos el error que queremos simular
        const errorSimulado = new Error('Error de conexión');

        // 3. Mockeamos axios.post para que falle específicamente una vez
        axios.post.mockRejectedValueOnce(errorSimulado);

        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        // 4. Verificación
        // Como fetchDatos se llama habitualmente en el useEffect al montar,
        // esperamos a que la promesa se resuelva/rechace.
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error al obtener datos:",
                errorSimulado
            );
        });

        // 5. Limpiamos el espía
        consoleSpy.mockRestore();
    });

    test('debe ejecutar el bloque catch si axios falla al registrar la cita', async () => {
        // 1. Espías y Errores
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const errorSimulado = new Error('Fallo de red');

        // 2. Mock de Axios específico para este test
        // Usamos mockImplementation para asegurarnos de que intercepte la llamada
        axios.post.mockImplementation((url) => {
            if (url.includes('/createCita')) {
                return Promise.reject(errorSimulado);
            }
            // Para la carga de vehículos inicial
            return Promise.resolve({ data: mockVehiculos });
        });

        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        // 3. Rellenar campos asegurando que el estado de React se actualice
        fireEvent.change(document.querySelector('select[name="vehiculo"]'), { target: { value: '1', name: 'vehiculo' } });
        fireEvent.change(document.querySelector('select[name="tipo"]'), { target: { value: 'Mantenimiento', name: 'tipo' } });

        const fechaInput = document.getElementById('fecha-input');
        fireEvent.change(fechaInput, { target: { value: '2026-10-10', name: 'fecha' } });

        const motivoInput = screen.getByPlaceholderText(/Motivo/i);
        fireEvent.change(motivoInput, { target: { value: 'Test de error', name: 'motivo' } });

        // 4. Disparo manual del evento submit sobre el formulario
        const formulario = document.querySelector('form');
        await act(async () => {
            fireEvent.submit(formulario);
        });

        // 5. Verificación con un matcher más flexible para el Alert
        await waitFor(() => {
            // Buscamos si fue llamado con el texto, sin importar mayúsculas o espacios extra
            expect(alertSpy).toHaveBeenCalledWith(
                expect.stringMatching(/Hubo un error al registrar los datos/i)
            );
            expect(consoleSpy).toHaveBeenCalledWith("Error en el registro:", errorSimulado);
        }, { timeout: 3000 });

        consoleSpy.mockRestore();
        alertSpy.mockRestore();
    });

    test('debe actualizar el campo "tipo" del formulario cuando existe servicioSeleccionado', async () => {
    // 1. Preparamos los datos de sesión y el estado de navegación
    const mockUser = { id: 1, nombre: 'Pepe', apellidos: 'García' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUser));

    // Definimos el servicio que queremos que active el IF
    const servicioMock = 'Mantenimiento';
    
    // 2. Mockeamos useLocation para simular que venimos de otra página con datos
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: { servicioSeleccionado: servicioMock },
      pathname: '/citas'
    });

    // Mockeamos la respuesta de fetchDatos para evitar errores de red
    axios.post.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(
        <BrowserRouter {...routerProps}>
          <Citas />
        </BrowserRouter>
      );
    });

    // 3. Verificación
    // Buscamos el select de "tipo" y comprobamos que su valor coincide con el servicioMock
    const selectTipo = document.querySelector('select[name="tipo"]');
    
    await waitFor(() => {
      expect(selectTipo.value).toBe(servicioMock);
    });
  });
});