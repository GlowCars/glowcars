import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar1, Pencil, Trash2 } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculoIcono from '../images/vehiculo.avif';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const Perfil = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

    // --- NUEVOS ESTADOS PARA DATOS ---
    const [vehiculos, setVehiculos] = useState([]);
    const [citas, setCitas] = useState([]);

    // Función que abre el modal
    const abrirConfirmacion = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setShowModal(true);
    };

    // Función que borra realmente
    const confirmarBorrado = async () => {
        try {
            await axios.delete(`http://localhost:5000/deleteCar/${vehiculoSeleccionado.id_vehiculo}`);
            setVehiculos(prev => prev.filter(v => v.id_vehiculo !== vehiculoSeleccionado.id_vehiculo));
            setShowModal(false); // Cerramos el modal
            setShowSuccessModal(true); 
        } catch (error) {
            setShowModal(false);
            setShowErrorModal(true);
        }
    };

    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        if (session) {
            const userData = JSON.parse(session);
            // Una vez tenemos el usuario, buscamos sus datos específicos
            fetchDatos(userData.id);
        } else {
            navigate('/login'); // Redirigir si no hay sesión
        }
    }, []);

    // --- FUNCIÓN DE BÚSQUEDA DE DATOS ---
    const fetchDatos = async (idUser) => {
        try {
            const urlVehiculos = 'http://localhost:5000/vehiculos';
            const resVehiculos = await axios.post(urlVehiculos, { idUser });
            setVehiculos(resVehiculos.data);

            const urlCitas = 'http://localhost:5000/citas';
            const resCitas = await axios.post(urlCitas, { idUser });
            setCitas(resCitas.data);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
        }
    };

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            <main style={mainContentStyle}>
                <div style={contentWrapper}>

                    {/* SECCIÓN VEHÍCULO */}
                    <section style={sectionContainer}>
                        <div style={sectionHeader}>
                            <img src={vehiculoIcono} alt="Vehiculo" style={{ width: '25px' }} />
                            <h2 style={sectionTitle}>Vehículo</h2>
                        </div>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderRow}>
                                    <th>Matrícula</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Año</th>
                                    <th>Nº. bastidor</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiculos.map((v, index) => (
                                    <tr key={index} style={tableDataRow}>
                                        <td>{v.matricula}</td>
                                        <td>{v.marca}</td>
                                        <td>{v.modelo}</td>
                                        <td>{v.fc_mat}</td>
                                        <td>{v.bastidor}</td>
                                        <td style={actionsCell}>
                                            <Pencil
                                                size={18}
                                                style={iconActionStyle}
                                                // Enviamos el objeto 'v' (el vehículo actual) a través del estado de navegación
                                                onClick={() => navigate('/modificarVehiculo', { state: { vehiculo: v } })}
                                            />
                                            <Trash2 size={18} style={iconActionStyle} onClick={() => abrirConfirmacion(v)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={addCarContainer}>
                            <button style={btnAddCarStyle} onClick={() => navigate('/altaVehiculo')}>
                                Añadir vehículo
                            </button>
                        </div>
                    </section>

                    {/* SECCIÓN CITAS */}
                    <section style={{ ...sectionContainer, marginTop: '40px' }}>
                        <div style={sectionHeader}>
                            <Calendar1 size={25} color="#333" />
                            <h2 style={sectionTitle}>Citas</h2>
                        </div>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderRow}>
                                    <th>Fecha solicitud</th>
                                    <th>Tipo de cita</th>
                                    <th style={{ width: '20%' }}>Motivo</th>
                                    <th>Vehiculo</th>
                                    <th style={{ width: '25%' }}>Descripción de trabajo</th>
                                    <th>Estado</th>
                                    <th>Fecha resolución</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map((c, index) => (
                                    <tr key={index} style={tableDataRow}>
                                        <td>{c.fecha_solicitud
                                            ? new Date(c.fecha_solicitud).toLocaleDateString('es-ES')
                                            : '-'}</td>
                                        <td>{c.tipo_cita}</td>
                                        <td>{c.motivo}</td>
                                        <td>{c.marca} {c.modelo}</td>
                                        <td>{c.descripcion_trabajo}</td>
                                        <td>{c.estado_cita}</td>
                                        <td>{c.fecha_resolucion
                                            ? new Date(c.fecha_resolucion).toLocaleDateString('es-ES')
                                            : '-'}</td>
                                        <td style={actionsCell}>
                                            <Pencil
                                                size={18}
                                                style={iconActionStyle}
                                                onClick={() => navigate('/modificarCita', { state: { cita: c } })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main >

            {/* --- FOOTER --- */}
            < Footer ></Footer >

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>¿Eliminar vehículo?</h3>
                        <p>Estás a punto de borrar el <b>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</b>.</p>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Esta acción no se puede deshacer.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={btnCancelarStyle}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarBorrado}
                                style={btnEliminarStyle}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#8be28b" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Vehículo eliminado</h3>
                        <p>El vehículo ha sido eliminado correctamente.</p>

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
            )}
            {showErrorModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>No se ha podido eliminar el vehículo</h3>
                        <p>El vehículo <b>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</b> no se ha podido eliminar, debido a que tiene citas asociadas.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                style={btnCancelarStyle}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

// --- ESTILOS ---
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins',
    backgroundColor: '#fff'
};
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const contentWrapper = { width: '100%', maxWidth: '900px' };
const sectionContainer = { textAlign: 'center', width: '100%', marginBottom: '50px' };
const sectionHeader = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
const sectionTitle = { margin: 0, fontSize: '1.4rem', color: '#333' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', };
const tableHeaderRow = { borderBottom: '2px solid #333', color: '#666', height: '40px' };
const tableDataRow = { borderBottom: '1px solid #333', height: '50px' };
const actionsCell = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', height: '50px' };
const iconActionStyle = { cursor: 'pointer', color: '#333' };
const addCarContainer = { display: 'flex', justifyContent: 'flex-end', marginTop: '15px' };
const btnAddCarStyle = {
    backgroundColor: '#c7ffc7', color: '#000', border: '1px solid #999', padding: '8px 20px',
    borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
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

const btnCancelarStyle = {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#eee',
    cursor: 'pointer'
};

const btnEliminarStyle = {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#ff4d4d', // Rojo para advertir peligro
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
};
const btnAceptarStyle = {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#eee',
    cursor: 'pointer'
};
export default Perfil;