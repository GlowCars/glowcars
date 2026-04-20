import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    const mockUser = { id: 1, nombre: 'Juan', email: 'juan@test.com' };

    beforeEach(() => {
        jest.clearAllMocks();
        // Simulamos el sessionStorage
        Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUser));
        Storage.prototype.setItem = jest.fn();

        // Mocks de las respuestas de API iniciales
        axios.get.mockResolvedValue({
            data: { nombre: 'Juan', apellidos: 'Pérez', telefono: '600112233', email: 'juan@test.com' }
        });
        axios.post.mockImplementation((url) => {
            if (url.includes('vehiculos')) return Promise.resolve({ data: [{ id_vehiculo: 10, marca: 'Tesla', modelo: 'Model 3', matricula: '1234BBB' }] });
            if (url.includes('citas')) return Promise.resolve({ data: [{ id_cita: 50, tipo_cita: 'Revisión', motivo: 'Anual', estado_cita: 'Pendiente' }] });
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
        // Configuramos el mock de la respuesta exitosa
        axios.put.mockResolvedValue({ status: 200 });

        renderComponent();

        // 1. Buscamos el botón de modificar (ahora con la letra 'i' corregida)
        const btnModificar = await screen.findByRole('button', { name: /Modificar datos/i });
        fireEvent.click(btnModificar);

        // 2. Verificar que aparece el modal de confirmación por su encabezado
        const tituloModal = await screen.findByText(/Modificación de datos/i);
        expect(tituloModal).toBeInTheDocument();

        // 3. Seleccionamos el botón 'Aceptar' del modal.
        // Como hay varios modales en el DOM, usamos getAll y pillamos el primero 
        const botonesAceptar = screen.getAllByRole('button', { name: /Aceptar/i });
        fireEvent.click(botonesAceptar[0]);

        // 4. Verificamos la llamada a la API y el mensaje de éxito final
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalled();
            // Nota: Asegúrate de que el mensaje de éxito también esté corregido en tu JS 
            // (en tu código original pusiste "Usuario moficado" sin la 'di')
            expect(screen.getByText(/Usuario modificado/i)).toBeInTheDocument();
        });
    });

    test('debe eliminar un vehículo tras confirmar en el modal', async () => {
        axios.delete.mockResolvedValue({ status: 200 });
        const { container } = renderComponent();

        // Esperar a que cargue la tabla
        await screen.findByText('Tesla');

        // Buscar icono de basura (Trash2). En lucide-react suelen ser SVG.
        const deleteIcons = container.querySelectorAll('svg.lucide-trash2');
        fireEvent.click(deleteIcons[0]); // El primero es de vehículos

        expect(screen.getByText(/¿Eliminar vehículo?/i)).toBeInTheDocument();

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

    test('debe navegar a la pantalla de alta de vehículo al hacer click en el botón', async () => {
        renderComponent();
        const btnAdd = await screen.findByRole('button', { name: /Añadir vehículo/i });
        fireEvent.click(btnAdd);
        expect(mockNavigate).toHaveBeenCalledWith('/altaVehiculo');
    });

    test('debe abrir modal de cancelación de cita y borrarla', async () => {
        axios.delete.mockResolvedValue({ status: 200 });
        const { container } = renderComponent();

        await screen.findByText('Revisión');
        const deleteIcons = container.querySelectorAll('svg.lucide-trash2');
        // El segundo icono Trash2 (índice 1) pertenece a la sección de citas
        fireEvent.click(deleteIcons[1]);

        expect(screen.getByText(/Cancelar cita/i)).toBeInTheDocument();

        const btnConfirmar = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(btnConfirmar);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/deleteCita/50'));
            expect(screen.getByText('Cita cancelada')).toBeInTheDocument();
        });
    });
});