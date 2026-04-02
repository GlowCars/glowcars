import { useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import miFondo from '../images/fondo.jpeg';
import miCoche from '../images/coche.jpg';
import Footer from '../common/footer.js';

function Home() {
  const navigate = useNavigate(); // Inicializamos el navegador

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Poppins', flexDirection: 'column', display: 'flex', flex: '1' }}>

      {/* --- CABECERA --- */}
      <Header></Header>

      {/* --- FONDO --- */}
      <div style={heroContainer}>
        <img
          src={miFondo}
          alt="Taller"
          style={heroImage}
        />
      </div>

      {/* --- CUERPO --- */}
      <main style={mainContent}>
        <div style={flexLayout}>
          <div style={textContainer}>
            {/* Título dinámico para que sepa dónde está */}
            <h2 style={{ color: '#263a45', marginBottom: '20px' }}>Bienvenidos a Glowcars</h2>
            <p style={paragraphStyle}>
              Somos un taller que ofrece el servicio que necesite usted para
              su coche, ya sea un mantenimiento, una puesta a punto o
              una reparación. Además, puedes contar con nosotros para
              asesorarte en todo lo que precise, seremos su taller de
              confianza.
            </p>
            <div style={buttonGroup}>
              {/* Botón que también lleva a conócenos */}
              <button style={btnGreen} onClick={() => navigate('/conocenos')}>Visítanos</button>
              {/* Botón que también lleva a servicios */}
              <button style={btnGreen} onClick={() => navigate('/servicios')}>Servicios</button>
              {/* Citas lleva a Login porque necesitas cuenta para pedir cita */}
              <button style={btnGreen} onClick={() => navigate('/citas')}>Citas</button>
            </div>
          </div>

          <div style={carImageContainer}>
            <img
              src={miCoche}
              alt="Coche"
              style={{ width: '100%', borderRadius: '15px', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer></Footer>

    </div>
  );
}

// --- ESTILOS ---
const heroContainer = { height: '300px', overflow: 'hidden', borderBottom: '5px' };
const heroImage = { width: '100%', height: '80%', objectFit: 'center' };
const mainContent = { flex: 1, padding: '15px', maxWidth: '1100px', margin: '0 auto' };
const flexLayout = { display: 'flex', alignItems: 'center', gap: '60px' };
const textContainer = { flex: 1.5, textAlign: 'left' };
const carImageContainer = { flex: 1 };
const paragraphStyle = { fontSize: '1.2rem', color: '#444', lineHeight: '1.6', textAlign: 'justify' };
const buttonGroup = { display: 'flex', gap: '20px', justifyContent: 'flex-start', marginTop: '30px'};
const btnGreen = {backgroundColor: '#c7ffc7', border: '1px solid #999', padding: '12px 30px', borderRadius: '15px',
  fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0px 4px 4px rgba(0,0,0,0.1)', fontFamily: 'inherit'
};

export default Home;