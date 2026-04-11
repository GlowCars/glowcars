import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThumbsUp, Star, Send } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const ModificarResena = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const resenaData = location.state?.resena;

    // Inicializamos con los datos de la resena recibida
    const [resenaUpdate, setResenaUpdate] = useState({
        calificacion: resenaData?.calificacion,
        titulo: resenaData?.titulo,
        comentario: resenaData?.texto,
        id_resena: resenaData?.id_resena
    });
    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
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

    const handleRegistro = async (e) => {
        e.preventDefault();
        // Llamamos al servicio updateResena para actualizar la resena y guardar en BBDD
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
    // Boton aceptar y redirigue a resenas cerrando la modal
    const handleAccept = async (e) => {
        setShowModal(false);
        navigate('/resenas');
    }

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            {/* --- FORMULARIO --- */}
            <main style={mainContentStyle}>
                <div style={formWrapperStyle}>
                    <div style={sectionHeader}>
                        <ThumbsUp size={25} color="#1A1A1A" />
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
                                        color={num <= resenaUpdate.calificacion ? "#ffc107" : "#A7B1B7"}
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
            {/* --- VENTANA MODAL --- */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig color="#7CFFB2" size={60} />
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
    header: '#0A3A47', brand: '#7CFFB2', formTitle: '#1A1A1A', inputBorder: '#A7B1B7', inputBg: '#FFFFFF',
    btnRegistro: '#7CFFB2'
};
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#FFFFFF' };
const formWrapperStyle = {
    width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)'
};
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', justifyContent: 'center' };
const sectionTitle = { margin: 0, fontSize: '1.5rem', color: '#0A3A47' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: 'bold', fontSize: '0.9rem', color: '#1A1A1A ' };
const starsContainer = { display: 'flex', gap: '5px', justifyContent: 'center', margin: '10px 0' };
const textareaStyle = {
    padding: '15px', borderRadius: '10px', border: '1px solid #FFFFFF', minHeight: '120px',
    fontFamily: 'inherit', fontSize: '1rem', backgroundColor: '#FFFFFF', resize: 'none'
};
const btnSubmitStyle = {
    backgroundColor: '#7CFFB2', color: '#000', border: '1px solid #A7B1B7', padding: '12px',
    borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px', marginTop: '10px'
};
const inputStyle = {
    padding: '10px', border: `1px solid ${colors.inputBorder}`, borderRadius: '10px', backgroundColor: colors.inputBg,
    fontSize: '1rem', width: '100%', boxSizing: 'border-box'
};
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
export default ModificarResena;