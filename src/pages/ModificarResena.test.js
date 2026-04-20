import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ModificarResena from './ModificarResena';

// Mock de Axios
jest.mock('axios');

// Mock de navegación y datos de la ubicación
const mockNavigate = jest.fn();
const mockResena = {
    id_resena: 123,
    calificacion: 4,
    titulo: 'Excelente servicio',
    texto: 'Me encantó la atención en Glowcars.'
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: { resena: mockResena }
    })
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <ModificarResena />', () => {

    const renderModificarResena = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <ModificarResena />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe cargar los datos iniciales de la reseña correctamente', () => {
        const { container } = renderModificarResena();

        // Verificar título
        const tituloInput = container.querySelector('input[name="titulo"]');
        expect(tituloInput.value).toBe(mockResena.titulo);

        // Verificar comentario (textarea)
        const comentarioInput = container.querySelector('textarea[name="comentario"]');
        expect(comentarioInput.value).toBe(mockResena.texto);

        // Verificar que las estrellas reflejan la calificación inicial (4 estrellas)
        // Buscamos los SVGs de Lucide (Star)
        const stars = container.querySelectorAll('svg.lucide-star');
        const filledStars = Array.from(stars).filter(star => star.getAttribute('fill') === '#ffc107');
        expect(filledStars.length).toBe(4);
    });

    test('debe cambiar la calificación al hacer clic en una estrella', () => {
        const { container } = renderModificarResena();
        const stars = container.querySelectorAll('svg.lucide-star');

        // Hacer clic en la quinta estrella
        fireEvent.click(stars[4]);

        const filledStars = Array.from(stars).filter(star => star.getAttribute('fill') === '#ffc107');
        expect(filledStars.length).toBe(5);
    });

    test('debe permitir modificar el título y el comentario', () => {
        const { container } = renderModificarResena();

        const tituloInput = container.querySelector('input[name="titulo"]');
        const comentarioInput = container.querySelector('textarea[name="comentario"]');

        fireEvent.change(tituloInput, { target: { value: 'Título Editado', name: 'titulo' } });
        fireEvent.change(comentarioInput, { target: { value: 'Comentario editado', name: 'comentario' } });

        expect(tituloInput.value).toBe('Título Editado');
        expect(comentarioInput.value).toBe('Comentario editado');
    });

    test('debe mostrar el modal de éxito cuando la respuesta de axios es correcta', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarResena();
        const submitBtn = screen.getByRole('button', { name: /modificar reseña/i });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/reseña modificada correctamente/i)).toBeInTheDocument();
        });
    });

    test('debe navegar a /resenas al aceptar el modal', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarResena();
        const submitBtn = screen.getByRole('button', { name: /modificar reseña/i });
        fireEvent.click(submitBtn);

        // Esperar a que el modal aparezca y clickear Aceptar
        const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnAceptar);

        expect(mockNavigate).toHaveBeenCalledWith('/resenas');
    });

    test('debe mostrar alerta de error si la petición falla', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        window.alert = jest.fn();

        axios.put.mockRejectedValue(new Error('Error de servidor'));

        renderModificarResena();
        const submitBtn = screen.getByRole('button', { name: /modificar reseña/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("No se pudieron guardar los cambios.");
        });

        consoleSpy.mockRestore();
    });
});