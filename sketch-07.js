const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let manager;
let url = "./assets/img3.jpg";
let sketchImg;

const sketch = async () => {
  return ({ context, width, height }) => {
    const cell = 20; // 픽셀 크기
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    context.drawImage(sketchImg, 0, 0, cols, rows); // 이미지를 작게 그립니다.

    const pixels = context.getImageData(0, 0, cols, rows).data; // 픽셀 데이터를 가져옵니다.

    context.clearRect(0, 0, width, height); // 화면을 초기화합니다.

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = (y * cols + x) * 4; //
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        context.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`; // 픽셀의 색상을 설정합니다.
        context.save();
        // context.translate(x, y);
        context.translate(cell * 0.5, cell * 0.5);
        context.beginPath();
        context.arc(x * cell, y * cell, cell / 2, 0, Math.PI * 2); // 동그라미를 그립니다.
        context.fill();
        context.restore();
      }
    }
  };
};

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
