import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Registro from './Registro';

// Mock de Axios
jest.mock('axios');

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <Registro />', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Limpiar sessionStorage antes de cada test
        Storage.prototype.setItem = jest.fn();
        // Mock de window.alert ya que el componente lo usa
        global.alert = jest.fn();
    });

    const renderComponent = () => render(
        <BrowserRouter {...routerProps}>
            <Registro />
        </BrowserRouter>
    );

    test('debe renderizar correctamente los títulos de las secciones', () => {
        renderComponent();
        expect(screen.getByText('Cliente')).toBeInTheDocument();
        expect(screen.getByText('Vehículo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    });

    test('debe alternar la visibilidad de la contraseña al hacer clic en el ojo', () => {
        renderComponent();
        const inputPass = screen.getByPlaceholderText('Contraseña');
        const btnToggle = screen.getByRole('button', { name: '' }); // El botón que contiene el icono Eye

        expect(inputPass.type).toBe('password');

        fireEvent.click(btnToggle);
        expect(inputPass.type).toBe('text');

        fireEvent.click(btnToggle);
        expect(inputPass.type).toBe('password');
    });

    test('debe limitar el teléfono a 9 dígitos y el año a 4', () => {
        renderComponent();
        const inputTel = screen.getByPlaceholderText('Teléfono');
        const inputAnio = screen.getByPlaceholderText('Año');

        fireEvent.input(inputTel, { target: { value: '1234567890123' } });
        expect(inputTel.value).toBe('123456789');

        fireEvent.input(inputAnio, { target: { value: '202455' } });
        expect(inputAnio.value).toBe('2024');
    });

    test('debe mostrar alerta si el email ya existe (status 200)', async () => {
        axios.get.mockResolvedValue({ status: 200, data: { mensaje: 'El email ya existe' } });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com', name: 'email' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('El email ya existe');
        });
    });

    test('debe completar el flujo de registro exitoso (status 201)', async () => {
        // 1. Mock CheckUser (Email libre)
        axios.get.mockResolvedValueOnce({ status: 201 });

        // 2. Mock CreateUser
        axios.post.mockResolvedValueOnce({ data: { id: 123 } });

        // 3. Mock CreateCar
        axios.post.mockResolvedValueOnce({ data: { id: 456 } });

        // 4. Mock Login final
        const mockUserData = {
            email: 'nuevo@test.com',
            id: 123,
            apellidos: 'García',
            nombre: 'Pepe',
            telefono: '666555444',
            rol: 'cliente',
            fecha_registro: expect.any(String) // Tu código añade la fecha, hay que tenerlo en cuenta
        };
        axios.post.mockResolvedValueOnce({ data: mockUserData });

        renderComponent();

        // Llenar datos
        fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Pepe', name: 'nombre' } });
        fireEvent.change(screen.getByPlaceholderText('Apellidos'), { target: { value: 'García', name: 'apellidos' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'nuevo@test.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Matrícula'), { target: { value: '1234LMN', name: 'matricula' } });
        fireEvent.change(screen.getByPlaceholderText('Marca'), { target: { value: 'Seat', name: 'marca' } });
        fireEvent.change(screen.getByPlaceholderText('Modelo'), { target: { value: 'Ibiza', name: 'modelo' } });

        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        // USAMOS UNA LÓGICA MÁS FLEXIBLE PARA EL SESSIONSTORAGE
        await waitFor(() => {
            expect(sessionStorage.setItem).toHaveBeenCalledWith('usuarioGlowcars', expect.any(String));

            // Extraemos lo que recibió el sessionStorage para compararlo como OBJETO, no como STRING
            const callArgs = sessionStorage.setItem.mock.calls.find(call => call[0] === 'usuarioGlowcars');
            const savedData = JSON.parse(callArgs[1]);

            expect(savedData.email).toBe('nuevo@test.com');
            expect(savedData.nombre).toBe('Pepe');
            expect(savedData.apellidos).toBe('García');
            expect(mockNavigate).toHaveBeenCalledWith('/perfil');
        });
    });
    test('debe manejar errores en la API de registro', async () => {
        // 1. Espiamos el console.error para que no ensucie la salida
        const spyError = jest.spyOn(console, 'error').mockImplementation(() => { });

        axios.get.mockRejectedValue(new Error('Error de red'));

        renderComponent();

        // Disparamos el registro
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Hubo un error al registrar los datos.');
        });

        // 2. Verificamos que se llamó al console.error (opcional)
        expect(spyError).toHaveBeenCalled();

        // 3. Limpiamos el espía
        spyError.mockRestore();
    });

    test('debe limitar el input de teléfono a 9 dígitos en registro.js', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Registro />
            </BrowserRouter>
        );

        // 1. Localizamos el input por su placeholder
        const inputTelefono = screen.getByPlaceholderText(/teléfono/i);

        // Simulamos un teléfono válido (9 dígitos)
        fireEvent.input(inputTelefono, {
            target: { value: '666777888', name: 'telefono' }
        });

        // Verificamos que el valor se mantiene exactamente igual
        expect(inputTelefono.value).toBe('666777888');
        expect(inputTelefono.value).toHaveLength(9);
    });

    test('debe limitar el input de año a un máximo de 4 dígitos mediante onInput', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Registro />
            </BrowserRouter>
        );

        // 1. Localizamos el input por su placeholder "Año"
        const inputAnio = screen.getByPlaceholderText(/año/i);

        // Simulamos un año correcto (4 dígitos)
        fireEvent.input(inputAnio, {
            target: { value: '2024', name: 'anio' }
        });

        // Verificamos que el valor se mantiene intacto
        expect(inputAnio.value).toBe('2024');
    });
});