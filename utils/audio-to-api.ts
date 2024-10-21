// respec-app\utils\audio-to-api.ts

export const sendAudioToAPI = async (file: File, endpoint: string): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`Failed to upload audio to ${endpoint}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Error uploading audio to ${endpoint}`);
  }
};