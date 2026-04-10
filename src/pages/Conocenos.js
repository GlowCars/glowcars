import { UserCircle, Heart, Award, Target } from 'lucide-react';
import fotoTaller from '../images/mapa.png';
import Header from '../common/header.js'
import Footer from '../common/footer.js';

function Conocenos() {

  return (
    <div style={containerPageStyle}>
      {/* --- CABECERA --- */}
      <Header></Header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main style={mainContentStyle}>
        <div style={sectionMisionStyle}>
          <div style={misionTextStyle}>
            <p style={paragraphStyle}>
              <Heart size={20} color="#7CFFB2" style={{ marginRight: '10px' }} />
              Taller mecánico en Fuenlabrada. Ubicado en el corazón de Fuenlabrada,
              entendemos que su coche es una extensión de su vida diaria. Por eso,
              nuestra misión se centra en un compromiso inquebrantable hacia nuestros clientes;
              cada coche que pasa por nuestras manos recibe un tratamiento especial.
              Nuestra prioridad es ofrecer un servicio de calidad y transparente,
              en el que cada detalle cuenta.
            </p>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <h2 style={contactanosStyle}>
                ¡CONTÁCTANOS!
              </h2>
            </div>
          </div>

          {/* FOTO UBICACION */}
          <div style={fotoTallerContainerStyle}>
            <img
              src={fotoTaller}
              alt="Mapa"
              style={fotoStyle}
            />
            <p style={{ color: '#0A3A47', fontSize: '1rem', marginTop: '10px', fontStyle: 'Poppins' }}>
              Pº de Puerto Rico, 1 - Fuenlabrada</p>
          </div>
        </div>

        {/* SECCIÓN 2: VALORES CLAVE */}
        <div style={seccionValoresStyle}>
          <div style={valorItemStyle}>
            <Award size={40} color="#0A3A47" style={valorIconStyle} />
            <h3 style={valorTitleStyle}>CALIDAD CERTIFICADA</h3>
            <p style={valorTextStyle}>Utilizamos piezas originales y tecnología de diagnóstico de última generación.</p>
          </div>
          <div style={valorItemStyle}>
            <Target size={40} color="#0A3A47" style={valorIconStyle} />
            <h3 style={valorTitleStyle}>TRANSPARENCIA</h3>
            <p style={valorTextStyle}>Presupuestos claros y sin letra pequeña. Explicamos cada paso.</p>
          </div>
          <div style={valorItemStyle}>
            <UserCircle size={40} color="#0A3A47" style={valorIconStyle} />
            <h3 style={valorTitleStyle}>EQUIPO EXPERTO</h3>
            <p style={valorTextStyle}>Mecánicos con años de experiencia en marcas líderes.</p>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <Footer></Footer>

    </div>
  );
}

// --- ESTILOS ---
const containerPageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins' };
const mainContentStyle = { flex: 1, backgroundColor: '#FFFFFF', padding: '50px', maxWidth: '1200px', margin: '0 auto' };
const sectionMisionStyle = { display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '80px' };
const misionTextStyle = { flex: 1, minWidth: '350px' };
const paragraphStyle = { fontSize: '1.2rem', color: '#0A3A47', lineHeight: '1.6', marginBottom: '15px', display: 'flex', alignItems: 'start', textAlign: 'justify' };
const fotoTallerContainerStyle = { flex: 1, minWidth: '100px', textAlign: 'center' };
const fotoStyle = { width: '50%', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', objectFit: 'cover' };
const contactanosStyle = {
  backgroundColor: '#7CFFB2',
  color: '#1A1A1A',
  border: '2px solid #0A3A47',
  padding: '10px 10px',
  borderRadius: '15px',
  fontSize: '1.0rem',
  fontWeight: 'bold',
  width: '50%',
  margin: 'auto'
};
const seccionValoresStyle = { display: 'flex', gap: '30px', justifyContent: 'space-between', flexWrap: 'wrap' };
const valorItemStyle = {
  flex: 1,
  minWidth: '250px',
  textAlign: 'center',
  border: '2px solid #7CFFB2',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  backgroundColor: '#f8f7f7'
};
const valorIconStyle = { marginBottom: '20px', display: 'block', margin: '0 auto 20px auto' };
const valorTitleStyle = { color: '#0A3A47', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' };
const valorTextStyle = { color: '#1A1A1A', fontSize: '1.1rem', lineHeight: '1.4' };

export default Conocenos;