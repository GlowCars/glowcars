import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar1, Pencil, Trash2, CircleCheckBig, UserPen } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculoIcono from '../images/vehiculo.avif';
import axios from 'axios';

const Perfil = () => {
    // Variables
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showCitaModal, setShowCitaModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSuccessCitaModal, setShowSuccessCitaModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [citaSeleccionado, setCitaSeleccionado] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [citas, setCitas] = useState([]);
    const [datosCliente, setDatosCliente] = useState({
        nombre: '', apellidos: '', telefono: '', email: '', password: ''
    });
    const [showModalUser, setShowModalUser] = useState(false);
    const [showSuccessUserModal, setShowSuccessUserModal] = useState(false);

    const handleModify = async (e) => {
        e.preventDefault();
    }

    // Funciones para actualizar campos
    const handleCambioCliente = (e) => {
        setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
    };

    // Función que abre el modal
    const abrirConfirmacion = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setShowModal(true);
    };
    // Función que abre el modal
    const abrirConfirmacionCitas = (cita) => {
        setCitaSeleccionado(cita);
        setShowCitaModal(true);
    };

    // Función de borrado de vehiculo
    const confirmarBorrado = async () => {
        // Llamamos al servicio deleteCar por su id_vehiculo para eliminar el vehiculo y guardar en BBDD
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
    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        if (session) {
            const userData = JSON.parse(session);
            // Una vez tenemos el usuario, buscamos sus datos específicos
            fetchDatos(userData.id);
            fetchUser(userData.id)
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchDatos = async (idUser) => {
        try {
            //Llamamos al servicio vehiculos para obtener los datos
            const urlVehiculos = 'http://localhost:5000/vehiculos';
            const resVehiculos = await axios.post(urlVehiculos, { idUser });
            setVehiculos(resVehiculos.data);
            //Llamamos al servicio citas para obtener los datos
            const urlCitas = 'http://localhost:5000/citas';
            const resCitas = await axios.post(urlCitas, { idUser });
            setCitas(resCitas.data);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
        }
    };
    const fetchUser = async (idUser) => {
        try {
            //Llamamos al servicio usuarios para obtener los datos
            const urlUsuario = `http://localhost:5000/readUser?user=${idUser}`;
            const resUsuario = await axios.get(urlUsuario);
            setDatosCliente(resUsuario.data);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
        }
    };
    const updateUser = async () => {
        setShowModalUser(false);
        try {

            const session = JSON.parse(sessionStorage.getItem('usuarioGlowcars'));
            const sessionId = session.id;
            //Llamamos al servicio usuarios para obtener los datos
            const urlUsuario = `http://localhost:5000/updateUser/${sessionId}`;
            const nombre = datosCliente.nombre;
            const apellidos = datosCliente.apellidos;
            const telefono = datosCliente.telefono;
            const email = datosCliente.email
            const res = await axios.put(urlUsuario, { nombre, apellidos, telefono, email });

            if (res.status === 200) {
                // 1. Actualizamos el sessionStorage
                const nuevaSesion = { ...session, nombre: nombre, apellidos: apellidos, telefono: telefono, email: email };
                sessionStorage.setItem('usuarioGlowcars', JSON.stringify(nuevaSesion));
                // 2. DISPARAMOS EL EVENTO para que el Header se entere
                window.dispatchEvent(new Event('storageUpdate'));
                setShowSuccessUserModal(true);
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
        }
    };

    const deleteCita = async () => {
        try {
            await axios.delete(`http://localhost:5000/deleteCita/${citaSeleccionado.id_cita}`);
            setCitas(prev => prev.filter(v => v.id_cita !== citaSeleccionado.id_cita));
            setShowCitaModal(false); // Cerramos el modal
            setShowSuccessCitaModal(true);
        } catch (error) {
            setShowCitaModal(false);
            setShowErrorModal(true);
        } finally {
        }
    };
    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>

            <main style={mainContentStyle}>
                <div style={contentWrapper}>
                    {/* SECCIÓN PERSONAL */}
                    <section>
                        <div style={sectionHeader}>
                            <UserPen style={{ color: '#0A3A47', width: '25px' }}></UserPen>
                            <h2 style={sectionTitle}>Datos personales</h2>
                        </div>

                        {/* MODIFICAR USUARIO */}
                        <form onSubmit={handleModify} style={gridRegistroStyle}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', display: 'grid', marginRight: '5px' }}>
                                    <label style={labelStyle}>Nombre</label>
                                    <input type="text" name="nombre" placeholder="Nombre" style={inputStyle}
                                        value={datosCliente.nombre}
                                        onChange={handleCambioCliente} required />
                                </div>
                                <div style={{ width: '50%', display: 'grid', marginLeft: '5px' }}>
                                    <label style={labelStyle}>Apellidos</label>
                                    <input type="text" name="apellidos" placeholder="Apellidos" style={inputStyle}
                                        value={datosCliente.apellidos}
                                        onChange={handleCambioCliente} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', display: 'grid', marginRight: '5px' }}>
                                    <label style={labelStyle}>Teléfono</label>
                                    <input type="number" name="telefono" placeholder="Teléfono" style={inputStyle}
                                        value={datosCliente.telefono}
                                        onChange={handleCambioCliente}
                                        onInput={(e) => {
                                            if (e.target.value.length > 9) {
                                                e.target.value = e.target.value.slice(0, 9);
                                            }
                                        }} required />
                                </div>
                                <div style={{ width: '50%', display: 'grid', marginLeft: '5px' }}>
                                    <label style={labelStyle}>Email</label>
                                    <input type="email" name="email" placeholder="Email" style={inputStyle}
                                        value={datosCliente.email}
                                        onChange={handleCambioCliente} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                                <button style={btnAddCarStyle} onClick={setShowModalUser}>
                                    Modificar datos
                                </button>
                            </div>
                        </form>
                    </section>

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
                            <Calendar1 size={25} color="#0A3A47" />
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
                                            <Trash2 size={18} style={iconActionStyle} onClick={() => abrirConfirmacionCitas(c)} />
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
            {/* --- VENTANAS MODALES --- */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>¿Eliminar vehículo?</h3>
                        <p>Estás a punto de borrar el <b>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</b>.</p>
                        <p style={{ fontSize: '0.8rem', color: '#A7B1B7' }}>Esta acción no se puede deshacer.</p>

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
            )
            }
            {showSuccessModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
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
            )
            }
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
            )
            }
            {showModalUser && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>Modificación de datos</h3>
                        <p>Se va a proceder a modificar los datos del perfil.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => updateUser()}
                                style={btnAceptarStyle}
                            >
                                Aceptar
                            </button>
                            <button
                                onClick={() => setShowModalUser(false)}
                                style={btnCancelarStyle}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
            {showSuccessUserModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Usuario modificado</h3>
                        <p>El usuario ha sido modificado correctamente.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => setShowSuccessUserModal(false)}
                                style={btnAceptarStyle}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {showSuccessCitaModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Cita cancelada</h3>
                        <p>La cita ha sido cancelada y la ficha borrada correctamente.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => setShowSuccessCitaModal(false)}
                                style={btnAceptarStyle}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
            {showCitaModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ color: '#1A1A1A' }}>Cancelar cita</h3>
                        <p>Se va proceder a cancelar la cita y borrar la ficha.</p>

                        <div style={modalButtonsStyle}>
                            <button
                                onClick={() => deleteCita()}
                                style={btnEliminarStyle}
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setShowCitaModal(false)}
                                style={btnCancelarStyle}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

