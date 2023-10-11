const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const Jimp = require('jimp');
const Vibrant = require('node-vibrant');

const videoFilePath = './videos/video_corto.mp4';
const outputFolderPath = 'out/';

// Capturar cuadros del video
ffmpeg()
  .input(videoFilePath)
  .output(`${outputFolderPath}%04d.png`)
  .outputOptions(['-strict', '-2'])
  .on('stderr', function (stderrLine) {
    // Manejar errores de FFmpeg si es necesario
  })
  .on('error', function (err) {
    // Manejar errores de procesamiento de video si es necesario
  })
  .on('end', () => {
    console.log('Cuadros capturados.');
    processFrames();
  })
  .run();

// Procesar cuadros capturados
async function processFrames() {
  const colorCounts = {}; //registro de cuántas veces aparece cada color.

  for (let frameNumber = 1; ; frameNumber++) {
    const frameFilePath = `${outputFolderPath}${frameNumber.toString().padStart(4, '0')}.png`;
    try {
      const image = await Jimp.read(frameFilePath);
      // Procesa la imagen y encuentra los colores predominantes
      const predominantColors = await findPredominantColors(image);

      // Registra los colores predominantes en el contador
      predominantColors.forEach((color) => {
        console.log("COLOR:", color);
        if (!colorCounts[color]) {
          colorCounts[color] = 0;
        }
        colorCounts[color]++;
      });
    } catch (error) {
      // Fin del procesamiento cuando no hay más cuadros
      break;
    }
  }
  // Calcula la probabilidad de cada color
  const totalFrames = Object.values(colorCounts).reduce((total, count) => total + count, 0);
  console.log("TOTAL DE FRAMES:", Object.values(colorCounts).reduce((total, count) => total + count, 0));
  const colorProbabilities = {};
  for (const color in colorCounts) {
    colorProbabilities[color] = colorCounts[color] / totalFrames;
    console.log("PROBABILIDAD: ", colorProbabilities[color]);
  }
  // Calcula la entropía de la fuente
  let entropy = 0;
  for (const color in colorProbabilities) {
    const probability = colorProbabilities[color];
    entropy += probability * Math.log2(1 / probability);
  }
  // Guarda los resultados en un archivo de texto
  const results = {
    colorProbabilities,
    entropy,
  };
  fs.writeFileSync('resultados.txt', JSON.stringify(results, null, 2), 'utf-8');
  console.log('Colores y sus probabilidades:');
  console.log(colorProbabilities);
  console.log('Entropía de la fuente:', entropy);
}
// Función para encontrar colores predominantes en una imagen (usando node-vibrant)
async function findPredominantColors(image) {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
      Vibrant.from(buffer)
        .getPalette()
        .then((palette) => {
          // Obtener los colores en formato hexadecimal
          const predominantColorsHex = Object.keys(palette)
            .filter((key) => palette[key])
            .map((key) => palette[key].hex || 'N/A');

          resolve(predominantColorsHex);
        });
    } catch (error) {
      reject(error);
    }
  });
}