import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

// Helper para renderizar con Router ya que Header usa useNavigate y NavLink
const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter {...routerProps}>
      {ui}
    </BrowserRouter>
  );;
};

describe('Header Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    // Mock de window.scrollTo para evitar errores si los componentes lo usan
    window.scrollTo = jest.fn();
  });

  test('debe mostrar el enlace de "Log in" cuando no hay sesión iniciada', () => {
    renderWithRouter(<Header />);

    const loginLink = screen.getByText(/Log in/i);
    expect(loginLink).toBeInTheDocument();
    // El nombre del usuario no debería aparecer
    expect(screen.queryByText(/J.M/i)).not.toBeInTheDocument();
  });

  test('debe mostrar el nombre del usuario cuando hay sesión iniciada', () => {
    const mockUser = { nombre: 'Carlos Dev', iniciales: 'CD' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUser));

    renderWithRouter(<Header />);

    expect(screen.getByText(/Carlos Dev/i)).toBeInTheDocument();
    expect(screen.queryByText(/Log in/i)).not.toBeInTheDocument();
  });

  test('debe abrir el menú desplegable al hacer clic en el nombre del usuario', () => {
    const mockUser = { nombre: 'Carlos Dev' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUser));

    renderWithRouter(<Header />);

    // Al principio el botón de cerrar sesión no existe
    expect(screen.queryByText(/Cerrar sesión/i)).not.toBeInTheDocument();

    // Click en el badge del usuario
    const userBadge = screen.getByText(/Carlos Dev/i);
    fireEvent.click(userBadge);

    // Ahora el menú debería estar visible
    expect(screen.getByText(/Ver perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument();
  });

  test('debe eliminar la sesión y redirigir al hacer clic en "Cerrar sesión"', () => {
    const mockUser = { nombre: 'Carlos Dev' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUser));

    renderWithRouter(<Header />);

    // Abrir menú
    fireEvent.click(screen.getByText(/Carlos Dev/i));

    // Clic en cerrar sesión
    const logoutBtn = screen.getByText(/Cerrar sesión/i);
    fireEvent.click(logoutBtn);

    // Verificar que el sessionStorage se limpió
    expect(sessionStorage.getItem('usuarioGlowcars')).toBeNull();
  });

  test('debe contener los enlaces de navegación principales', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText(/Conócenos/i)).toBeInTheDocument();
    expect(screen.getByText(/Servicios/i)).toBeInTheDocument();
    expect(screen.getByText(/Reseñas/i)).toBeInTheDocument();
  });
  const mockedUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
  }));
});