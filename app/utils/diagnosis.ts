// utils/predictor.ts
import * as tf from '@tensorflow/tfjs';

export async function loadAndPreprocessAudio(filePath: string): Promise<tf.Tensor> {
    const SAMPLE_RATE = 22050;
    const DURATION = 5;
    const IMG_SIZE = 224;

    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);

    let audio = audioData;
    if (audio.length > SAMPLE_RATE * DURATION) {
        audio = audio.slice(0, SAMPLE_RATE * DURATION);
    } else {
        const padWidth = SAMPLE_RATE * DURATION - audio.length;
        audio = Float32Array.from([...audio, ...new Array(padWidth).fill(0)]);
    }

    const spectrogram = await generateMelSpectrogram(audio, SAMPLE_RATE);

    let tensor = tf.tensor(spectrogram).expandDims(-1);
    tensor = tensor.expandDims(0);

    const spectrogramResized = tf.image.resizeBilinear(tensor, [IMG_SIZE, IMG_SIZE]);
    const spectrogramRgb = tf.image.grayscaleToRGB(spectrogramResized);

    return spectrogramRgb.squeeze([0]);
}

async function generateMelSpectrogram(audio: Float32Array, sampleRate: number): Promise<number[][]> {
    // Placeholder implementation
    return [[]];
}

export async function predictDiagnosis(modelPath: string, filePath: string) {
    const model = await tf.loadLayersModel(modelPath);
    const inputData = await loadAndPreprocessAudio(filePath);
    const batchedInput = inputData.expandDims(0);

    const predictions = model.predict(batchedInput) as tf.Tensor;
    const predictedProbabilities = await predictions.array() as number[];

    const intToDiagnosis: { [key: number]: string } = {
        0: 'URTI',
        1: 'Healthy',
        2: 'Asthma',
        3: 'COPD',
        4: 'LRTI',
        5: 'Bronchiectasis',
        6: 'Pneumonia',
        7: 'Bronchiolitis'
    };

    console.log("**Probability Distribution**:");
    Object.keys(intToDiagnosis).forEach((key) => {
        const idx = parseInt(key);
        const diagnosis = intToDiagnosis[idx];
        console.log(`- ${diagnosis}: ${(predictedProbabilities[idx] * 100).toFixed(2)}%`);
    });
}
