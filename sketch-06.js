const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  // animation: true,
};

let manager;

let text = "A";
let fontSize = 1200;
let fontFamily = "serif";
let url = "./assets/img3.jpg";
let sketchImg;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 1;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    // fontSize = cols * 1.2;

    // typeContext.fillStyle = "white";
    // typeContext.font = `${fontSize}px ${fontFamily}`;
    // typeContext.textBaseline = "top";
    typeContext.drawImage(sketchImg, 0, 0, cols, rows);

    // const metrics = typeContext.measureText(text);
    // console.log(metrics);
    // const mx = metrics.actualBoundingBoxLeft * -1;
    // const my = metrics.actualBoundingBoxAscent * -1;
    // const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    // const mh =
    //   metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // const tx = (cols - mw) * 0.5 - mx;
    // const ty = (rows - mh) * 0.5 - my;

    // typeContext.save();
    // typeContext.translate(tx, ty);

    // typeContext.beginPath();
    // typeContext.rect(mx, my, mw, mh);
    // typeContext.stroke();

    // typeContext.fillText(text, 0, 0);
    // typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    // context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      // const glyph = getGlyph(r);
      const glyph = getGlyph(r, g, b, a);

      context.font = `${cell}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 2}px ${fontFamily}`;

      context.fillStyle = `rgb(${r},${g},${b},${a})`;
      // context.fillStyle = `white`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      // context.fillRect(0, 0, cell, cell);

      // context.beginPath();
      // context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      // context.fill();

      context.fillText(glyph, 0, 0);
      context.restore();
    }
  };
};

const getGlyph = (r, g, b, a) => {
  const brightness = (r + g + b) / 3;
  if (brightness < 50) return "";
  if (brightness < 100) return ".";
  if (brightness < 150) return "-";
  if (brightness < 200) return "*";

  const glyphs = "_ =/".split("");

  return random.pick(glyphs);
};

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  sketchImg = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
