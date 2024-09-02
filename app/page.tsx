// respec-app\app\page.tsx

import AudioProcessor from '@/app/components/AudioProcessor';

export default function HomePage() {
    return (
        <main>
            <h1>Audio to Mel Spectrogram</h1>
            <AudioProcessor />
        </main>
    );
}
