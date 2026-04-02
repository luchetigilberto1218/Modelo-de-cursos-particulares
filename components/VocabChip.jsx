'use client';

import { useState } from 'react';

export default function VocabChip({ en, pt }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <span
      className={`vocab-chip${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      title="Click to see translation"
    >
      <span className="vc-en">{en}</span>
      <span className="vc-pt">{pt}</span>
    </span>
  );
}
