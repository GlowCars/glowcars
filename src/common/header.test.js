import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';

// Variables de control para los mocks
let mockLocation = { pathname: '/home' };
const mockNavigate = jest.fn();

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const routerProps = {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockLocation = { pathname: '/home' };
    window.scrollTo = jest.fn();
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter {...routerProps}>
        <Header />
      </BrowserRouter>
    );
  };

  test('debe mostrar el nombre del usuario si hay sesión', () => {
    const mockUser = { nombre: 'Pepe' };
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify(mockUser));

    renderHeader();

    expect(screen.getByText(/Pepe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Log in/i)).not.toBeInTheDocument();
  });

  test('debe abrir el menú y mostrar "Ver perfil" al hacer clic', () => {
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify({ nombre: 'Pepe' }));
    renderHeader();

    fireEvent.click(screen.getByText(/Pepe/i));

    expect(screen.getByText(/Ver perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument();
  });

  test('handleLogout debe limpiar sesión y navegar a home', () => {
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify({ nombre: 'Pepe' }));
    renderHeader();

    fireEvent.click(screen.getByText(/Pepe/i)); // Abrir menú
    fireEvent.click(screen.getByText(/Cerrar sesión/i));

    expect(sessionStorage.getItem('usuarioGlowcars')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('debe redirigir a /login si el usuario no está logueado y entra en ruta protegida', async () => {
    // 1. Forzamos que la sesión sea null para que entre en el ELSE del switch
    sessionStorage.clear();

    // 2. IMPORTANTE: Para que no explote el JSON.parse(session) cuando session es null,
    // tenemos que mockear el comportamiento de sessionStorage solo para este test
    // o asegurarnos de que la ruta sea protegida.

    mockLocation = { pathname: '/perfil' };

    await act(async () => {
      renderHeader();
    });

    // 3. USAMOS mockNavigate
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('debe navegar a /perfil al hacer clic en el botón de ver perfil', () => {
    // Preparación igual al anterior
    sessionStorage.setItem('usuarioGlowcars', JSON.stringify({ nombre: 'Pepe' }));
    renderHeader();

    // Paso 1: Abrir el menú
    fireEvent.click(screen.getByText(/Pepe/i));

    // Paso 2: Hacer clic en el botón que acaba de aparecer
    const btnPerfil = screen.getByText(/Ver perfil/i);
    fireEvent.click(btnPerfil);

    // Paso 3: Verificar la navegación (la lógica de handleToPerfile)
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  test('debe navegar a /home al hacer clic en el logo o el nombre de la marca', () => {
    // 1. Renderizamos el componente
    render(
      <BrowserRouter {...routerProps}>
        <Header />
      </BrowserRouter>
    );

    // 2. Buscamos el contenedor que tiene el logo (por el texto "GLOWCARS")
    const brandContainer = screen.getByText(/GLOWCARS/i).closest('div');

    // 3. Simulamos el clic
    fireEvent.click(brandContainer);

    // 4. Verificamos que se llamó a navigate con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('debe aplicar estilos dinámicos (verde y opacidad 1) cuando el enlace está activo', () => {
    // 1. EL TRUCO: Cambiamos la URL real del "navegador" de las pruebas
    window.history.pushState({}, 'Test Page', '/conocenos');

    render(
      <BrowserRouter {...routerProps}>
        <Header />
      </BrowserRouter>
    );

    // 2. Buscamos el enlace
    const linkConocenos = screen.getByText(/Conócenos/i).closest('a');

    // 3. Ahora el NavLink de BrowserRouter detectará la URL real y activará isActive
    expect(linkConocenos).toHaveStyle({
      color: 'rgb(124, 255, 178)',
      opacity: '1'
    });

    // Limpieza: devolvemos la URL a la base para no afectar a otros tests
    window.history.pushState({}, 'Home', '/');
  });
});