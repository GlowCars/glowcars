import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Header from '../common/header.js'
import Footer from '../common/footer.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState({ texto: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN CORREGIDA ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:5000/login';

      // 1. Intentamos la conexión con el backend
      const respuesta = await axios.post(url, { email, password });

      // 2. Si el login es correcto, preparamos el objeto de sesión
      const nombreUsuario = email.split('@')[0].toUpperCase();
      const iniciales = nombreUsuario.substring(0, 2);
      console.log(respuesta)
      const datosUsuario = {
        email: respuesta.data.email,
        id: respuesta.data.id,
        apellidos: respuesta.data.apellidos,
        nombre: respuesta.data.nombre,
        telefono: respuesta.data.telefono,
        rol: respuesta.data.rol,
        fecha_registro: respuesta.data.fecha_registro,
        iniciales: iniciales,
        isLoggedIn: true,
        token: respuesta.data.token || 'fake-token-123' // Guardamos el token si el backend lo da
      };
      // 3. GUARDAMOS EN SESSION STORAGE
      sessionStorage.clear();
      sessionStorage.setItem('usuarioGlowcars', JSON.stringify(datosUsuario));

      setInfo({ texto: "¡Usuario reconocido! Entrando en tu perfil...", color: 'green' });

      // 4. Redirigimos a /perfil 
      setTimeout(() => navigate('/perfil'), 1000);

    } catch (error) {
      if (!error.response) {
        setInfo({ texto: "Error: El servidor no responde.", color: 'orange' });
      } else {
        setInfo({ texto: "Email o contraseña incorrectos.", color: 'red' });
      }
    }
  };

  const handleOlvidoPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setInfo({ texto: "Introduce tu email para recuperar la clave.", color: '#263a45' });
    } else {
      setInfo({ texto: `Instrucciones enviadas a ${email}`, color: 'green' });
    }
  };

  const goToRegistro = () => {
    navigate('/registro');
  };

  return (
    <div style={containerPageStyle}>
      {/* --- CABECERA --- */}
      <Header></Header>

      <main style={mainContentStyle}>
        <div style={formCardStyle}>
          <UserCircle2 size={60} color="#263a45" style={{ marginBottom: '20px' }} />

          <form style={formLayout} onSubmit={handleLogin}>
            <div style={inputGroupFull}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={inputGroupFull}>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ ...inputStyle, width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButtonStyle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'left', margin: '0' }}>
              <a href="#olvido" onClick={handleOlvidoPassword} style={{ color: '#263a45', fontSize: '0.9rem', textDecoration: 'underline' }}>
                ¿Has olvidado la contraseña?
              </a>
            </p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="submit" style={btnActionStyle}>Entrar</button>
              <button type="button" style={btnActionStyle} onClick={goToRegistro}>
                Registrarse
              </button>
            </div>

            {info.texto && (
              <div style={{ marginTop: '15px', color: info.color, fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>
                {info.texto}
              </div>
            )}
          </form>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer></Footer>

    </div>
  );
}

// --- ESTILOS ---
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins' };
const mainContentStyle = {
  flex: 1, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center',
  padding: '40px 20px'
};
const formCardStyle = { width: '100%', maxWidth: '350px', padding: '20px', textAlign: 'center' };
const formLayout = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputGroupFull = { display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' };
const labelStyle = { fontSize: '1rem', color: '#333' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '1rem', width: '100%' };
const eyeButtonStyle = {
  position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none',
  border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', padding: '0'
};
const btnActionStyle = {
  flex: 1, backgroundColor: '#c7ffc7', color: '#000', border: '1px solid #999', padding: '10px',
  borderRadius: '15px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',fontFamily: 'inherit'
};

export default Login;