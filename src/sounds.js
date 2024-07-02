import { Howl } from 'howler';

// Definice zvukových efektů
export const flipSound = new Howl({
  src: ['/sounds/flip.mp3']
});

export const successSound = new Howl({
  src: ['/sounds/success.mp3']
});

export const whooshSound = new Howl({
  src: ['/sounds/whoosh.mp3']
});
