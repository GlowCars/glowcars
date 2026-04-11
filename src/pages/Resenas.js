import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, PlusCircle } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import axios from 'axios';
import { Pencil } from 'lucide-react';

const Resenas = () => {
    // Variables
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({ id: '', nombre: '' });
    const [resenas, setResenas] = useState([]);

    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('usuarioGlowcars'));
        if (data) {
            setUser({
                id: Number(data.id),
                nombre: data.nombre,
                apellidos: data.apellidos
            });
            setIsLoggedIn(true);
        }
        // Llamamos al servicio resena y buscamos los datos 
        const fetchResenas = async () => {
            try {
                const urlResenas = 'http://localhost:5000/resena';
                const resResenas = await axios.get(urlResenas);

                // Mapeamos los datos correctamente
                const datosFormateados = resResenas.data.map(v => ({
                    id_usuario: v.id_usuario,
                    id_resena: v.id_resena,
                    calificacion: v.calificacion,
                    texto: v.comentario,
                    nombre: `${v.nombre} ${v.apellidos || ''}`.trim(),
                    fecha: formatoFecha(v.fecha),
                    titulo: v.titulo || "-",
                    avatar: (v.nombre?.[0] || 'U').toUpperCase() + (v.apellidos?.[0] || '').toUpperCase()
                }));

                setResenas(datosFormateados);

            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchResenas();
    }, []);


    // Formato de fecha
    const formatoFecha = (fechaGMT) => {
        if (!fechaGMT) return '';

        const date = new Date(fechaGMT);
        if (isNaN(date.getTime())) return '';

        // Extraemos las partes en formato UTC para evitar saltos de día
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Orden: DD-MM-AAAA
        return `${day}-${month}-${year}`;
    };

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            {/* --- CUERPO --- */}
            <main style={mainContentStyle}>
                <div style={contentWrapper}>

                    {/* SECCIÓN DE ACCIÓN: Muestra un botón u otro según el login */}
                    <div style={actionSection}>
                        {isLoggedIn ? (
                            <button style={btnAnadirResenaStyle} onClick={() => navigate("/newResena")}>
                                <PlusCircle size={20} /> Añadir reseña
                            </button>
                        ) : (
                            <button style={btnRegistrateOpinarStyle} onClick={() => navigate('/login')}>
                                Regístrate para opinar
                            </button>
                        )}
                    </div>

                    {/* GRID DE RESEÑAS */}
                    <div style={resenasGrid}>
                        {resenas.map((r, i) => (
                            <div key={i} style={cardStyle}>
                                <div style={starsRow}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <Star key={starIndex} size={18}
                                            fill={starIndex < r.calificacion ? "#ffc107" : "none"}
                                            color={starIndex < r.calificacion ? "#ffc107" : "#A7B1B7"} />
                                    ))}
                                </div>
                                <h4 style={cardHeader}>{r.titulo}</h4>
                                <p style={cardText}>{r.texto}</p>
                                <div style={userRow}>
                                    <div style={avatarCircle}>{r.avatar}</div>
                                    <div>
                                        <div style={userName}>{r.nombre}</div>
                                        <div style={userDate}>{r.fecha}</div>
                                    </div>
                                    {user && user.id === r.id_usuario && (
                                        <div style={userEdit}>
                                            <Pencil
                                                size={18}
                                                style={iconActionStyle}
                                                // Enviamos el objeto 'v' (el vehículo actual) a través del estado de navegación
                                                onClick={() => navigate('/modificarResena', { state: { resena: r } })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>
        </div>
    );
};

// --- ESTILOS ---
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins',
    backgroundColor: '#FFFFFF'
};
const mainContentStyle = { flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' };
const contentWrapper = { maxWidth: '1000px', width: '100%' };
const actionSection = { display: 'flex', justifyContent: 'center', marginBottom: '30px' };
const iconActionStyle = { cursor: 'pointer', color: '#1A1A1A' };
const btnAnadirResenaStyle = {
    backgroundColor: '#7CFFB2', color: '#1A1A1A', border: '1px solid #A7B1B7', padding: '13px 25px',
    borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold',
    boxShadow: '0 4px 4px rgba(0,0,0,0.1)', fontFamily: 'Poppins'
};
const btnRegistrateOpinarStyle = {
    backgroundColor: '#d9b35c', color: 'white', border: '1px solid #A7B1B7', padding: '12px 30px',
    borderRadius: '15px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontFamily: 'inherit'
};
const resenasGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const cardStyle = {
    border: '1px solid #0A3A47', borderRadius: '15px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'inline-grid', backgroundColor: '#f8f7f7'
};
const starsRow = { display: 'flex', gap: '2px', height: '20px' };
const cardHeader = { margin: '0 0 0 0', fontSize: '1.1rem', color: '#1A1A1A', height: '18px' };
const cardText = {
    fontSize: '1.1rem', color: '#1A1A1A', fontStyle: 'Montserrat',
    marginBottom: '15px', textAlign: 'justify'
};
const userRow = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatarCircle = {
    width: '40px', height: '40px', backgroundColor: '#7CFFB2',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
};
const userName = { fontWeight: 'bold', fontSize: '0.9rem' };
const userDate = { fontSize: '0.8rem', color: '#A7B1B7', textAlign: 'left' };
const userEdit = { fontSize: '0.8rem', color: '#A7B1B7', textAlign: 'left', marginLeft: 'auto' };

export default Resenas;