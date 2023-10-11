const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputVideoPath = path.join(__dirname, 'videos', 'video_original_2.mp4');
const outputVideoPath = path.join(__dirname, 'videos', 'video_codificado_128kbps.mp4');

ffmpeg()
  .input(inputVideoPath)
  .videoCodec('libx265') // Codificar en HEVC, parametro para seleccionar codec 
  .audioCodec('aac') // Establecer el códec de audio a AAC
  .audioBitrate(128) // Establecer la tasa de bits de audio en 128 kbps
  .audioFrequency(44100) // Establecer la frecuencia de muestreo de audio a 44.1 kHz
  .audioChannels(2) // Establecer el número de canales de audio a 2 (estéreo)
  .size('1280x720') // Establecer la resolución del video a 1280x720
  .videoBitrate(1000) // Establecer la tasa de bits del video en 1000 kbps
  .fps(120) // Establecer la velocidad de cuadros a 120 FPS
  .on('progress', (progress) => {
    if (progress.percent) {
      console.log(progress);
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })
  .on('end', () => {
    console.log('Codificación completa.');
  })
  .on('error', (err) => {
    console.error('Error al codificar el video:', err);
  })
  .output(outputVideoPath)
  .run();
