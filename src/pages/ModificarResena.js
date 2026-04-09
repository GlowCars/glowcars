import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThumbsUp, Star, Send } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';


const ModificarResena = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ nombre: 'Usuario', email: '' });
    const [showModal, setShowModal] = useState(false);
    const resenaData = location.state?.resena;

    // 1. ESTADOS: Inicializamos con los datos de la reseña recibida
    const [resenaUpdate, setResenaUpdate] = useState({
        calificacion: resenaData?.calificacion,
        titulo: resenaData?.titulo,
        comentario: resenaData?.texto,
        id_resena: resenaData?.id_resena
    });

    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        const sessionParsed = JSON.parse(session)
        setUser({
            id: sessionParsed.id,
            nombre: sessionParsed.nombre,
            apellidos: sessionParsed.apellidos
        });
        if (!resenaData) {
            navigate('/resenas');
        }
    }, [navigate, resenaData]);

    const handleCambioResena = (e) => {
        setResenaUpdate({ ...resenaUpdate, [e.target.name]: e.target.value });
    };

    const handleSetRating = (rating) => {
        setResenaUpdate({ ...resenaUpdate, calificacion: rating });
    };

    // 3. FUNCIÓN DE ENVÍO (UPDATE)
    const handleRegistro = async (e) => {
        e.preventDefault();

        try {
            const urlUpdate = `http://localhost:5000/updateResena/${resenaUpdate.id_resena}`;
            const calificacion = resenaUpdate.calificacion;
            const titulo = resenaUpdate.titulo;
            const comentario = resenaUpdate.comentario;
            const id_resena = resenaUpdate.id;
            const res = await axios.put(urlUpdate, { id_resena, calificacion, titulo, comentario });
            if (res.status === 200 || res.status === 201) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error al modificar:", error);
            alert("No se pudieron guardar los cambios.");
        }
    };

    const handleAccept = async (e) => {
        setShowModal(false);
        navigate('/resenas');
    }

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            {/* --- CUERPO DEL FORMULARIO --- */}
            <main style={mainContentStyle}>
                <div style={formWrapperStyle}>
                    <div style={sectionHeader}>
                        <ThumbsUp size={25} color="#333" />
                        <h2 style={sectionTitle}>Deja tu opinión</h2>
                    </div>

                    <form onSubmit={handleRegistro} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Calificación</label>
                            <div style={starsContainer}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Star
                                        key={num}
                                        size={30}
                                        onClick={() => handleSetRating(num)}
                                        fill={num <= resenaUpdate.calificacion ? "#ffc107" : "none"}
                                        color={num <= resenaUpdate.calificacion ? "#ffc107" : "#ccc"}
                                        style={{ cursor: 'pointer', transition: '0.2s' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Titulo</label>
                            <input type="text" name="titulo" placeholder="Titulo" 
                                value={resenaUpdate.titulo}
                                onChange={handleCambioResena} style={inputStyle} required />
                            <label style={labelStyle}>Comentario</label>
                            <textarea
                                name="comentario"
                                value={resenaUpdate.comentario}
                                placeholder="Cuéntanos tu experiencia en Glowcars..."
                                style={textareaStyle}
                                onChange={handleCambioResena}
                                required
                            />
                        </div>

                        <button type="submit" style={btnSubmitStyle}>
                            <Send size={18} /> Modificar reseña
                        </button>
                    </form>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig color="#8be28b" size={60} />
                        <h3 style={{ color: '#1A1A1A' }}>Reseña modificada</h3>
                        <p>Reseña modificada correctamente.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => handleAccept()}
                                style={btnAceptarStyle}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ---
const colors = {
    header: '#263a45', brand: '#8be28b', formTitle: '#333', inputBorder: '#bbb',
    inputBg: '#eee', btnRegistro: '#c7ffc7'
};
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f9f9f9' };
const formWrapperStyle = {
    width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)'
};
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', justifyContent: 'center' };
const sectionTitle = { margin: 0, fontSize: '1.5rem', color: '#333' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: 'bold', fontSize: '0.9rem', color: '#555' };
const starsContainer = { display: 'flex', gap: '5px', justifyContent: 'center', margin: '10px 0' };
const textareaStyle = {
    padding: '15px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '120px',
    fontFamily: 'inherit', fontSize: '1rem', backgroundColor: '#eee', resize: 'none'
};
const btnSubmitStyle = {
    backgroundColor: '#c7ffc7', color: '#000', border: '1px solid #999', padding: '12px',
    borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px'
};
const inputStyle = {
    padding: '10px', border: `1px solid ${colors.inputBorder}`, borderRadius: '10px', backgroundColor: colors.inputBg,
    fontSize: '1rem', width: '100%', boxSizing: 'border-box'
};
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000 // Por encima de todo
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
};

const modalButtonsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px'
};

const btnAceptarStyle = {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#eee',
    cursor: 'pointer'
};
export default ModificarResena;