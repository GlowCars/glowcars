import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ModificarVehiculo from './ModificarVehiculo';

// Mock de Axios
jest.mock('axios');

// Mock de navegación y datos iniciales
const mockNavigate = jest.fn();
const mockVehiculo = {
    id_vehiculo: 10,
    matricula: '1234ABC',
    marca: 'Seat',
    modelo: 'Ibiza',
    fc_mat: '2020',
    bastidor: 'ZVW123456789'
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: { vehiculo: mockVehiculo }
    })
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en <ModificarVehiculo />', () => {

    const renderModificarVehiculo = () => {
        return render(
            <BrowserRouter {...routerProps}>
                <ModificarVehiculo />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock de sessionStorage para el usuario
        const usuarioSesion = JSON.stringify({ id: 1, nombre: 'Juan', apellidos: 'Pérez' });
        Storage.prototype.getItem = jest.fn(() => usuarioSesion);
    });

    test('debe cargar los datos del vehículo en el formulario', () => {
        const { container } = renderModificarVehiculo();

        expect(container.querySelector('input[name="matricula"]').value).toBe(mockVehiculo.matricula);
        expect(container.querySelector('input[name="marca"]').value).toBe(mockVehiculo.marca);
        expect(container.querySelector('input[name="modelo"]').value).toBe(mockVehiculo.modelo);
        expect(container.querySelector('input[name="fc_mat"]').value).toBe(mockVehiculo.fc_mat);
        expect(container.querySelector('input[name="bastidor"]').value).toBe(mockVehiculo.bastidor);
    });

    test('debe permitir modificar los campos del vehículo', () => {
        const { container } = renderModificarVehiculo();

        const marcaInput = container.querySelector('input[name="marca"]');
        const añoInput = container.querySelector('input[name="fc_mat"]');

        fireEvent.change(marcaInput, { target: { value: 'Audi', name: 'marca' } });
        fireEvent.change(añoInput, { target: { value: '2022', name: 'fc_mat' } });

        expect(marcaInput.value).toBe('Audi');
        expect(añoInput.value).toBe('2022');
    });

    test('no debe permitir más de 4 caracteres en el campo año (fc_mat)', () => {
        const { container } = renderModificarVehiculo();
        const añoInput = container.querySelector('input[name="fc_mat"]');

        // Simulamos input de 5 dígitos
        fireEvent.input(añoInput, { target: { value: '20225' } });

        // El componente tiene un slice(0, 4) en onInput
        expect(añoInput.value).toBe('2022');
    });

    test('debe mostrar el modal de éxito tras una actualización correcta', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarVehiculo();
        const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });

        fireEvent.click(submitBtn);

        // Buscamos el texto exacto que aparece en el h3 de tu modal
        await waitFor(() => {
            expect(screen.getByText(/Vehículo modificado/i)).toBeInTheDocument();
        });
    });

    test('debe navegar a /perfil al aceptar el modal', async () => {
        axios.put.mockResolvedValue({ status: 200 });

        renderModificarVehiculo();
        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        const btnAceptar = await screen.findByRole('button', { name: /aceptar/i });
        fireEvent.click(btnAceptar);

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });

    test('debe mostrar una alerta si axios falla', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        window.alert = jest.fn();

        axios.put.mockRejectedValue(new Error('Error de red'));

        renderModificarVehiculo();
        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("No se pudieron guardar los cambios.");
        });

        consoleSpy.mockRestore();
    });

    test('debe redirigir a /perfil si no hay datos de vehículo en el estado', () => {
        // Forzamos que useLocation no devuelva vehículo para este test específico
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValueOnce({
            state: null
        });

        renderModificarVehiculo();

        expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });
});