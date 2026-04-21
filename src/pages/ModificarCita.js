import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import cliente from '../images/cliente.jpg';
import Footer from '../common/footer.js';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const ModificarCitas = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const citaData = location.state?.cita;
    const [showModal, setShowModal] = useState(false);
    // Formato fecha
    const formatoFecha = (fechaGMT) => {

        const date = new Date(fechaGMT);

        // Extraemos las partes en formato UTC para evitar saltos de día
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Orden: AAAA-MM-DD
        return `${year}-${month}-${day}`;
    };

    // Cargamos los datos de cita recibidos
    const [formCita, setFormCita] = useState({
        id_cita: citaData?.id_cita,
        vehiculo: citaData?.marca + " " + citaData?.modelo,
        fecha: formatoFecha(citaData?.fecha_solicitud),
        tipo: citaData?.tipo_cita,
        motivo: citaData?.motivo,
        estado: citaData?.estado_cita
    });
    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        if (!citaData) {
            navigate('/perfil');
        }
    }, [navigate, citaData]);

    const handleChange = (e) => {
        setFormCita({ ...formCita, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Llamamos al servicio updateCita segun el id_cita para actualizar la cita y guardar en BBDD
        try {
            const urlUpdateCita = `http://localhost:5000/updateCita/${formCita.id_cita}`;
            const id_cita = formCita.id_cita
            const vehiculo = formCita.vehiculo
            const tipo = formCita.tipo
            const motivo = formCita.motivo
            const fecha = formCita.fecha
            const estado = formCita.estado
            const res = await axios.put(urlUpdateCita, { id_cita, vehiculo, tipo, motivo, fecha, estado });
            if (res.status === 200) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error al modificar cita:", error);
            alert("No se pudo modificar la cita");
        }
    };
    // Boton aceptar y redirigue el perfil cerrando la modal
    const handleAccept = () => {
        setShowModal(false);
        navigate('/perfil');
    };

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>


            <main style={mainContentStyle}>
                <div style={formWrapper}>
                    <div style={userHeader}>
                        <img src={cliente} alt="cliente" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                        <h2 style={formTitleStyle}>Modificar Cita</h2>
                    </div>

                    {/* --- FORMULARIO --- */}
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

                        <div>
                            <button type="submit" style={btnSolicitarStyle}>
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
            {/* --- VENTANA MODAL --- */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
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
const colors = {
    header: '#0A3A47', brand: '#7CFFB2', formTitle: '#1A1A1A', inputBorder: '#A7B1B7', inputBg: '#FFFFFF',
    btnRegistro: '#7CFFB2'
};
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px',
    textAlign: 'center'
};
const modalButtonsStyle = { display: 'flex', justifyContent: 'center', marginTop: '20px' };
const btnAceptarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: '1px solid #A7B1B7',
    backgroundColor: '#FFFFFF', cursor: 'pointer'
};
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins',
    backgroundColor: '#FFFFFF'
};
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const formWrapper = { width: '100%', maxWidth: '400px', textAlign: 'center' };
const userHeader = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const formTitleStyle = { margin: 0, fontSize: '1.4rem', color: colors.formTitle, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' };
const formStyle = { fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' };
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem' };
const inputStyle = {
    padding: '12px', border: '1px solid #A7B1B7', borderRadius: '15px', fontSize: '1rem', color: '#1A1A1A ',
    backgroundColor: 'white'
};
const btnSolicitarStyle = {
    backgroundColor: '#7CFFB2', border: '1px solid #A7B1B7', padding: '14px', borderRadius: '20px',
    fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
};

export default ModificarCitas;