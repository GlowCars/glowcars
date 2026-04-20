import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// 1. Mock de las imágenes para evitar errores de carga
jest.mock('../images/fondo.jpeg', () => 'fondo-stub');
jest.mock('../images/coche.jpg', () => 'coche-stub');

// 2. Mock de Header y Footer (componentes estructurales)
jest.mock('../common/header.js', () => () => <header data-testid="mock-header">Header</header>);
jest.mock('../common/footer.js', () => () => <footer data-testid="mock-footer">Footer</footer>);

// 3. Mock de useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en el componente <Home />', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe renderizar los elementos principales (título, texto e imágenes)', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Home />
            </BrowserRouter>
        );

        // Verificar Título principal
        expect(screen.getByText(/Bienvenidos a GlowCars/i)).toBeInTheDocument();
        
        // Verificar texto de bienvenida
        expect(screen.getByText(/Somos un taller que ofrece el servicio que necesite/i)).toBeInTheDocument();

        // Verificar que las imágenes están presentes por su alt text
        expect(screen.getByAltText('Taller')).toBeInTheDocument();
        expect(screen.getByAltText('Coche')).toBeInTheDocument();
    });

    test('el botón "Visítanos" debe navegar a /conocenos', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Home />
            </BrowserRouter>
        );

        const btnVisitanos = screen.getByRole('button', { name: /Visítanos/i });
        fireEvent.click(btnVisitanos);

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/conocenos');
    });

    test('el botón "Servicios" debe navegar a /servicios', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Home />
            </BrowserRouter>
        );

        const btnServicios = screen.getByRole('button', { name: /Servicios/i });
        fireEvent.click(btnServicios);

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/servicios');
    });

    test('el botón "Citas" debe navegar a /citas', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Home />
            </BrowserRouter>
        );

        const btnCitas = screen.getByRole('button', { name: /Citas/i });
        fireEvent.click(btnCitas);

        expect(mockedUsedNavigate).toHaveBeenCalledWith('/citas');
    });

    test('debe mostrar los componentes Header y Footer', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
});