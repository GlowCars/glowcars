import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Perfil from './Perfil';

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

describe('Pruebas en <Perfil />', () => {
    // Definimos un usuario base para evitar que los inputs sean 'undefined'
    const mockUserResponse = {
        id_usuario: 1,
        nombre: 'Juan',
        apellidos: 'Pérez',
        telefono: '600112233',
        email: 'juan@test.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock consistente de sessionStorage
        const sessionUser = { id: 1, nombre: 'Juan' };
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'usuarioGlowcars') return JSON.stringify(sessionUser);
            return null;
        });
        Storage.prototype.setItem = jest.fn();

        // Mocks por defecto: siempre devolver valores definidos (evita controlled/uncontrolled error)
        axios.get.mockResolvedValue({ data: mockUserResponse });

        axios.post.mockImplementation((url) => {
            if (url.includes('vehiculos')) {
                return Promise.resolve({ data: [{ id_vehiculo: 10, marca: 'Tesla', modelo: 'Model 3', matricula: '1234BBB' }] });
            }
            if (url.includes('citas')) {
                return Promise.resolve({ data: [{ id_cita: 50, tipo_cita: 'Revisión', motivo: 'Anual', estado_cita: 'Pendiente' }] });
            }
            return Promise.resolve({ data: [] });
        });
    });

    const renderComponent = () => render(
        <BrowserRouter {...routerProps}>
            <Perfil />
        </BrowserRouter>
    );

    test('debe redirigir a /login si no hay sesión', () => {
        Storage.prototype.getItem = jest.fn(() => null);
        renderComponent();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('debe cargar y mostrar los datos del usuario, vehículos y citas', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
            expect(screen.getByText('Tesla')).toBeInTheDocument();
            expect(screen.getByText('Revisión')).toBeInTheDocument();
        });
    });

    test('debe actualizar los inputs de datos personales', async () => {
        renderComponent();
        const inputNombre = await screen.findByPlaceholderText('Nombre');
        fireEvent.change(inputNombre, { target: { value: 'Carlos', name: 'nombre' } });
        expect(inputNombre.value).toBe('Carlos');
    });

    test('debe abrir el modal de confirmación y actualizar el usuario', async () => {
        axios.put.mockResolvedValue({ status: 200 });
        renderComponent();

        const btnModificar = await screen.findByRole('button', { name: /Modificar datos/i });
        fireEvent.click(btnModificar);

        const tituloModal = await screen.findByText(/Modificación de datos/i);
        expect(tituloModal).toBeInTheDocument();

        const botonesAceptar = screen.getAllByRole('button', { name: /Aceptar/i });
        fireEvent.click(botonesAceptar[0]);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalled();
            expect(screen.getByText(/Usuario modificado/i)).toBeInTheDocument();
        });
    });

    test('debe eliminar un vehículo tras confirmar en el modal', async () => {
        axios.delete.mockResolvedValue({ status: 200 });
        const { container } = renderComponent();

        await screen.findByText('Tesla');
        const deleteIcons = container.querySelectorAll('svg.lucide-trash2');
        fireEvent.click(deleteIcons[0]);

        const btnConfirmar = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(btnConfirmar);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/deleteCar/10'));
            expect(screen.getByText('Vehículo eliminado')).toBeInTheDocument();
        });
    });

    test('debe mostrar modal de error si el vehículo tiene citas asociadas al intentar borrar', async () => {
        axios.delete.mockRejectedValue(new Error('Conflict'));
        const { container } = renderComponent();

        await screen.findByText('Tesla');
        const deleteIcons = container.querySelectorAll('svg.lucide-trash2');
        fireEvent.click(deleteIcons[0]);

        const btnConfirmar = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(btnConfirmar);

        await waitFor(() => {
            expect(screen.getByText(/No se ha podido eliminar el vehículo/i)).toBeInTheDocument();
        });
    });

    test('debe abrir modal de cancelación de cita y borrarla', async () => {
        axios.delete.mockResolvedValue({ status: 200 });
        const { container } = renderComponent();

        await screen.findByText('Revisión');
        const deleteIcons = container.querySelectorAll('svg.lucide-trash2');
        fireEvent.click(deleteIcons[1]);

        expect(screen.getByText(/Cancelar cita/i)).toBeInTheDocument();

        const btnConfirmar = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(btnConfirmar);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/deleteCita/50'));
            expect(screen.getByText('Cita cancelada')).toBeInTheDocument();
        });
    });

    test('fetchDatos debe capturar el error y mostrarlo en consola si la petición falla', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        axios.post.mockRejectedValueOnce(new Error('Error de red'));

        renderComponent();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Error al obtener datos:", expect.any(Error));
        });
        consoleSpy.mockRestore();
    });

    test('debe limitar el input de teléfono a un máximo de 9 dígitos mediante onInput', async () => {
        // Mock específico para este test con teléfono vacío pero definido
        axios.get.mockResolvedValueOnce({
            data: { ...mockUserResponse, telefono: '' }
        });

        renderComponent();
        const inputTelefono = await screen.findByPlaceholderText(/teléfono/i);

        fireEvent.input(inputTelefono, {
            target: { value: '66677788899', name: 'telefono' }
        });

        expect(inputTelefono.value).toBe('666777888');
        expect(inputTelefono.value).toHaveLength(9);
    });

    test('debe cerrar el modal de éxito de usuario al hacer clic en el botón Aceptar', async () => {
        axios.put.mockResolvedValueOnce({ status: 200 });
        renderComponent();

        const btnModificar = await screen.findByRole('button', { name: /modificar datos/i });
        fireEvent.click(btnModificar);

        const btnConfirmar = await screen.findByRole('button', { name: /^aceptar$/i });
        fireEvent.click(btnConfirmar);

        const btnCerrarExito = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnCerrarExito);

        await waitFor(() => {
            expect(screen.queryByText(/usuario modificado/i)).not.toBeInTheDocument();
        });
    });
});