import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importamos useLocation
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculoImg from '../images/vehiculo.avif';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const ModificarVehiculo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ id: '', nombre: 'Usuario', apellidos: '' });
    const [showModal, setShowModal] = useState(false);
    const vehiculoData = location.state?.vehiculo;

    // 1. ESTADOS: Inicializamos con los datos del vehículo recibido
    const [vehiculoUpdate, setvehiculoUpdate] = useState({
        id_vehiculo: vehiculoData?.id_vehiculo,
        matricula: vehiculoData?.matricula,
        marca: vehiculoData?.marca,
        modelo: vehiculoData?.modelo,
        fc_mat: vehiculoData?.fc_mat,
        bastidor: vehiculoData?.bastidor
    });

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

    // 3. FUNCIÓN DE ENVÍO (UPDATE)
    const handleRegistro = async (e) => {
        e.preventDefault();

        try {
            const urlUpdate = `http://localhost:5000/updateCar/${vehiculoUpdate.id_vehiculo}`;
            const matricula = vehiculoUpdate.matricula;
            const marca = vehiculoUpdate.marca;
            const modelo = vehiculoUpdate.modelo;
            const fc_mat = vehiculoUpdate.fc_mat;
            const bastidor = vehiculoUpdate.bastidor;
            const id_new_user = user.id;
            const res = await axios.put(urlUpdate, { id_new_user, matricula, marca, modelo, fc_mat, bastidor });
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
        navigate('/perfil');
    }

    return (
        <div style={containerPageStyle}>
            <Header />

            <main style={mainContentStyle}>
                <form onSubmit={handleRegistro} style={gridRegistroStyle}>
                    <div style={formSideStyle}>
                        <div style={formHeaderStyle}>
                            <img src={vehiculoImg} alt="Vehiculo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <h2 style={formTitleStyle}>Modificar Vehículo</h2>
                        </div>

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
                                type="text" name="fc_mat" style={inputStyle}
                                value={vehiculoUpdate.fc_mat}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nº de bastidor</label>
                            <input
                                type="text" name="bastidor" style={inputStyle}
                                value={vehiculoUpdate.bastidor}
                                onChange={handleCambioVehiculo} required
                            />
                        </div>
                    </div>

                    <div style={btnCenteringStyle}>
                        <button type="submit" style={btnRegistroStyle}>Guardar Cambios</button>
                    </div>
                </form>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <CircleCheckBig style={{ color: '#8be28b', size: 100 }} />
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
    header: '#263a45', brand: '#8be28b', formTitle: '#333', inputBorder: '#bbb', inputBg: '#eee',
    btnRegistro: '#c7ffc7'
};
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff'
};
const mainContentStyle = { flex: 1, padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' };
const gridRegistroStyle = { display: 'grid', gap: '50px', width: '30%', alignItems: 'start', margin: '0 auto' };
const formSideStyle = { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' };
const formHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' };
const formTitleStyle = { margin: 0, fontSize: '1.4rem', color: colors.formTitle, fontWeight: 'bold' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start', width: '100%' };
const labelStyle = { fontSize: '0.9rem', color: colors.formTitle, fontWeight: 'bold' };
const inputStyle = {
    padding: '10px', border: `1px solid ${colors.inputBorder}`, borderRadius: '20px', backgroundColor: colors.inputBg,
    fontSize: '1rem', width: '100%', boxSizing: 'border-box'
};
const btnCenteringStyle = { gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '30px' };
const btnRegistroStyle = {
    backgroundColor: colors.btnRegistro, color: colors.formTitle, border: '1px solid #999', padding: '10px 30px',
    borderRadius: '20px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
export default ModificarVehiculo;