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
