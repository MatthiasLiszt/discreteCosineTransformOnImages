//constants
//const DefaultPicture = document.getElementById('defaultpic');
const DefaultPicture = mooncalf;
const Canvas = document.getElementById("canvas");
const Context = Canvas.getContext('2d');
const OutputCanvas = document.getElementById("dctoutput");
const Output = OutputCanvas.getContext('2d');
const QuantificationTable = [
  10,15,25,37, 51,66,82,100,
  15,19,28,39, 52,67,83,101,
  25,28,35,45, 58,72,88,105,
  37,39,45,54, 66,79,94,111,
  51,52,58,66, 76,89,103,119,
  66,67,72,79, 89,101,114,130,
  82,83,88,94, 103,114,127,142,
  100,101,105,111 ,119,130,142,156
];
const Testmatrix = [
  52,55,61,66, 70,61,64,73,
  63,59,55,90, 109,85,69,72,
  62,59,68,113, 144,104,66,73,
  63,58,71,122, 154,106,70,69,
  67,61,68,104, 126,88,68,70,
  79,65,60,70, 77,68,58,75,
  85,71,64,59, 55,61,65,83,
  87,79,69,68, 65,76,78,94,
];

function init() {
  const image = new Image();
  image.src = DefaultPicture;
  image.onload = () => {
    Canvas.width = Canvas.height = 300;
    Context.drawImage(image,0,0);
    console.log(`width ${Canvas.width} height ${Canvas.height}`);
    OutputCanvas.width = Canvas.width;
    OutputCanvas.height = Canvas.height;
    const values = getBrightnessValues();
    const squares = splitIntoSquares(values);
    reconstructPartlyFromSquares(squares);
    console.log('<p>calculating discrete cosine transform</p>');
    console.log(`length QuantificationTable ${QuantificationTable.length}`);
    squares[0] = Testmatrix;
    const dctTransformed = dctTransform(squares);
    console.log('<p>filtering last 24 frequencies</p>');
    const filtered = filterHigherFrequencies(dctTransformed, 24);
    console.log('filtered '+JSON.stringify(filtered[0]));
    console.log('<p>undoing discrete cosine transform</p>');
    const dctUndone = dctUntransform(filtered);
    reconstructFullyFromSquares(dctUndone);
    console.log('squares ' + JSON.stringify(squares[0]));
    console.log('dct transformed ' + JSON.stringify(dctTransformed[0]));
    console.log('dct undone ' + JSON.stringify(dctUndone[0]));
  };
  
}

function getBrightnessValues() {
  const imageData = Context.getImageData(0,0,Canvas.width,Canvas.height);
  const values = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    let value = imageData.data[''+i];
    value = imageData.data[''+(i+1)] > value ? imageData.data[''+(i+1)] : value;
    value = imageData.data[''+(i+2)] > value ? imageData.data[''+(i+2)] : value;
    values.push(value);
  }
  return values;
}

function splitIntoSquares(values) {
  const squares = [];
  for (let y = 0; y < Canvas.height; y+=8) {
    for (let x = 0; x < Canvas.width; x+=8) {
      const localSquare = [];
      let position = y * Canvas.width + x;
      for (let i = 0; i < 64; ++i) {
        if(i<8 || i%8 !== 0) {
          localSquare.push(values[position]);
          ++position;
        } else {
          position -= 7;
          position += Canvas.width;
          localSquare.push(values[position]);
        }
      }
      squares.push(localSquare);
    }
  }
  return squares;
}

function reconstructPartlyFromSquares(squares) {
  let index = 0;
  const newLine = Math.floor(Canvas.width/8) + 1;
  for (let one of squares) {
    const current = one;
    const X = index < newLine ? index * 8 :(index % newLine) * 8;
    const Y = Math.floor(index/newLine) * 8;
    const hex = current[0].toString(16);
    const color = `#${hex}${hex}${hex}`;
    Output.fillStyle = color;
    Output.fillRect(X,Y,X+4,Y+4);
    ++index;
  }
}

function reconstructFullyFromSquares(squares) {
  let index = 0;
  const newLine = Math.floor(Canvas.width/8) + 1;
  for (let one of squares) {
    const current = one;
    const X = index < newLine ? index * 8 :(index % newLine) * 8;
    const Y = Math.floor(index/newLine) * 8;
    for (let yy = 0; yy < 8; ++yy) {
      for (let xx = 0; xx < 8; ++xx) {
        const hex = current[xx+yy*8].toString(16);
        const color = `#${hex}${hex}${hex}`;
        Output.fillStyle = color;
        Output.fillRect(X+xx,Y+yy,X+xx+1,Y+yy+1);
      }
    }
    ++index;
  }
}

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

function filterHigherFrequencies (data, frequencies) {
  const filtered = [];
  const difference = 64 - frequencies;
  for (let one of data) {
    let index = 0;
    const newOne = [];
    for (let element of one) {
      if (index > difference) {
        newOne.push(0);
      } else {
        newOne.push(element);
      }
      ++index;
    }
    filtered.push(newOne);
  }
  return filtered;
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

window.onload = () => {
  init();
};
