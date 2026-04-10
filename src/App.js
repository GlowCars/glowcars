import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de páginas
import Home from './pages/Home';
import Conocenos from './pages/Conocenos';
import Servicios from './pages/Servicios';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Citas from './pages/Citas';
import Resenas from './pages/Resenas';
import AltaVehiculo from './pages/AltaVehiculo';
import ModificarVehiculo from './pages/ModificarVehiculo';
import ModificarCita from './pages/ModificarCita';
import NewResena from './pages/NewResena';
import ModificarResena from './pages/ModificarResena';

{/*  --- COMPONENTE DE PROTECCIÓN Verifica si existe el usuario en sessionStorage --- */ }
const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem('usuarioGlowcars');

  if (!user) {
    // Si no está logueado, lo mandamos al login
    return <Navigate to="/login" replace />;
  }
  // Si está logueado, mostramos la página hija
  return children;
};

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="App">
        <Routes>
          {/* --- RUTAS PÚBLICAS (Cualquiera puede entrar) --- */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/resenas" element={<Resenas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* --- RUTAS PRIVADAS (Requieren estar logueado) --- */}
          <Route
            path="/perfil"
            element={<ProtectedRoute><Perfil /></ProtectedRoute>}
          />
          <Route
            path="/altaVehiculo"
            element={<ProtectedRoute><AltaVehiculo /></ProtectedRoute>}
          />
          <Route
            path="/modificarVehiculo"
            element={<ProtectedRoute><ModificarVehiculo /></ProtectedRoute>}
          />
          <Route
            path="/citas"
            element={<ProtectedRoute><Citas /></ProtectedRoute>}
          />
          <Route
            path="/modificarCita"
            element={<ProtectedRoute><ModificarCita /></ProtectedRoute>}
          />
          <Route
            path="/newResena"
            element={<ProtectedRoute><NewResena /></ProtectedRoute>}
          />
          <Route
            path="/modificarResena"
            element={<ProtectedRoute><ModificarResena /></ProtectedRoute>}
          />

          {/* Comodín: si la ruta no existe, a Home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;