import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import cliente from '../images/cliente.jpg';
import axios from 'axios';

const Citas = () => {
    // Variables
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ id: '', nombre: 'Usuario', apellidos: '' });
    const [vehiculos, setVehiculos] = useState([]);

    // Recuperamos el tipo de servicio enviado desde la página anterior
    const servicioSeleccionado = location.state?.tipoServicio || "";

    const [formCita, setFormCita] = useState({
        vehiculo: '',
        fecha: '',
        tipo: servicioSeleccionado,
        motivo: '',
        idUser: ''
    });

    // Si el usuario cambia de opinión y selecciona otro servicio, actualizamos el campo
    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        const sessionParsed = JSON.parse(session)
        setUser({
            id: sessionParsed.id,
            nombre: sessionParsed.nombre,
            apellidos: sessionParsed.apellidos
        });

        // Guardamos el ID en el formulario para el envío posterior
        setFormCita(prev => ({ ...prev, idUser: sessionParsed.id }));

        fetchDatos(sessionParsed.id);

        if (servicioSeleccionado) {
            setFormCita(prev => ({ ...prev, tipo: servicioSeleccionado }));
        }
    }, [servicioSeleccionado]);

    // Llamamos al servicio vehiculos para obtener los datos del vehiculo
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

    const handleChange = (e) => {
        setFormCita({ ...formCita, [e.target.name]: e.target.value });
    };

    // Boton de registro y guardado de sesion
    const handleRegistro = async (e) => {
        e.preventDefault();
        // Llamamos al servicio createCita para crear la cita y guardar en BBDD
        try {
            const urlCita = `http://localhost:5000/createCita`;
            const vehiculo = formCita.vehiculo;
            const fecha = formCita.fecha;
            const tipo = formCita.tipo;
            const motivo = formCita.motivo;
            const idUser = formCita.idUser;
            await axios.post(urlCita, { vehiculo, fecha, tipo, motivo, idUser });
            navigate('/perfil');

        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un error al registrar los datos.");
        }
    };

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            {/* --- FORMULARIO DE CITAS --- */}
            <main style={mainContentStyle}>
                <div style={formWrapper}>
                    <div style={userHeader}>
                        <img src={cliente} alt="cliente" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                        <span style={userNameStyle}>{user.nombre}</span>
                    </div>

                    <form onSubmit={handleRegistro} style={formStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Vehículo</label>
                            <select
                                id="vehiculo-select"
                                name="vehiculo"
                                value={formCita.vehiculo}
                                style={inputStyle}
                                onChange={handleChange}
                                required
                            > <option> </option>
                                {vehiculos.map((v) => (
                                    <option value={v.id_vehiculo}>{v.matricula} {v.marca} {v.modelo}</option>
                                ))}
                            </select>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Fecha solicitud cita</label>
                            <input
                                id="fecha-input"
                                type="date"
                                name="fecha"
                                style={inputStyle}
                                onChange={handleChange}
                                required />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Tipo de cita</label>
                            <select
                                name="tipo"
                                value={formCita.tipo}
                                style={inputStyle}
                                onChange={handleChange}
                                required
                            >
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Diagnóstico">Diagnóstico</option>
                                <option value="Reparación">Reparación</option>
                                <option value="Presupuesto">Presupuesto</option>
                            </select>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Motivo de la cita</label>
                            <input
                                type="text"
                                name="motivo"
                                placeholder="Motivo"
                                style={inputStyle}
                                onChange={handleChange}
                                required />
                        </div>
                        <div>
                            <button type="submit" style={btnSolicitarStyle}>
                                Solicitar cita
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>
        </div>
    );
};

// --- ESTILOS ---
const containerPageStyle = { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const formWrapper = { width: '100%', maxWidth: '400px', textAlign: 'center' };
const userHeader = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const userNameStyle = { fontSize: '1.2rem', color: '#A7B1B7' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' };
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem' };
const inputStyle = {
    padding: '12px', border: '1px solid #A7B1B7', borderRadius: '15px', fontSize: '1rem',
    color: '#1A1A1A ', fontFamily: 'inherit'
};
const btnSolicitarStyle = {
    backgroundColor: '#7CFFB2', border: '1px solid #A7B1B7', padding: '14px', borderRadius: '20px',
    fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif'
};

export default Citas;