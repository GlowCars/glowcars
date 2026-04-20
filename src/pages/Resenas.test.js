import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Resenas from './Resenas';

// Mocks
jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <Resenas />', () => {
    const mockResenasData = [
        {
            id_resena: 1,
            id_usuario: 10,
            calificacion: 5,
            comentario: "Excelente servicio",
            nombre: "Juan",
            apellidos: "Perez",
            fecha: "2024-03-20T10:00:00Z",
            titulo: "Muy bueno"
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Limpiamos el storage antes de cada test para evitar el error de JSON.parse
        Object.getPrototypeOf(sessionStorage).getItem = jest.fn().mockReturnValue(null);
    });

    const renderComponent = () => render(
        <BrowserRouter {...routerProps}>
            <Resenas />
        </BrowserRouter>
    );

    test('debe mostrar "Regístrate para opinar" si el usuario no está logueado', async () => {
        // Simulamos que el storage devuelve null explícitamente
        sessionStorage.getItem.mockReturnValue(null);
        axios.get.mockResolvedValueOnce({ data: [] });

        renderComponent();

        const btn = await screen.findByText(/Regístrate para opinar/i);
        expect(btn).toBeInTheDocument();
    });
test('debe navegar a /newResena al hacer clic en el botón "Añadir reseña"', async () => {
    // 1. Mock de Axios para que no de error al cargar la página
    axios.get.mockResolvedValueOnce({ data: [] });

    // 2. Simulamos que hay un usuario logueado para que aparezca el botón correcto
    const usuarioMock = { nombre: 'Test', iniciales: 'TE' };
    jest.spyOn(Object.getPrototypeOf(sessionStorage), 'getItem').mockReturnValue(JSON.stringify(usuarioMock));

    render(
        <BrowserRouter {...routerProps}>
            <Resenas />
        </BrowserRouter>
    );

    // 3. Buscamos el botón (ahora sí debería aparecer)
    // Usamos findBy porque al haber un useEffect, el botón puede tardar un milisegundo en renderizarse
    const btnAnadir = await screen.findByRole('button', { name: /Añadir reseña/i });

    // 4. Clic y comprobación
    fireEvent.click(btnAnadir);
    expect(mockNavigate).toHaveBeenCalledWith('/newResena');
});
    test('debe cargar y mostrar las reseñas desde la API', async () => {
        axios.get.mockResolvedValueOnce({ data: mockResenasData });
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Excelente servicio')).toBeInTheDocument();
            expect(screen.getByText('Juan Perez')).toBeInTheDocument();
        });
    });

    test('debe navegar a /modificarResena al hacer clic en el icono de editar', async () => {
        // Simulamos usuario logueado que es dueño de la reseña 1
        sessionStorage.getItem.mockReturnValue(JSON.stringify({ id: 10, nombre: "Juan" }));
        axios.get.mockResolvedValueOnce({ data: mockResenasData });

        renderComponent();

        // Buscamos el contenedor de la reseña
        await waitFor(() => expect(screen.getByText('Excelente servicio')).toBeInTheDocument());

        // Buscamos el icono mediante su clase de Lucide (usando selector de DOM ya que fireEvent lo necesita)
        const btnEditar = document.querySelector('.lucide-pencil');
        expect(btnEditar).toBeInTheDocument();

        fireEvent.click(btnEditar);

        expect(mockNavigate).toHaveBeenCalledWith('/modificarResena', expect.any(Object));
    });

    test('debe abrir el modal de eliminación al hacer clic en borrar', async () => {
        sessionStorage.getItem.mockReturnValue(JSON.stringify({ id: 10, nombre: "Juan" }));
        axios.get.mockResolvedValueOnce({ data: mockResenasData });

        renderComponent();

        await waitFor(() => expect(screen.getByText('Excelente servicio')).toBeInTheDocument());

        const btnBorrar = document.querySelector('.lucide-trash2');
        fireEvent.click(btnBorrar);

        // Verificar que el modal se abre
        expect(screen.getByText(/Eliminación de reseña/i)).toBeInTheDocument();
        expect(screen.getByText(/Se va proceder a eliminar la reseña/i)).toBeInTheDocument();
    });

    test('debe completar el flujo de borrado exitoso', async () => {
        sessionStorage.getItem.mockReturnValue(JSON.stringify({ id: 10, nombre: "Juan" }));
        axios.get.mockResolvedValueOnce({ data: mockResenasData });
        axios.delete.mockResolvedValueOnce({ status: 200 });

        renderComponent();

        await waitFor(() => expect(screen.getByText('Excelente servicio')).toBeInTheDocument());

        // Abrir modal
        fireEvent.click(document.querySelector('.lucide-trash2'));

        // Clic en el botón "Eliminar" del modal
        const btnConfirmar = screen.getByRole('button', { name: /Eliminar/i });
        fireEvent.click(btnConfirmar);

        // Verificar modal de éxito
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled();
            // Usamos una función buscadora más flexible para encontrar el texto
            expect(screen.getByText((content, element) => {
                return content.includes('eliminada correctamente');
            })).toBeInTheDocument();
        }, { timeout: 2000 }); // Damos un poco más de margen de tiempo
    });
});