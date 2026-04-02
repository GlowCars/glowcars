import { useNavigate } from 'react-router-dom';
import Header from '../common/header.js'
import Footer from '../common/footer.js';
import mantenimiento from '../images/aceite.png';
import diagnostico from '../images/diagnosis.png';
import reparaciones from '../images/reparaciones.png';
import presupuesto from '../images/presupuesto.png';

const Servicios = () => {
  const navigate = useNavigate(); // Inicializamos el hook para navegar

  // Función genérica para redirigir pasando el tipo de servicio
  const solicitarCita = (nombreServicio) => {
    navigate('/citas', { state: { tipoServicio: nombreServicio } });
  };

  return (
    <div style={containerPageStyle}>
      {/* --- CABECERA --- */}
      <Header></Header>

      {/* --- CUERPO PRINCIPAL --- */}
      <main style={mainContentStyle}>
        <div style={gridServicesStyle}>

          {/* TARJETA 1: MANTENIMIENTO */}
          <div style={cardServiceStyle}>
            <div style={cardTextStyle}>
              <h2 style={cardTitleStyle}>Mantenimiento</h2>
              <p style={cardDescStyle}>
                Realizamos revisiones periódicas. Incluye cambio de aceite y filtros,
                revisión de frenos, fluidos, llantas y luces.
              </p>
            </div>
            <img src={mantenimiento} alt="aceite" style={cardImgStyle} />
            <button
              style={btnPideCitaStyle}
              onClick={() => solicitarCita('Mantenimiento')}
            >
              Pide tu cita
            </button>
          </div>

          {/* TARJETA 2: DIAGNÓSTICOS */}
          <div style={cardServiceStyle}>
            <div style={cardTextStyle}>
              <h2 style={cardTitleStyle}>Diagnósticos</h2>
              <p style={cardDescStyle}>
                Realizamos diagnósticos que nos permite detectar y
                analizar fallos o anomalías en su vehículo.
              </p>
            </div>
            <img src={diagnostico} alt="diagnosis" style={cardImgStyle} />
            <button
              style={btnPideCitaStyle}
              onClick={() => solicitarCita('Diagnóstico')}
            >
              Pide tu cita
            </button>
          </div>

          {/* TARJETA 3: REPARACIONES */}
          <div style={cardServiceStyle}>
            <div style={cardTextStyle}>
              <h2 style={cardTitleStyle}>Reparaciones</h2>
              <p style={cardDescStyle}>
                Realizamos reparaciones de motor, embragues, correas de distribución,
                sistemas de escape y cajas de cambios, entre otros.
              </p>
            </div>
            <img src={reparaciones} alt="reapraciones" style={cardImgStyle} />
            <button
              style={btnPideCitaStyle}
              onClick={() => solicitarCita('Reparación')}
            >
              Pide tu cita
            </button>
          </div>

          {/* TARJETA 4: PRESUPUESTOS */}
          <div style={cardServiceStyle}>
            <div style={cardTextStyle}>
              <h2 style={cardTitleStyle}>Presupuestos</h2>
              <p style={cardDescStyle}>
                Realizamos presupuestos detallados que desglosa las reparaciones, repuestos,
                mano de obra, impuestos y fecha estimada de entrega.
              </p>
            </div>
            <img src={presupuesto} alt="presuuesto" style={cardImgStyle} />
            <button
              style={btnPideCitaStyle}
              onClick={() => solicitarCita('Presupuesto')}
            >
              Pide tu cita
            </button>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer></Footer>

    </div>
  );
};

// --- ESTILOS ---
const colors = {
  header: '#263a45',
  brand: '#8be28b',
  textCard: '#333',
  btnCita: '#c7ffc7',
};
const containerPageStyle = {
  display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Poppins',
  backgroundColor: '#fff'
};
const mainContentStyle = { flex: 1, padding: '100px', display: 'flex', justifyContent: 'center' };
const gridServicesStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '70px 70px', maxWidth: '1200px',
  width: '100%', padding: '20px', justifyContent: 'space-between'
};
const cardServiceStyle = {
  backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', padding: '20px',
  display: 'flex', alignItems: 'flex-start', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'relative', width: '100%'
};
const cardTextStyle = { flex: 1, textAlign: 'left' };
const cardTitleStyle = { margin: '0 0 10px 0', fontSize: '1.3rem', color: colors.textCard, fontWeight: 'bold' };
const cardDescStyle = { margin: 0, fontSize: '1.1rem', color: colors.textCard, lineHeight: '1.4', textAlign: 'justify' };
const cardImgStyle = { width: '100px', height: '100px', borderRadius: '20px', objectFit: 'cover' };
const btnPideCitaStyle = {
  backgroundColor: colors.btnCita, color: colors.textCard, border: '1px solid #999',
  padding: '10px 20px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', position: 'absolute', bottom: '-43px',
  right: '20px', fontWeight: 'bold', fontFamily: 'inherit'
};

export default Servicios;