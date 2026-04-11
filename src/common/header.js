import { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Users, Wrench, ThumbsUp, UserCircle, ChevronDown, LogOut, User } from 'lucide-react';
import miLogo from '../images/logo.png';

const Header = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({});
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Recoge el usuario del sessionStorage
        const session = sessionStorage.getItem('usuarioGlowcars');
        // Setea a true la variable isLoggedIn si existe sesion y almacena los datos en user
        if (session) {
            setIsLoggedIn(true);
            const userData = JSON.parse(session);
            setUser(userData);
        } else {
            /* En caso de que no es logado 
            dependiendo de la ruta en la que estemos 
            mantenemos ruta o rediguiremos al login */
            switch (location.pathname) {
                case '/perfil':
                case '/altaVehiculo':
                case '/modificarVehiculo':
                case '/citas':
                case '/modificarCita':
                case '/newResena':
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
    }, [location.pathname, navigate]);

    /* Boton cerrar sesion: 
        - elimina el usuario de sessionStorage
        - setea tIsLoggedIn a falso 
        - redirige a la Home
    */
    const handleLogout = (e) => {
        e.stopPropagation();
        sessionStorage.removeItem('usuarioGlowcars');
        setIsLoggedIn(false);
        navigate('/home');
    };
    /* Boton ver pefil:
        - redirige a perfil
    */
    const handleToPerfile = (e) => {
        e.stopPropagation();
        navigate('/perfil');
    };
    /* Variable de estilos dinamicos que va en funcion de si
        esta activo o no
    */
    const navLinkStyle = ({ isActive }) => ({
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        opacity: isActive ? 1 : 0.8,
        // Si la página está activa, color verde, si no, blanco
        color: isActive ? '#7CFFB2' : 'white',
        transition: 'color 0.3s ease'
    });

    return (

        <header style={headerStyle}>
            {/* CABECERA */}
            <div style={{ ...brandStyle, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                <img src={miLogo} alt="Logo" style={{ width: '45px', height: '45px' }} />
                <div>
                    <h1 style={{ color: '#7CFFB2', margin: 0, fontSize: '1.8rem' }}>GLOWCARS</h1>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Taller mecánico</p>
                </div>
            </div>

            <nav style={navLinksStyle}>
                <NavLink to="/conocenos" style={navLinkStyle}><Users size={18} /> Conócenos</NavLink>
                <NavLink to="/servicios" style={navLinkStyle}><Wrench size={18} /> Servicios</NavLink>
                <NavLink to="/resenas" style={navLinkStyle}><ThumbsUp size={18} /> Reseñas</NavLink>
            </nav>

            {/* LOG IN */}
            <div style={userWrapper}>
                {isLoggedIn ? (
                    // Usamos un Fragment (<>) para agrupar el badge y el menú
                    <>
                        <div style={userBadgeStyle} onClick={() => setMenuAbierto(!menuAbierto)}>
                            <UserCircle size={30} color="#7CFFB2" />
                            <span style={{ color: "#7CFFB2", fontSize: '0.9rem' }}>{user.nombre}</span>
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
                            color: isActive ? '#7CFFB2' : 'white', opacity: 1
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
    backgroundColor: '#0A3A47', padding: '10px 50px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', position: 'relative', color: '#FFFFFF'
};
const brandStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const navLinksStyle = { display: 'flex', gap: '25px', fontFamily: 'Poppins', color: '#FFFFFF' };
const navLinkStyle = {
    textDecoration: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center',
    gap: '5px', fontSize: '0.9rem', fontFamily: 'Poppins'
};
const loginLinkStyle = { ...navLinkStyle };
const userWrapper = { position: 'relative' };
const userBadgeStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const dropdownStyle = {
    position: 'absolute', top: '40px', right: 0, backgroundColor: 'white',
    borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 100,
    width: '150px', fontFamily: 'Poppins'
};
const logoutButtonStyle = {
    width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#1A1A1A', fontSize: '0.9rem'
};

export default Header;