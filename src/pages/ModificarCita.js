import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import cliente from '../images/cliente.jpg';
import Footer from '../common/footer.js';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const ModifcarCitas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const citaData = location.state?.cita;
    const [user, setUser] = useState({ id: '', nombre: 'Usuario', apellidos: '' });
    const [showModal, setShowModal] = useState(false);    
    const [vehiculos, setVehiculos] = useState([]);

    const formatoFecha = (fechaGMT) => {
        if (!fechaGMT) return '';

        const date = new Date(fechaGMT);
        if (isNaN(date.getTime())) return '';

        // Extraemos las partes en formato UTC para evitar saltos de día
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        // DEBE SER ESTE ORDEN: AAAA-MM-DD
        return `${year}-${month}-${day}`;
    };

    // 1. ESTADO INICIAL: Cargamos los datos recibidos
    const [formCita, setFormCita] = useState({
        id_cita: citaData?.id_cita,
        vehiculo: citaData?.marca + " " + citaData?.modelo,
        fecha: formatoFecha(citaData?.fecha_solicitud),
        tipo: citaData?.tipo_cita,
        motivo: citaData?.motivo,
        estado: citaData?.estado_cita
    });

    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        if (session) {
            const sessionParsed = JSON.parse(session);
            setUser({
                id: sessionParsed.id,
                nombre: sessionParsed.nombre,
                apellidos: sessionParsed.apellidos
            });
             fetchDatos(sessionParsed.id);
        }

        if (!citaData) {
            navigate('/perfil');
        }
    }, [navigate, citaData]);

    const handleChange = (e) => {
        setFormCita({ ...formCita, [e.target.name]: e.target.value });
    };
   // --- FUNCIÓN DE BÚSQUEDA DE DATOS ---
    const fetchDatos = async (idUser) => {
        try {
            const urlVehiculos = 'http://localhost:5000/vehiculos';
            const resVehiculos = await axios.post(urlVehiculos, { idUser });
            setVehiculos(resVehiculos.data);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const urlUpdateCita = `http://localhost:5000/updateCita/${formCita.id_cita}`;
            const id_cita = formCita.id_cita
            const vehiculo = formCita.vehiculo
            const tipo = formCita.tipo
            const motivo = formCita.motivo
            const fecha = formCita.fecha
            const estado = formCita.estado
            const res = await axios.put(urlUpdateCita, { id_cita, vehiculo, tipo, motivo, fecha, estado });
            if (res.status === 200 || res.status === 201) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error al modificar cita:", error);
            alert("No se pudo modificar la cita");
        }
    };

    const handleAccept = () => {
        setShowModal(false);
        navigate('/perfil');
    };

    return (
        <div style={containerPageStyle}>
            <Header />

            <main style={mainContentStyle}>
                <div style={formWrapper}>
                    <div style={userHeader}>
                        <img src={cliente} alt="cliente" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                        <span style={userNameStyle}>{user.nombre} {user.apellidos}</span>
                    </div>

                    <form style={formStyle} onSubmit={handleUpdate}>
                        
                        <div style={inputGroup}>
                            <label style={labelStyle}>Vehículo</label>
                            <input
                                type="text"
                                name="vehiculo"
                                value={formCita.vehiculo}
                                style={inputStyle}
                                disabled
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Fecha de la cita</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formCita.fecha}
                                style={inputStyle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Tipo de cita</label>
                            <input
                                type="text"
                                name="tipo"
                                value={formCita.tipo}
                                style={inputStyle}
                                disabled
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Motivo de la cita</label>
                            <input
                                type="text"
                                name="motivo"
                                value={formCita.motivo}
                                style={inputStyle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Estado de la cita</label>
                            <select
                                name="estado"
                                value={formCita.estado}
                                style={inputStyle}
                                onChange={handleChange}
                                disabled
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="En curso">En curso</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>

                        <button type="submit" style={btnSolicitarStyle}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </main>

            <Footer />

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#8be28b" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Cita modificada</h3>
                        <p>La cita ha sido modificada correctamente.</p>
                        <div style={modalButtonsStyle}>
                            <button onClick={handleAccept} style={btnAceptarStyle}>Aceptar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ---
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center'
};
const modalButtonsStyle = { display: 'flex', justifyContent: 'center', marginTop: '20px' };
const btnAceptarStyle = { padding: '10px 20px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#eee', cursor: 'pointer' };
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const formWrapper = { width: '100%', maxWidth: '400px', textAlign: 'center' };
const userHeader = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const userNameStyle = { fontSize: '1.2rem', color: '#666' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' };
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem' };
const inputStyle = { padding: '12px', border: '1px solid #ccc', borderRadius: '15px', fontSize: '1rem', color: '#1A1A1A ', backgroundColor: 'white' };
const btnSolicitarStyle = {
    backgroundColor: '#c7ffc7', border: '1px solid #999', padding: '12px', borderRadius: '20px', fontSize: '1.1rem',
    cursor: 'pointer', marginTop: '10px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
};

export default ModifcarCitas;