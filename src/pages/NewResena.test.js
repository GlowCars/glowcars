import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import NewResena from './NewResena';

// Mock de Axios
jest.mock('axios');

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <NewResena />', () => {

    const renderNewResena = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <NewResena />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Simulamos usuario en sesión
        const mockUser = JSON.stringify({ id: '123', nombre: 'Test User', email: 'test@test.com' });
        Storage.prototype.getItem = jest.fn(() => mockUser);
    });

    test('debe redirigir a /login si no hay sesión de usuario', () => {
        Storage.prototype.getItem = jest.fn(() => null);
        renderNewResena();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('debe permitir escribir en el título y comentario', () => {
        const { container } = renderNewResena();

        const tituloInput = container.querySelector('input[name="titulo"]');
        const comentarioTextarea = container.querySelector('textarea[name="comentario"]');

        fireEvent.change(tituloInput, { target: { value: 'Increíble taller', name: 'titulo' } });
        fireEvent.change(comentarioTextarea, { target: { value: 'Muy buen trato', name: 'comentario' } });

        expect(tituloInput.value).toBe('Increíble taller');
        expect(comentarioTextarea.value).toBe('Muy buen trato');
    });

    test('debe cambiar la calificación al hacer clic en las estrellas', () => {
        const { container } = renderNewResena();

        // El componente tiene 5 estrellas por defecto. Hacemos clic en la tercera.
        const stars = container.querySelectorAll('svg.lucide-star');
        fireEvent.click(stars[2]); // Índice 2 = 3 estrellas

        // Verificamos que las 3 primeras tengan el color de relleno #ffc107
        expect(stars[0].getAttribute('fill')).toBe('#ffc107');
        expect(stars[1].getAttribute('fill')).toBe('#ffc107');
        expect(stars[2].getAttribute('fill')).toBe('#ffc107');
        expect(stars[3].getAttribute('fill')).toBe('none');
    });

    test('debe mostrar el modal de éxito al publicar correctamente', async () => {
        axios.post.mockResolvedValue({ status: 200 });

        const { container } = renderNewResena();

        // Rellenar campos obligatorios
        fireEvent.change(container.querySelector('input[name="titulo"]'), { target: { value: 'Ok', name: 'titulo' } });
        fireEvent.change(container.querySelector('textarea[name="comentario"]'), { target: { value: 'Vale', name: 'comentario' } });

        const submitBtn = screen.getByRole('button', { name: /publicar reseña/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Buscamos el encabezado del modal para evitar problemas de texto fragmentado
            expect(screen.getByText(/Reseña guardada/i)).toBeInTheDocument();
        });
    });

    test('debe navegar a /resenas al aceptar el modal de éxito', async () => {
        axios.post.mockResolvedValue({ status: 201 });

        const { container } = renderNewResena();
        fireEvent.change(container.querySelector('input[name="titulo"]'), { target: { value: 'Título', name: 'titulo' } });
        fireEvent.change(container.querySelector('textarea[name="comentario"]'), { target: { value: 'Comentario', name: 'comentario' } });

        fireEvent.click(screen.getByRole('button', { name: /publicar reseña/i }));

        const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnAceptar);

        expect(mockNavigate).toHaveBeenCalledWith('/resenas');
    });

    test('debe mostrar alerta de error si falla la conexión con el servidor', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        window.alert = jest.fn();

        axios.post.mockRejectedValue(new Error('500 Internal Server Error'));

        const { container } = renderNewResena();
        fireEvent.change(container.querySelector('input[name="titulo"]'), { target: { value: 'T', name: 'titulo' } });
        fireEvent.change(container.querySelector('textarea[name="comentario"]'), { target: { value: 'C', name: 'comentario' } });

        fireEvent.click(screen.getByRole('button', { name: /publicar reseña/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("No se pudo enviar la reseña.");
        });

        consoleSpy.mockRestore();
    });
});