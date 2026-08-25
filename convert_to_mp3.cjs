const fs = require('fs');
const lamejs = require('lamejs');

function encodeWavToMp3(wavPath, mp3Path) {
    const wavData = fs.readFileSync(wavPath);
    // basic RIFF WAV parser (assuming 16-bit PCM mono 44100Hz from python script)
    const dataOffset = 44; 
    const buffer = new Int16Array((wavData.length - dataOffset) / 2);
    
    let j = 0;
    for (let i = dataOffset; i < wavData.length; i += 2) {
        buffer[j] = wavData.readInt16LE(i);
        j++;
    }

    const mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); 
    const mp3Data = [];

    const sampleBlockSize = 1152; // multiple of 576
    for (let i = 0; i < buffer.length; i += sampleBlockSize) {
        const sampleChunk = buffer.subarray(i, i + sampleBlockSize);
        var chunkBuf = mp3encoder.encodeBuffer(sampleChunk);
        if (chunkBuf.length > 0) {
            mp3Data.push(Buffer.from(chunkBuf));
        }
    }
    const finalBuf = mp3encoder.flush();
    if (finalBuf.length > 0) {
        mp3Data.push(Buffer.from(finalBuf));
    }

    fs.writeFileSync(mp3Path, Buffer.concat(mp3Data));
    console.log("Saved", mp3Path);
}

encodeWavToMp3('public/notification.wav', 'public/notification.mp3');
encodeWavToMp3('public/notification-review.wav', 'public/notification-review.mp3');
