async function generateHuggingFace(prompt) {
  const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer `,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      options: {
        use_cache: false,
        wait_for_model: true,
      },
    }),
  });

  const type = response.headers.get("content-type");
  const data = await response.arrayBuffer();

  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data;
  return img;
}

async function generateDallE(prompt) {
  const response = await fetch("https://webanx.onrender.com/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  const data = await response.json();

  if (data.success) {
    const img = data.data;
    return img;
  } else {
    throw new Error("Image generation failed");
  }
}

export { generateHuggingFace, generateDallE };
