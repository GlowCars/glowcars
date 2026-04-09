import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de sessionStorage para controlar el login en los tests
beforeEach(() => {
  sessionStorage.clear();
});

describe('Pruebas de enrutamiento en App.js', () => {
  
  test('debe mostrar la página de Home por defecto (ruta raíz)', () => {
    render(<App />);
    const titulos = screen.getAllByText(/Glowcars/i);
    expect(titulos.length).toBeGreaterThan(0);
    expect(titulos[0]).toBeInTheDocument();
  });

  test('debe redirigir a Login si el usuario intenta entrar a Perfil sin estar logueado', () => {
    window.history.pushState({}, 'Test page', '/perfil');

    render(<App />);

    const loginHeader = screen.getByText(/Has olvidado la contraseña/i); 
    expect(loginHeader).toBeInTheDocument();
  });

  test('debe permitir el acceso a Perfil si el usuario está logueado', () => {
    const mockUser = JSON.stringify({ id: 1, nombre: 'Test User' });
    sessionStorage.setItem('usuarioGlowcars', mockUser);

    window.history.pushState({}, 'Test page', '/perfil');

    render(<App />);

    const perfilElement = screen.getByText(/Añadir vehículo/i);
    expect(perfilElement).toBeInTheDocument();
  });

  test('debe redirigir a Home si la ruta no existe (comodín *)', () => {
    window.history.pushState({}, 'Test page', '/ruta-que-no-existe');

    render(<App />);

    const homeElement = screen.getByText(/Bienvenidos a Glowcars/i);
    expect(homeElement).toBeInTheDocument();
  });
});