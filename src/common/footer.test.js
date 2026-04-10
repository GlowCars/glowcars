import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Pruebas Unitarias - Footer Component', () => {
  
  test('debe mostrar la información de contacto correctamente (Teléfono, Email y Horario)', () => {
    render(<Footer />);

    // Verificamos el Teléfono
    expect(screen.getByText(/91 123 456/i)).toBeInTheDocument();
    expect(screen.getByText(/¡LLAMANOS!/i)).toBeInTheDocument();

    // Verificamos el Email
    expect(screen.getByText(/glowcars@taller.com/i)).toBeInTheDocument();
    
    // Verificamos el Horario
    expect(screen.getByText(/L-V 9:00 a 20:00/i)).toBeInTheDocument();
  });

  test('debe renderizar la sección de copyright con el año y nombre de marca', () => {
    render(<Footer />);

    // Buscamos el texto que añadimos en copyrightStyle
    const copyright = screen.getByText(/© 2026 GLOWCARS. Todos los derechos reservados./i);
    expect(copyright).toBeInTheDocument();
  });

  test('debe aplicar los estilos de color de fondo y texto correctamente', () => {
    render(<Footer />);
    
    // Buscamos el elemento footer por su rol
    const footerElement = screen.getByRole('contentinfo'); 
    
    // Verificamos el color de fondo oscuro que definiste (#0A3A47)
    // Nota: Jest convierte los colores a formato RGB
    expect(footerElement).toHaveStyle({ backgroundColor: 'rgb(10, 58, 71)' });
  });
});