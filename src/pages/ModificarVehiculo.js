import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculoImg from '../images/vehiculo.avif';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const ModificarVehiculo = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ id: '', nombre: 'Usuario', apellidos: '' });
    const [showModal, setShowModal] = useState(false);
    const vehiculoData = location.state?.vehiculo;

    // Inicializamos con los datos del vehículo recibido
    const [vehiculoUpdate, setvehiculoUpdate] = useState({
        id_vehiculo: vehiculoData?.id_vehiculo,
        matricula: vehiculoData?.matricula,
        marca: vehiculoData?.marca,
        modelo: vehiculoData?.modelo,
        fc_mat: vehiculoData?.fc_mat,
        bastidor: vehiculoData?.bastidor
    });
    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        const sessionParsed = JSON.parse(session)
        setUser({
            id: sessionParsed.id,
            nombre: sessionParsed.nombre,
            apellidos: sessionParsed.apellidos
        });
        if (!vehiculoData) {
            navigate('/perfil');
        }
    }, [navigate, vehiculoData]);

    const handleCambioVehiculo = (e) => {
        setvehiculoUpdate({ ...vehiculoUpdate, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        // Llamamos al servicio updateCar para actualizar el vehiculo y guardar en BBDD
        try {
            const urlUpdate = `http://localhost:5000/updateCar/${vehiculoUpdate.id_vehiculo}`;
            const matricula = vehiculoUpdate.matricula;
            const marca = vehiculoUpdate.marca;
            const modelo = vehiculoUpdate.modelo;
            const fc_mat = vehiculoUpdate.fc_mat;
            const bastidor = vehiculoUpdate.bastidor;
            const id_new_user = user.id;
            const res = await axios.put(urlUpdate, { id_new_user, matricula, marca, modelo, fc_mat, bastidor });
            if (res.status === 200) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error al modificar:", error);
            alert("No se pudieron guardar los cambios.");
        }
    };
    // Boton aceptar y redirigue a perfil cerrando la modal
    const handleAccept = async (e) => {
        setShowModal(false);
        navigate('/perfil');
    }

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>
            {/* --- FORMULARIO --- */}
            <main style={mainContentStyle}>
                <div style={formWrapper}>
                    <div style={formHeaderStyle}>
                        <img src={vehiculoImg} alt="Vehiculo" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                        <h2 style={formTitleStyle}>Modificar Vehículo</h2>
                    </div>
                    <form onSubmit={handleRegistro} style={gridRegistroStyle}>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Matrícula</label>
                            <input
                                type="text" name="matricula" style={inputStyle}
                                value={vehiculoUpdate.matricula}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Marca</label>
                            <input
                                type="text" name="marca" style={inputStyle}
                                value={vehiculoUpdate.marca}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Modelo</label>
                            <input
                                type="text" name="modelo" style={inputStyle}
                                value={vehiculoUpdate.modelo}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Año</label>
                            <input
                                type="number" name="fc_mat" style={inputStyle}
                                value={vehiculoUpdate.fc_mat}
                                onChange={handleCambioVehiculo} required
                                onInput={(e) => {
                                    if (e.target.value.length > 4) {
                                        e.target.value = e.target.value.slice(0, 4);
                                    }
                                }} />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nº de bastidor</label>
                            <input
                                type="text" name="bastidor" style={inputStyle}
                                value={vehiculoUpdate.bastidor}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>

                        <div>
                            <button type="submit" style={btnRegistroStyle}>Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>
            {/* --- VENTANA MODAL --- */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
                        <h3 style={{ color: '#1A1A1A' }}>Vehículo modificado</h3>
                        <p>El vehículo ha sido modificado correctamente.</p>

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
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins', backgroundColor: '#fff' };
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const gridRegistroStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formHeaderStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const formTitleStyle = { margin: 0, fontSize: '1.4rem', color: colors.formTitle, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left', fontFamily: 'Arial, sans-serif' };
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem' };
const inputStyle = {
    padding: '12px', border: '1px solid #A7B1B7', borderRadius: '15px', fontSize: '1rem', color: '#1A1A1A ',
    backgroundColor: 'white'
};
const formWrapper = { width: '100%', maxWidth: '400px', textAlign: 'center' };
const btnRegistroStyle = {
    backgroundColor: '#7CFFB2', border: '1px solid #A7B1B7', padding: '14px', borderRadius: '20px',
    fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
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

export default ModificarVehiculo;