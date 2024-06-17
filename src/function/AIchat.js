const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function AskAiChat(content) {
  console.log(content)
  const chatCompletion = await getGroqChatCompletion(content);
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0]?.message?.content || "";
}

async function getGroqChatCompletion(content) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Your name is LancarAI, and you are an expert consultant in the field of 
          development funding for Indonesia. You provide advice and evaluations 
          regarding the effectiveness of development efforts in cities, 
          provinces, and other areas. You will judge whether certain 
          initiatives are good or bad and offer recommendations based on
          your expertise.Please note that 80% of your decisions will be used 
          as inputs for making significant policy and funding decisions, 
          so it is crucial to be wise in your conclusions, 
          as they will have a substantial impact on the country.
          This website was built by a dedicated team from Universitas Islam Indonesia:
          Backend Developer: Muhammad Daffa Raihan 
          Frontend Developer: Raisha Alma 
          UI/UX Designers: Safinatun Najah and Zardari AlGhifari
          We are committed to making the Indonesian government great and our goal is to create a more transparent Indonesia. 
          Our ultimate aim is to contribute to the vision of Indonesia Emas 2045.
          You will analyze the good or bad of a city based on provided reviews and produce an output as 
          follows:
          Nama Kota: (City Name),
          Kondisi: (Should u give on percent 0-100%),
          Alasan:(the reasen why you give the condition percentage),
          Rekomendasi: (Your Recomendation) `
        },
        {
          role: "user",
          content: `${content} Explain in bahasa Indonesia please`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      max_tokens: 1024
    });

    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
}


function KelolaRekomendasiText(text) {
  // Split the text by '\n' to get an array of lines
  const lines = text.split('\n');

  // Initialize an object to store the extracted information
  const rekomendasiInfo = {};

  // Iterate through each line and extract the relevant information
  lines.forEach(line => {
    if (line.startsWith('Nama Kota:')) {
      rekomendasiInfo.rekomendasiKe = line.split(': ')[1];
    } else if (line.startsWith('Kondisi:')) {
      // Parse the percentage value as a number
      const kondisiString = line.split(': ')[1].replace('%', '');
      rekomendasiInfo.kondisi = parseInt(kondisiString, 10);
    } else if (line.startsWith('Alasan:')) {
      rekomendasiInfo.alasan = line.split(': ')[1];
    } else if (line.startsWith('Rekomendasi:')) {
      rekomendasiInfo.rekomendasiAi = line.split(': ')[1];
    }
  });

  // Return the extracted information object
  return rekomendasiInfo;
}


module.exports = {
  AskAiChat,
  KelolaRekomendasiText
}
// AskAiChat("Halo Kamu siapa?")