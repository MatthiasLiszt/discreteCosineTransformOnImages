//constants
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
