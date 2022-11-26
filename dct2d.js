function dctTransform(squares, quantify) {
  if (quantify === undefined) {
    quantify = (x) => x;
  }
  const dctTransformed = [];
  let index = 0;
  const newLine = Math.floor(Canvas.width/8) + 1;
  const pi = Math.PI;
  const cos45 = 1/(2**0.5);
  for (let one of squares) {
    const current = one;
    const X = index < newLine ? index * 8 :(index % newLine) * 8;
    const Y = Math.floor(index/newLine) * 8;
    const localSquare = [];
    for (let u = 0; u < 8; ++u) {
      for (let v = 0; v < 8; ++v) {
        let summe = 0;
        for (let x = 0; x < 8; ++x) {
          for (let y = 0; y < 8; ++y) {
            const color = current[x + (y*8)] - 128;
            const part1 = Math.cos((2 * x + 1) * u * pi / 16);
            const part2 = Math.cos((2 * y + 1) * v * pi / 16);
            summe += color * part1 * part2;
          }
        }
        const cu = u == 0 ? cos45 : 1;
        const cv = v == 0 ? cos45 : 1;
        let value = Math.floor(summe * cu * cv * 0.25 * 100) / 100;
        if (v == 0 && u < 4 && index ==0) console.log(`${value} summe ${summe}`);
        if (typeof value !== 'number') {console.log(`error ${value} ${typeof value}`);}
        value = quantify(value, (v * 8) + u);
        localSquare.push(value);
      }
    }
    ++index;
    dctTransformed.push(localSquare);
  }
  return dctTransformed;
}

function dctUntransform(data, deQuantify) {
  if (deQuantify === undefined) {
    deQuantify = (x) => x;
  }
  const undone = [];
  let index = 0;
  const newLine = Math.floor(Canvas.width/8) + 1;
  const pi = Math.PI;
  const cos45 = 1/(2**0.5);
  for (let one of data) {
    const current = one;
    const X = index < newLine ? index * 8 :(index % newLine) * 8;
    const Y = Math.floor(index/newLine) * 8;
    const localSquare = [];
    for (let x = 0; x < 8; ++x) {
      for (let y = 0; y < 8; ++y) {
        let summe = 0;
        for (let u = 0; u < 8; ++u) {
          for (let v = 0; v < 8; ++v) {
            const color = deQuantify(current[u + v * 8], u + v * 8);
            const part1a = (2 * x + 1) * u * pi /16;
            const part2a = (2 * y + 1) * v * pi /16;
            const cu = u == 0 ? cos45 : 1;
            const cv = v == 0 ? cos45 : 1;
            const part = Math.cos(part1a) * Math.cos(part2a) * color * cu * cv;
            summe += part;
          }
        }
        let value = Math.floor(0.25 * summe + 128);
        if (typeof value !== 'number') {console.log(`error ${value} ${typeof value}`);}
        localSquare.push(value);
      }
    }
    ++index;
    undone.push(localSquare);
  }
  return undone;
}

function quantification(value,index) {
  if (typeof QuantificationTable[index] !== 'number') {
    console.log(`${value} index ${index} (${QuantificationTable[index]}) typeof ${typeof QuantificationTable[index]}`);
  }
  return Math.floor(value/QuantificationTable[index]);
}

function deQuantification(value,index) {
  if (typeof QuantificationTable[index] !== 'number') {
    console.log(`${value} index ${index} (${QuantificationTable[index]}) typeof ${typeof QuantificationTable[index]}`);
  }
  return Math.floor(value * QuantificationTable[index]);
}
