import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, Star, Send } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';


const NewResena = () => {
    // Variables
    const navigate = useNavigate();
    const [user, setUser] = useState({ nombre: 'Usuario', email: '' });
    const [showModal, setShowModal] = useState(false);

    // Datos por defecto para el formulario
    const [resena, setResena] = useState({
        calificación: 5,
        titulo: '',
        comentario: ''
    });
    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        if (session) {
            setUser(JSON.parse(session));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setResena({ ...resena, [e.target.name]: e.target.value });
    };

    const handleSetRating = (rating) => {
        setResena({ ...resena, calificacion: rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resenaCompleta = {
                id_usuario: user.id,
                calificacion: resena.calificacion,
                comentario: resena.comentario,
                titulo: resena.titulo,
                fecha: new Date().toISOString()
            };
            // Llamamos al servicio createResena para crear una nueva resena y guardar en BBDD
            const res = await axios.post('http://localhost:5000/createResena', resenaCompleta);

            if (res.status === 200 || res.status === 201) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error al enviar reseña:", error);
            alert("No se pudo enviar la reseña.");
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

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Calificación</label>
                            <div style={starsContainer}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Star
                                        key={num}
                                        size={30}
                                        onClick={() => handleSetRating(num)}
                                        fill={num <= resena.calificacion ? "#ffc107" : "none"}
                                        color={num <= resena.calificacion ? "#ffc107" : "#A7B1B7"}
                                        style={{ cursor: 'pointer', transition: '0.2s' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Titulo</label>
                            <input type="text" name="titulo" placeholder="Titulo"
                                onChange={handleChange} style={inputStyle} required />
                            <label style={labelStyle}>Comentario</label>
                            <textarea
                                name="comentario"
                                placeholder="Cuéntanos tu experiencia en Glowcars..."
                                style={textareaStyle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" style={btnSubmitStyle}>
                            <Send size={18} /> Publicar reseña
                        </button>
                          <button
                            onClick={() => navigate('/resenas')}
                            type="button" style={btnCancelarStyle}>
                            Cancelar
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
                        <h3 style={{ color: '#1A1A1A' }}>Reseña guardada</h3>
                        <p>¡Gracias por tu reseña!</p>

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
    header: '#0A3A47', brand: '#7CFFB2', formTitle: '#1A1A1A', inputBorder: '#A7B1B7',
    inputBg: '#FFFFFF', btnRegistro: '#7CFFB2'
};
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#FFFFFF' };
const formWrapperStyle = {
    width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '30px', borderRadius: '15px',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)'
};
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', justifyContent: 'center' };
const sectionTitle = { margin: 0, fontSize: '1.5rem', color: '#1A1A1A' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: 'bold', fontSize: '0.9rem', color: '#1A1A1A' };
const starsContainer = { display: 'flex', gap: '5px', justifyContent: 'center', margin: '10px 0' };
const textareaStyle = {
    padding: '15px', borderRadius: '10px', border: '1px solid #A7B1B7', minHeight: '120px',
    fontFamily: 'inherit', fontSize: '1rem', backgroundColor: '#FFFFFF', resize: 'none'
};
const btnSubmitStyle = {
    backgroundColor: '#7CFFB2', color: '#000', border: '1px solid #A7B1B7', padding: '10px',
    borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center',
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
const btnCancelarStyle = {
    backgroundColor: '#A7B1B7', color: '#000', border: '1px solid #7CFFB2', padding: '10px',
    borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px', marginTop: '10px'
};

export default NewResena;