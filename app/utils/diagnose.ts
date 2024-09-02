export async function uploadAudioAndPredict(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}