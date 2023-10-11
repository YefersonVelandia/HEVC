const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

const inputVideoPath = path.join(__dirname, 'videos', 'Metegol.mp4');

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

// Run FFmpeg
ffmpeg()

  // Input file
  .input(inputVideoPath)

  // Optional: Extract the frames at this frame rate
  // .fps(10)

  // Output file format. Frames are stored as frame-001.png, frame-002.png, frame-003.png, etc.
  .saveToFile('frame-%03d.png')

  // Log the percentage of work completed
  .on('progress', (progress) => {
    if (progress.percent) {
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })

  // The callback that is run when FFmpeg is finished
  .on('end', () => {
    console.log('FFmpeg has finished.');
  })

  // The callback that is run when FFmpeg encountered an error
  .on('error', (error) => {
    console.error(error);
  });