import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import cliente from '../images/cliente.jpg';
import axios from 'axios';
import vehiculo from '../images/vehiculo.avif';

const Registro = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // 1. ESTADOS PARA CAPTURAR LOS DATOS
    const [datosCliente, setDatosCliente] = useState({
        nombre: '', apellidos: '', telefono: '', email: '', password: ''
    });

    const [datosVehiculo, setDatosVehiculo] = useState({
        matricula: '', marca: '', modelo: '', anio: '', bastidor: ''
    });

    // 2. FUNCIONES PARA ACTUALIZAR LOS CAMPOS
    const handleCambioCliente = (e) => {
        setDatosCliente({ ...datosCliente, [e.target.name]: e.target.value });
    };

    const handleCambioVehiculo = (e) => {
        setDatosVehiculo({ ...datosVehiculo, [e.target.name]: e.target.value });
    };

    // 3. FUNCIÓN DE ENVÍO FINAL Y GUARDADO DE SESIÓN
    const handleRegistro = async (e) => {
        e.preventDefault();

        const registroCompleto = {
            cliente: datosCliente,
            vehiculo: datosVehiculo
        };

        try {
            const email = registroCompleto.cliente.email;
            const urlCheck = `http://localhost:5000/checkUser?email=${email}`;
            const resCheck = await axios.get(urlCheck);
            console.log(resCheck)
            if (resCheck.status === 200) {
                alert(resCheck.data.mensaje);
            } else if (resCheck.status === 201) {
                const urlCreate = `http://localhost:5000/createUser`;
                const nombre = registroCompleto.cliente.nombre;
                const apellidos = registroCompleto.cliente.apellidos;
                const telefono = registroCompleto.cliente.telefono;
                const password = registroCompleto.cliente.password;
                const rol = "cliente";
                const fecha_registro = new Date();
                const resCreate = await axios.post(urlCreate, { nombre, apellidos, telefono, email, password, rol, fecha_registro });
                const id_new_user = resCreate.data.id;

                const urlCreateCar = `http://localhost:5000/createCar`;
                const matricula = registroCompleto.vehiculo.matricula;
                const marca = registroCompleto.vehiculo.marca;
                const modelo = registroCompleto.vehiculo.modelo;
                const anio = registroCompleto.vehiculo.anio;
                const bastidor = registroCompleto.vehiculo.bastidor;
                const resCreateCar = await axios.post(urlCreateCar, { id_new_user, matricula, marca, modelo, anio, bastidor });
                const id_new_car = resCreateCar.data.id
                console.log(id_new_car)
                const url = 'http://localhost:5000/login';
                const respuesta = await axios.post(url, { email, password });
                const datosUsuario = {
                    email: respuesta.data.email,
                    id: respuesta.data.id,
                    apellidos: respuesta.data.apellidos,
                    nombre: respuesta.data.nombre,
                    telefono: respuesta.data.telefono,
                    rol: respuesta.data.rol,
                    fecha_registro: respuesta.data.fecha_registro,
                    isLoggedIn: true,
                    token: respuesta.data.token || 'fake-token-123' // Guardamos el token si el backend lo da
                };

                // 3. GUARDAMOS EN SESSION STORAGE
                // Importante: Convertir a String porque el storage no acepta objetos directamente
                sessionStorage.setItem('usuarioGlowcars', JSON.stringify(datosUsuario));
            }
            // Al estar logueado, lo mandamos directo al perfil
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

            {/* --- FORMULARIO --- */}
            <main style={mainContentStyle}>
                <form onSubmit={handleRegistro} style={gridRegistroStyle}>

                    {/* SECCIÓN CLIENTE */}
                    <div style={formSideStyle}>
                        <div style={formHeaderStyle}>
                            <img src={cliente} alt="Cliente" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <h2 style={formTitleStyle}>Cliente</h2>
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Nombre</label>
                            <input type="text" name="nombre" placeholder="Nombre" style={inputStyle} onChange={handleCambioCliente} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Apellidos</label>
                            <input type="text" name="apellidos" placeholder="Apellidos" style={inputStyle} onChange={handleCambioCliente} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Teléfono</label>
                            <input type="number" name="telefono" placeholder="Teléfono" style={inputStyle} onChange={handleCambioCliente} required
                                onInput={(e) => {
                                    if (e.target.value.length > 9) {
                                        e.target.value = e.target.value.slice(0, 9);
                                    }
                                }} />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Email</label>
                            <input type="email" name="email" placeholder="Email" style={inputStyle} onChange={handleCambioCliente} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Contraseña</label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    style={inputStyle}
                                    onChange={handleCambioCliente}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={eyeButtonStyle}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN VEHÍCULO */}
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
                    </div>

                    <div style={btnCenteringStyle}>
                        <button type="submit" style={btnRegistroStyle}>Registrarse</button>
                    </div>
                </form>
            </main>

            {/* --- FOOTER --- */}
            <Footer></Footer>

        </div>
    );
};

// --- ESTILOS ---
const eyeButtonStyle = {
    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#666'
};
const colors = {
    header: '#263a45', brand: '#8be28b', formTitle: '#333', inputBorder: '#bbb', inputBg: '#eee',
    btnRegistro: '#c7ffc7'
};
const containerPageStyle = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff'
};
const mainContentStyle = { flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const gridRegistroStyle = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', maxWidth: '1000px', width: '100%',
    alignItems: 'start', margin: '0 auto'
};
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

export default Registro;