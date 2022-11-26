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
    const dctTransformed = dctTransformSimple(squares);
    console.log('<p>filtering last 8 frequencies</p>');
    const filtered = filterHigherFrequencies(dctTransformed, 8);
    console.log('filtered '+JSON.stringify(filtered[0]));
    console.log('<p>undoing discrete cosine transform</p>');
    const dctUndone = dctUntransformSimple(filtered);
    reconstructFullyFromSquares(dctUndone);
    console.log('squares ' + JSON.stringify(squares[0]));
    console.log('dct transformed ' + JSON.stringify(dctTransformed[0]));
    console.log('dct undone ' + JSON.stringify(dctUndone[0]));
  };
}

window.onload= () => {
  init();
}