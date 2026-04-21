import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculo from '../images/vehiculo.avif';
import axios from 'axios';
import { CircleCheckBig } from 'lucide-react';

const AltaVehiculo = () => {
    // Variables
    const navigate = useNavigate();
    const [user, setUser] = useState({ id: '', nombre: 'Usuario', apellidos: '' });
    const [showModal, setShowModal] = useState(false);

    // Guardamos los datos que necesitamos
    const [datosVehiculo, setDatosVehiculo] = useState({
        matricula: '', marca: '', modelo: '', anio: '', bastidor: ''
    });

    const handleCambioVehiculo = (e) => {
        setDatosVehiculo({ ...datosVehiculo, [e.target.name]: e.target.value });
    };

    // Cogemos los datos de usuario del sessionStorage
    useEffect(() => {
        const session = sessionStorage.getItem('usuarioGlowcars');
        const sessionParsed = JSON.parse(session)
        setUser({
            id: sessionParsed.id,
            nombre: sessionParsed.nombre,
            apellidos: sessionParsed.apellidos
        });
    }, [navigate]);

    const handleRegistro = async (e) => {
        e.preventDefault();
        //Llamamos al servicio createCar y dar de alta en BBDD al vehiculo
        try {
            const urlCreateCar = `http://localhost:5000/createCar`;
            const matricula = datosVehiculo.matricula;
            const marca = datosVehiculo.marca;
            const modelo = datosVehiculo.modelo;
            const anio = datosVehiculo.anio;
            const bastidor = datosVehiculo.bastidor;
            const id_new_user = user.id;
            const resCreateCar = await axios.post(urlCreateCar, { id_new_user, matricula, marca, modelo, anio, bastidor });
            if (resCreateCar.status === 200) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un error al registrar los datos.");
        }
    };
    // Boton aceptar y redirigue el perfil cerrando la modal
    const handleAccept = async (e) => {
        setShowModal(false);
        navigate('/perfil');
    }

    return (
        <div style={containerPageStyle}>
            {/* --- CABECERA --- */}
            <Header></Header>


            <main style={mainContentStyle}>
                <div style={formSideStyle}>
                    <div style={formHeaderStyle}>
                        <img src={vehiculo} alt="Vehiculo" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                        <h2 style={formTitleStyle}>Alta de Vehículo</h2>
                    </div>

                    {/* --- FORMULARIO --- */}
                    <form onSubmit={handleRegistro} style={gridRegistroStyle}>

                        {/* ALTA DE VEHÍCULO */}
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Matrícula</label>
                            <input type="text" name="matricula" placeholder="Matrícula" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Marca</label>
                            <input type="text" name="marca" placeholder="Marca" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Modelo</label>
                            <input type="text" name="modelo" placeholder="Modelo" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Año</label>
                            <input type="number" name="anio" placeholder="Año" style={inputStyle} onChange={handleCambioVehiculo} required
                                onInput={(e) => {
                                    if (e.target.value.length > 4) {
                                        e.target.value = e.target.value.slice(0, 4);
                                    }
                                }} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nº de bastidor</label>
                            <input type="text" name="bastidor" placeholder="Nº bastidor" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>

                        <div style={btnCenteringStyle}>
                            <button type="submit" style={btnRegistroStyle}>Añadir</button>
                        </div>
                    </form>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>

            {/* --- VENTANA MODAL --- */}
            {
                showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <CircleCheckBig size={48} color="#7CFFB2" style={{ marginBottom: '15px' }} />
                            <h3 style={{ color: '#1A1A1A' }}>Alta de vehículo confirmada</h3>
                            <p>El vehículo ha sido dado de alta correctamente.</p>

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
                )
            }
        </div >
    );
};

// --- ESTILOS ---
const colors = {
    header: '#0A3A47', brand: '#7CFFB2', formTitle: '#1A1A1A', inputBorder: '#A7B1B7', inputBg: '#FFFFFF',
    btnRegistro: '#7CFFB2'
};
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins',
    backgroundColor: '#FFFFFF'
};
const mainContentStyle = { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' };
const gridRegistroStyle = { fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', gap: '20px' };
const formSideStyle = { width: '100%', maxWidth: '400px', textAlign: 'center' };
const formHeaderStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const formTitleStyle = { margin: 0, fontSize: '1.4rem', color: colors.formTitle, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' };
const labelStyle = { color: '#1A1A1A ', fontSize: '1.1rem' };
const inputStyle = {
    padding: '12px', border: '1px solid #A7B1B7', borderRadius: '15px', fontSize: '1rem', color: '#1A1A1A ',
    backgroundColor: 'white'
};
const btnCenteringStyle = { gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' };
const btnRegistroStyle = {
    backgroundColor: '#7CFFB2', border: '1px solid #A7B1B7', padding: '14px', borderRadius: '20px', fontSize: '1.1rem',
    cursor: 'pointer', marginTop: '10px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
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

export default AltaVehiculo;