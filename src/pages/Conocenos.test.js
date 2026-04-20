import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Conocenos from './Conocenos';

// Mock de los componentes Header y Footer para evitar errores de rutas o dependencias internas
jest.mock('../common/header.js', () => () => <header data-testid="mock-header">Header</header>);
jest.mock('../common/footer.js', () => () => <footer data-testid="mock-footer">Footer</footer>);

// Mock de la imagen para evitar problemas con la carga de assets
jest.mock('../images/mapa.png', () => 'test-file-stub');

const routerProps = {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Pruebas en el componente <Conocenos />', () => {
    
    test('debe renderizar correctamente la estructura básica (Header, Main, Footer)', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Conocenos />
            </BrowserRouter>
        );

        // Verificar componentes de estructura
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('debe mostrar la misión y la información de ubicación', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Conocenos />
            </BrowserRouter>
        );

        // Verificar texto de la misión
        expect(screen.getByText(/Taller mecánico en Fuenlabrada/i)).toBeInTheDocument();
        
        // Verificar dirección física
        expect(screen.getByText(/Pº de Puerto Rico, 1 - Fuenlabrada/i)).toBeInTheDocument();
        
        // Verificar botón/título de contacto
        expect(screen.getByText(/¡CONTÁCTANOS!/i)).toBeInTheDocument();
    });

    test('debe renderizar la imagen del mapa con el atributo alt correcto', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Conocenos />
            </BrowserRouter>
        );

        const imagenMapa = screen.getByAltText('Mapa');
        expect(imagenMapa).toBeInTheDocument();
        expect(imagenMapa).toHaveAttribute('src', 'test-file-stub');
    });

    test('debe mostrar los tres valores clave del taller', () => {
        render(
            <BrowserRouter {...routerProps}>
                <Conocenos />
            </BrowserRouter>
        );

        // Verificar los títulos de los valores
        expect(screen.getByText(/CALIDAD CERTIFICADA/i)).toBeInTheDocument();
        expect(screen.getByText(/TRANSPARENCIA/i)).toBeInTheDocument();
        expect(screen.getByText(/EQUIPO EXPERTO/i)).toBeInTheDocument();

        // Verificar que las descripciones también existan
        expect(screen.getByText(/Utilizamos piezas originales/i)).toBeInTheDocument();
        expect(screen.getByText(/Presupuestos claros y sin letra pequeña/i)).toBeInTheDocument();
    });

    test('debe verificar que los iconos de Lucide se renderizan (por clase o contenedor)', () => {
        const { container } = render(
            <BrowserRouter {...routerProps}>
                <Conocenos />
            </BrowserRouter>
        );

        // Lucide renderiza SVGs. Verificamos que existan al menos 4 (Heart, Award, Target, UserCircle)
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThanOrEqual(4);
    });
});