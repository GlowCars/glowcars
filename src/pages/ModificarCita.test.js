import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ModifcarCitas from './ModificarCita';

// Mock de Axios
jest.mock('axios');

// Mock de useNavigate y useLocation
const mockNavigate = jest.fn();
const mockCita = {
    id_cita: 1,
    marca: 'Toyota',
    modelo: 'Corolla',
    fecha_solicitud: '2026-05-20T00:00:00.000Z',
    tipo_cita: 'Revisión',
    motivo: 'Cambio de aceite',
    estado_cita: 'Pendiente'
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: { cita: mockCita }
    })
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <ModifcarCitas />', () => {

    const renderModificarCitas = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <ModifcarCitas />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe cargar los datos de la cita en los campos correspondientes', () => {
        const { container } = renderModificarCitas();

        // Verificar vehículo (está deshabilitado)
        const vehiculoInput = container.querySelector('input[name="vehiculo"]');
        expect(vehiculoInput.value).toBe('Toyota Corolla');
        expect(vehiculoInput).toBeDisabled();

        // Verificar fecha (formateada)
        const fechaInput = container.querySelector('input[name="fecha"]');
        expect(fechaInput.value).toBe('2026-05-20');

        // Verificar motivo
        const motivoInput = container.querySelector('input[name="motivo"]');
        expect(motivoInput.value).toBe('Cambio de aceite');
    });

    test('debe permitir cambiar el motivo y la fecha', () => {
        const { container } = renderModificarCitas();

        const motivoInput = container.querySelector('input[name="motivo"]');
        const fechaInput = container.querySelector('input[name="fecha"]');

        fireEvent.change(motivoInput, { target: { value: 'Nueva avería', name: 'motivo' } });
        fireEvent.change(fechaInput, { target: { value: '2026-06-15', name: 'fecha' } });

        expect(motivoInput.value).toBe('Nueva avería');
        expect(fechaInput.value).toBe('2026-06-15');
    });

    test('debe mostrar el modal de éxito al actualizar correctamente', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        const { container } = renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });

        fireEvent.click(submitBtn);

        // Esperar a que aparezca el modal
        await waitFor(() => {
            expect(screen.getByText(/cita modificada/i)).toBeInTheDocument();
        });
    });

    test('debe navegar a /perfil al cerrar el modal de éxito', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
        fireEvent.click(submitBtn);

        // Esperar y hacer clic en Aceptar
        const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnAceptar);

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });

    test('debe mostrar un error si la petición de axios falla', async () => {
        // Mock de console.error para que no ensucie la terminal del test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        window.alert = jest.fn(); // Mock del alert

        axios.put.mockRejectedValue(new Error('Network Error'));

        renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("No se pudo modificar la cita");
        });

        consoleSpy.mockRestore();
    });
});