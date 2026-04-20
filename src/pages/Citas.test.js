import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Citas from './Citas';

// 1. Mock de Axios
jest.mock('axios');

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

const mockUser = { id: '123', nombre: 'Juan', apellidos: 'Pérez' };
const mockVehiculos = [
    { id_vehiculo: '1', matricula: '1234ABC', marca: 'Toyota', modelo: 'Corolla' }
];

describe('Pruebas en el componente <Citas />', () => {
    
    // Silenciamos el error de las "keys" de React ya que no podemos editar Citas.js
    const originalError = console.error;
    beforeAll(() => {
        console.error = (...args) => {
            if (args[0].includes('Each child in a list should have a unique "key" prop')) return;
            originalError(...args);
        };
    });

    afterAll(() => {
        console.error = originalError;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUser));
        
        axios.post.mockImplementation((url) => {
            if (url.includes('/vehiculos')) {
                return Promise.resolve({ data: mockVehiculos });
            }
            if (url.includes('/createCita')) {
                return Promise.resolve({ data: { success: true } });
            }
            return Promise.reject(new Error('URL no encontrada'));
        });
    });

    test('debe cargar los datos del usuario y los vehículos al montar', async () => {
        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        // Buscamos el nombre del usuario (usamos getAll porque aparece en varios sitios)
        const userNames = screen.getAllByText(mockUser.nombre);
        expect(userNames.length).toBeGreaterThan(0);

        await waitFor(() => {
            expect(screen.getByText(/1234ABC Toyota Corolla/i)).toBeInTheDocument();
        });
    });

    test('debe enviar el formulario correctamente y navegar', async () => {
        window.alert = jest.fn();

        await act(async () => {
            render(
                <BrowserRouter {...routerProps}>
                    <Citas />
                </BrowserRouter>
            );
        });

        // SOLUCIÓN AL ERROR DE COMBOBOX: Seleccionamos por el atributo 'name'
        const selectVehiculo = document.querySelector('select[name="vehiculo"]');
        fireEvent.change(selectVehiculo, { target: { value: '1', name: 'vehiculo' } });

        const selectTipo = document.querySelector('select[name="tipo"]');
        fireEvent.change(selectTipo, { target: { value: 'Reparación', name: 'tipo' } });

        const inputFecha = document.getElementById('fecha-input');
        fireEvent.change(inputFecha, { target: { value: '2026-05-20', name: 'fecha' } });

        const inputMotivo = screen.getByPlaceholderText(/Motivo/i);
        fireEvent.change(inputMotivo, { target: { value: 'Revisión anual', name: 'motivo' } });

        const btnSubmit = screen.getByRole('button', { name: /Solicitar cita/i });
        
        await act(async () => {
            fireEvent.click(btnSubmit);
        });

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/createCita',
                expect.objectContaining({
                    vehiculo: '1',
                    tipo: 'Reparación',
                    motivo: 'Revisión anual'
                })
            );
        });
    });
});