import { Phone, Mail, Clock, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {

    return (
        < footer style={footerStyle} >
            <div style={footerGrid}>
                <div style={footerItem}><Phone size={18} /> ¡LLAMANOS!<br />91 123 456</div>
                <div style={footerItem}><Mail size={18} /> ¡ESCRIBENOS!<br />glowcars@taller.com</div>
                <div style={footerItem}><Clock size={18} /> ¡HORARIO!<br />L-V 9:00 a 20:00</div>
            </div>
            <div style={socialIcons}>
                <Twitter size={20} /> <Instagram size={20} /> <Facebook size={20} />
            </div>
        </footer >
    );
};

// --- ESTILOS ---
const footerStyle = { backgroundColor: '#0A3A47', color: 'white', padding: '20px 50px' };
const footerGrid = { display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #1A1A1A', paddingBottom: '15px' };
const footerItem = {
    opacity: 0.8, textAlign: 'center', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '5px', fontFamily: 'Poppins', color: '#FFFFFF'
};
const socialIcons = { color: '#7CFFB2', display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' };

export default Footer; 