// --- ESTILOS ---
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins', backgroundColor: '#FFFFFF'
};
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const contentWrapper = { width: '100%', maxWidth: '900px' };
const sectionContainer = { textAlign: 'center', width: '100%', marginBottom: '50px' };
const sectionHeader = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
const sectionTitle = { margin: 0, fontSize: '1.4rem', color: '#0A3A47' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', };
const tableHeaderRow = { fontSize: '1.1rem', borderBottom: '2px solid #1A1A1A', color: '#1A1A1A', height: '40px' };
const tableDataRow = { fontSize: '1.1rem', borderBottom: '1px solid #1A1A1A', height: '50px' };
const actionsCell = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', height: '50px' };
const iconActionStyle = { cursor: 'pointer', color: '#0A3A47' };
const addCarContainer = { display: 'flex', justifyContent: 'flex-end', marginTop: '15px' };
const btnAddCarStyle = {
    backgroundColor: '#7CFFB2', color: '#1A1A1A', border: '1px solid #A7B1B7', padding: '8px 20px',
    borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)', fontSize: '1.0rem',
    fontFamily: 'Poppins'
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
const btnCancelarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#A7B1B7', color: 'white',
    fontWeight: 'bold', cursor: 'pointer'
};
const btnEliminarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#ff4d4d', color: 'white',
    fontWeight: 'bold', cursor: 'pointer'
};
const btnAceptarStyle = {
    padding: '10px 20px', borderRadius: '10px', border: '1px solid #A7B1B7', backgroundColor: '#FFFFFF',
    cursor: 'pointer'
};
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem', textAlign: 'left' };
const inputStyle = {
    padding: '12px', border: '1px solid #A7B1B7', borderRadius: '15px', fontSize: '1rem', color: '#1A1A1A ',
    backgroundColor: 'white', fontFamily: 'Poppins'
};
const gridRegistroStyle = { fontFamily: 'Poppins', display: 'flex', flexDirection: 'column', gap: '20px' };

export default Perfil;