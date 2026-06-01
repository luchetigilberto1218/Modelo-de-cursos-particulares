import { getRacionalIndex } from '../../lib/racional';
import RacionalLanding from '../../components/racional/RacionalLanding';

export default function RacionalHome() {
  const index = getRacionalIndex();
  return <RacionalLanding index={index} />;
}
