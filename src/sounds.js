import { Howl } from 'howler';

// Definice zvukových efektů
export const flipSound = new Howl({
  src: [`${process.env.PUBLIC_URL}/sounds/flip.mp3`]
});

export const successSound = new Howl({
  src: [`${process.env.PUBLIC_URL}/sounds/success.mp3`]
});

export const whooshSound = new Howl({
  src: [`${process.env.PUBLIC_URL}/sounds/whoosh.mp3`]
});
