import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import axios from 'axios';

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

// Mocks de dependencias externas
jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Pruebas en el componente <Login />', () => {
    const mockUserResponse = {
        data: {
            email: 'test@glowcars.com',
            id: 1,
            nombre: 'Juan',
            apellidos: 'Pérez',
            telefono: '123456789',
            rol: 'usuario',
            fecha_registro: '2024-01-01'
        }
    };

    const renderLogin = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <Login />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        window.history.pushState({}, '', '/');
        
        // Espiamos sessionStorage correctamente para evitar el error "must be a mock function"
        jest.spyOn(Object.getPrototypeOf(sessionStorage), 'setItem');
        jest.spyOn(Object.getPrototypeOf(sessionStorage), 'clear');
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('debe renderizar los campos de email y contraseña', () => {
        const { container } = renderLogin();
        const emailInput = container.querySelector('input[type="email"]');
        const passwordInput = container.querySelector('input[type="password"]');
        const submitBtn = screen.getByRole('button', { name: /entrar/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitBtn).toBeInTheDocument();
    });

    test('debe actualizar los valores de los inputs al escribir', () => {
        const { container } = renderLogin();
        const emailInput = container.querySelector('input[type="email"]');
        const passwordInput = container.querySelector('input[type="password"]');

        fireEvent.change(emailInput, { target: { value: 'test@glowcars.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(emailInput.value).toBe('test@glowcars.com');
        expect(passwordInput.value).toBe('123456');
    });

    test('debe mostrar/ocultar la contraseña al pulsar el botón del ojo', () => {
        const { container } = renderLogin();
        const passwordInput = container.querySelector('input[type="password"]');
        const buttons = screen.getAllByRole('button');
        const toggleBtn = buttons.find(btn => btn.type === 'button');

        expect(passwordInput.type).toBe('password');

        if (toggleBtn) {
            fireEvent.click(toggleBtn);
            expect(passwordInput.type).toBe('text');
            fireEvent.click(toggleBtn);
            expect(passwordInput.type).toBe('password');
        }
    });

    test('debe realizar login exitoso, guardar en sessionStorage y redirigir', async () => {
        axios.post.mockResolvedValueOnce(mockUserResponse);
        renderLogin();

        // Usamos findBy para asegurar que el DOM está listo y evitar errores de "DOM element"
        const emailInput = await screen.findByPlaceholderText(/email/i);
        const passInput = await screen.findByPlaceholderText(/contraseña/i);
        const btnLogin = await screen.findByRole('button', { name: /entrar/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@glowcars.com' } });
            fireEvent.change(passInput, { target: { value: 'password123' } });
            fireEvent.click(btnLogin);
        });

        // El waitFor envuelve internamente el act() y espera la respuesta asíncrona
        await waitFor(() => {
            expect(screen.getByText(/¡Usuario identificado!/i)).toBeInTheDocument();
        });

        expect(sessionStorage.clear).toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });

    test('debe mostrar error de credenciales cuando el servidor responde con error', async () => {
        axios.post.mockRejectedValueOnce({
            response: { status: 401 }
        });

        renderLogin();

        const emailInput = await screen.findByPlaceholderText(/email/i);
        const btnLogin = await screen.findByRole('button', { name: /entrar/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'error@test.com' } });
            fireEvent.click(btnLogin);
        });

        await waitFor(() => {
            expect(screen.getByText(/Email o contraseña incorrectos/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/Email o contraseña incorrectos/i)).toHaveStyle('color: red');
    });

    test('debe mostrar error de conexión cuando el servidor no responde', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'));

        renderLogin();

        const btnLogin = await screen.findByRole('button', { name: /entrar/i });

        await act(async () => {
            fireEvent.click(btnLogin);
        });

        await waitFor(() => {
            expect(screen.getByText(/El servidor no responde/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/El servidor no responde/i)).toHaveStyle('color: orange');
    });
    test('debe navegar a la página de registro al hacer clic en el enlace correspondiente', () => {
    renderLogin();

    // Buscamos el elemento que dispara goToRegistro 
    // (Ajusta el texto "Registrarse" según lo que diga exactamente tu componente)
    const linkRegistro = screen.getByText(/Registrarse/i);
    
    fireEvent.click(linkRegistro);

    // Verificamos que useNavigate fue llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/registro');
  });
});