import { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Users, Wrench, ThumbsUp, UserCircle, ChevronDown, LogOut, User } from 'lucide-react';
import miLogo from '../images/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ nombre: 'J.M', iniciales: 'JM' });
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        if (session) {
            setIsLoggedIn(true);
            const userData = JSON.parse(session);
            setUser(userData);
        } else {
            switch (location.pathname) {
                case '/perfil':
                case '/alta-vehiculo':
                case '/modificar-vehiculo':
                case '/citas':
                case '/modificar-cita':
                case '/nueva-resena':
                    navigate('/login');
                    break;

                case '/login':
                case '/registro':
                case '/home':
                case '/servicios':
                case '/conocenos':
                case '/resenas':
                default:
                    break;
            }
        }
    }, []);

    const handleLogout = (e) => {
        e.stopPropagation();
        sessionStorage.removeItem('usuarioGlowcars');
        navigate('/home');
    };
    const handleToPerfile = (e) => {
        e.stopPropagation();
        navigate('/perfil');
    };

    const navLinkStyle = ({ isActive }) => ({
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        opacity: isActive ? 1 : 0.8,
        // Si la página está activa, color verde, si no, blanco
        color: isActive ? '#8be28b' : 'white',
        transition: 'color 0.3s ease'
    });

    return (
        <header style={headerStyle}>
            <div style={{ ...brandStyle, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                <img src={miLogo} alt="Logo" style={{ width: '45px', height: '45px' }} />
                <div>
                    <h1 style={{ color: '#8be28b', margin: 0, fontSize: '1.8rem' }}>GLOWCARS</h1>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8}}>Taller mecánico</p>
                </div>
            </div>

            <nav style={navLinksStyle}>
                <NavLink to="/conocenos" style={navLinkStyle}><Users size={18} /> Conócenos</NavLink>
                <NavLink to="/servicios" style={navLinkStyle}><Wrench size={18} /> Servicios</NavLink>
                <NavLink to="/resenas" style={navLinkStyle}><ThumbsUp size={18} /> Reseñas</NavLink>
            </nav>

            {/* USUARIO CON DROPDOWN */}

            <div style={userWrapper}>
                {isLoggedIn ? (
                    // Usamos un Fragment (<>) para agrupar el badge y el menú
                    <>
                        <div style={userBadgeStyle} onClick={() => setMenuAbierto(!menuAbierto)}>
                            <UserCircle size={30} color="#8be28b" />
                            <span style={{ color: "#8be28b", fontSize: '0.9rem' }}>{user.nombre}</span>
                            <ChevronDown size={16} color="white" style={{ marginLeft: '4px' }} />
                        </div>

                        {menuAbierto && (
                            <div style={dropdownStyle}>
                                <button onClick={handleToPerfile} style={logoutButtonStyle}>
                                    <User size={16} /> Ver perfil
                                </button>
                                <button onClick={handleLogout} style={logoutButtonStyle}>
                                    <LogOut size={16} /> Cerrar sesión
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        style={({ isActive }) => ({
                            ...loginLinkStyle,
                            color: isActive ? '#8be28b' : 'white', opacity: 0.8
                        })}>
                        <UserCircle size={24} /> Log in
                    </NavLink>
                )}
            </div>
        </header >
    );
};

// --- ESTILOS ---
const headerStyle = {
    backgroundColor: '#263a45', color: 'white', padding: '10px 50px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', position: 'relative'
};
const brandStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const navLinksStyle = { display: 'flex', gap: '25px' };
const navLinkStyle = {
    textDecoration: 'none', color: '#ccc', display: 'flex', alignItems: 'center',
    gap: '5px', fontSize: '0.9rem'
};
const loginLinkStyle = { ...navLinkStyle };
const userWrapper = { position: 'relative' };
const userBadgeStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const dropdownStyle = {
    position: 'absolute', top: '40px', right: 0, backgroundColor: 'white',
    borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 100,
    width: '150px'
};
const logoutButtonStyle = {
    width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontSize: '0.9rem'
};

export default Header;