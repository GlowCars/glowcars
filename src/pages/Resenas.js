import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, PlusCircle, Trash2, CircleCheckBig } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import axios from 'axios';
import { Pencil } from 'lucide-react';

const Resenas = () => {
    // Variables
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showResenaModal, setShowResenaModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [user, setUser] = useState({ id: '', nombre: '' });
    const [resenas, setResenas] = useState([]);
    const [resenaSeleccionado, setResenaSeleccionado] = useState(null);


    // Función que abre el modal
    const abrirConfirmacionResena = (resena) => {
        setResenaSeleccionado(resena);
        setShowResenaModal(true);
    };
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
                    nombre: `${v.nombre} ${v.apellidos}`.trim(),
                    fecha: formatoFecha(v.fecha),
                    titulo: v.titulo ,
                    avatar: (v.nombre?.[0]).toUpperCase() + (v.apellidos?.[0]).toUpperCase()
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

        const date = new Date(fechaGMT);

        // Extraemos las partes en formato UTC para evitar saltos de día
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Orden: DD-MM-AAAA
        return `${day}-${month}-${year}`;
    };

    const deleteResena = async () => {
        try {
            await axios.delete(`http://localhost:5000/deleteResena/${resenaSeleccionado.id_resena}`);
            setResenas(prev => prev.filter(v => v.id_resena !== resenaSeleccionado.id_resena));
            setShowResenaModal(false); // Cerramos el modal
            setShowSuccessModal(true);
        } catch (error) {
            setShowResenaModal(false);
        } finally {
        }
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
                                            <Trash2
                                                size={18}
                                                style={iconActionStyle}
                                                // Enviamos el objeto 'v' (el vehículo actual) a través del estado de navegación
                                                onClick={() => abrirConfirmacionResena(r)}
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

            {showResenaModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>Eliminación de reseña</h3>
                        <p>Se va proceder a eliminar la reseña.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => deleteResena()}
                                style={btnEliminarStyle}
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setShowResenaModal(false)}
                                style={btnCancelarStyle}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {showSuccessModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Reseña eliminada</h3>
                        <p>La reseña ha sido eliminada correctamente.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                style={btnAceptarStyle}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
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
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px',
    textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
};
const modalButtonsStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' };

const btnAceptarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: '1px solid #A7B1B7', backgroundColor: '#FFFFFF',
    cursor: 'pointer'
};
const btnCancelarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#A7B1B7', color: 'white',
    fontWeight: 'bold', cursor: 'pointer'
};
const btnEliminarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#ff4d4d', color: 'white',
    fontWeight: 'bold', cursor: 'pointer'
};

export default Resenas;