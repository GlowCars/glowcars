import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import vehiculo from '../images/vehiculo.avif';
import axios from 'axios';

const AltaVehiculo = () => {
    //Marcamos las variables
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
        //Llamamos al servicio y que nos devuelva los datos
        try {
            const urlCreateCar = `http://localhost:5000/createCar`;
            const matricula = datosVehiculo.matricula;
            const marca = datosVehiculo.marca;
            const modelo = datosVehiculo.modelo;
            const anio = datosVehiculo.anio;
            const bastidor = datosVehiculo.bastidor;
            const id_new_user = user.id;
            const resCreateCar = await axios.post(urlCreateCar, { id_new_user, matricula, marca, modelo, anio, bastidor });
            if (resCreateCar.status === 200 || resCreateCar.status === 201) {
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un error al registrar los datos.");
        }
    };

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
                <form onSubmit={handleRegistro} style={gridRegistroStyle}>

                    {/* ALTA VEHÍCULO */}
                    <div style={formSideStyle}>
                        <div style={formHeaderStyle}>
                            <img src={vehiculo} alt="Vehiculo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <h2 style={formTitleStyle}>Vehículo</h2>
                        </div>
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
                            <input type="text" name="anio" placeholder="Año" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nº de bastidor</label>
                            <input type="text" name="bastidor" placeholder="Nº bastidor" style={inputStyle} onChange={handleCambioVehiculo} required />
                        </div>
                    </div>

                    <div style={btnCenteringStyle}>
                        <button type="submit" style={btnRegistroStyle}>Añadir</button>
                    </div>
                </form>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>

            {/* --- VENTANA EMERGENTE --- */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
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
            )}
        </div>
    );
};

// --- ESTILOS ---
const colors = { header: '#263a45', brand: '#8be28b', formTitle: '#333', inputBorder: '#bbb', inputBg: '#eee', btnRegistro: '#c7ffc7' };
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins', backgroundColor: '#fff' };
const mainContentStyle = { flex: 1, padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' };
const gridRegistroStyle = { display: 'grid', gap: '50px', width: '30%', alignItems: 'start', margin: '0 auto' };
const formSideStyle = { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' };
const formHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' };
const formTitleStyle = { margin: 0, fontSize: '1.4rem', color: colors.formTitle, fontWeight: 'bold' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start', width: '100%' };
const labelStyle = { fontSize: '0.9rem', color: colors.formTitle, fontWeight: 'bold' };

const inputStyle = {
    padding: '10px',
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '20px', backgroundColor: colors.inputBg,
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box'
};
const btnCenteringStyle = { gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '30px' };

const btnRegistroStyle = {
    backgroundColor: colors.btnRegistro,
    color: colors.formTitle,
    border: '1px solid #999',
    padding: '10px 30px',
    borderRadius: '20px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
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
const modalButtonsStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' };
const btnAceptarStyle = { padding: '10px 20px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#eee', cursor: 'pointer' };

export default AltaVehiculo;