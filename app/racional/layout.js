import './racional.css';
import RacionalAudioBoot from '../../components/racional/RacionalAudioBoot';

export const metadata = {
  title: 'Programa de Inglês Executivo · Racional Engenharia × Alumni',
  description: 'Plataforma de estudos de inglês executivo da Racional Engenharia, por Alumni.',
};

export default function RacionalLayout({ children }) {
  return <div className="rc"><RacionalAudioBoot />{children}</div>;
}
