const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = 8000;

// Configurar middleware para la carga de archivos con Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para la carga de video y codificación
app.post('/codificar', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Por favor, seleccione un archivo de video.');
  }
  console.log(req.file);
  const inputVideoBuffer = path.join(__dirname, 'videos', 'video_codificado_2.mp4');;
  const outputVideoPath = path.join(__dirname, 'videos', 'video_codificado.mp4');

  ffmpeg()
    .input(inputVideoBuffer)
    .videoCodec('libx265')
    .output(outputVideoPath)
    .on('end', () => {
      console.log('Codificación completa.');
      // Después de la codificación exitosa
      fs.renameSync(outputVideoPath, path.join(__dirname, 'almacenamiento', 'video_codificado.mp4'));

      res.sendFile(outputVideoPath); // Envía el video codificado como respuesta
    })
    .on('error', (err) => {
      console.error('Error al codificar el video:', err);
      res.status(500).send('Error al codificar el video');
    })
    .run();

    // Después de la codificación exitosa
fs.renameSync(outputVideoPath, path.join(__dirname, 'almacenamiento', 'video_codificado.mp4'));

});

app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});
