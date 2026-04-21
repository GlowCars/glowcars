import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ModificarCitas from './ModificarCita';

// Mock de Axios
jest.mock('axios');

// Mocks de navegación
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

// Datos de prueba
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
    useLocation: () => mockUseLocation(),
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <ModificarCitas />', () => {

    const renderModificarCitas = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <ModificarCitas />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // IMPORTANTE: Por defecto, todos los tests tienen una cita válida
        // Esto evita el error "cannot read state of undefined"
        mockUseLocation.mockReturnValue({
            state: { cita: mockCita }
        });
    });

    test('debe cargar los datos de la cita en los campos correspondientes', () => {
        const { container } = renderModificarCitas();

        const vehiculoInput = container.querySelector('input[name="vehiculo"]');
        expect(vehiculoInput.value).toBe('Toyota Corolla');
        expect(vehiculoInput).toBeDisabled();

        const fechaInput = container.querySelector('input[name="fecha"]');
        expect(fechaInput.value).toBe('2026-05-20');

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

        renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/cita modificada/i)).toBeInTheDocument();
        });
    });

    test('debe navegar a /perfil al cerrar el modal de éxito', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
        fireEvent.click(submitBtn);

        const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnAceptar);

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });

    test('debe mostrar un error si la petición de axios falla', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        window.alert = jest.fn();

        axios.put.mockRejectedValue(new Error('Network Error'));

        renderModificarCitas();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("No se pudo modificar la cita");
        });

        consoleSpy.mockRestore();
    });

    test('debe redirigir a /perfil si no existe citaData (location.state es null)', () => {
        // Aquí SOBREESCRIBIMOS el mock solo para este test
        mockUseLocation.mockReturnValue({
            state: null
        });

        renderModificarCitas();

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });

    test('no debe redirigir si existe citaData en el state', () => {
        // Este test usa el valor por defecto del beforeEach
        renderModificarCitas();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});