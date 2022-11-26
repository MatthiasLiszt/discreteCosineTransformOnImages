
function dctTransformSimple(squares) {
  const dctTransformed = [];
  const pi = Math.PI;
  for (let one of squares) {
    const current = one;
    const localSquare = [];
    for (let o = 0; o < 64; ++o) {
      let summe = 0;
      for (let i = 0; i < 64; ++i) {
        const color = current[i] - 128;
        const part = (pi/64) * (i + 0.5) * o;
        summe += color * Math.cos(part);
      }
      const ck = o == 0 ? 0.125 : (1/32)**0.5;
      const value = summe * ck;
      localSquare.push(value);
    }
    dctTransformed.push(localSquare);
  }
  return dctTransformed;
}

function dctUntransformSimple(data) {
  const undone = [];
  const pi = Math.PI;
  const sqrt2 = 2**0.5;
  for (let one of data) {
    const current = one;
    const localSquare = [];
    for (let o = 0; o < 64; ++o) {
      let summe = 0;
      for (let i = 0; i < 64; ++i) {
        const color = current[i];
        const part = (pi/64) * (o + 0.5) * i;
        summe += color * Math.cos(part);
      }
      const added = current[0]/sqrt2;
      //const added = 0.5 * current[0];
      const ck = (1/32)**0.5;
      const some = 32 + 40;
      const value = Math.floor((added + summe) * ck);
      localSquare.push(value + 128 + some);
    }
    undone.push(localSquare);
  }
  return undone;
}
