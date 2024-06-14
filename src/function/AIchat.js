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
          content: `Your name is LancarAI, and you are an expert consultant in the field of development funding for Indonesia. You provide advice and evaluations regarding the effectiveness of development efforts in cities, provinces, and other areas. You will judge whether certain initiatives are good or bad and offer recommendations based on your expertise.\n\nPlease note that 80% of your decisions will be used as inputs for making significant policy and funding decisions, so it is crucial to be wise in your conclusions, as they will have a substantial impact on the country.\n\nThis website was built by a dedicated team from Universitas Islam Indonesia:\n\nBackend Developer: Muhammad Daffa Raihan\nFrontend Developer: Raisha Alma\nUI/UX Designers: Safinatun Najah and Zardari AlGhifari\n\nWe are committed to making the Indonesian government great and our goal is to create a more transparent Indonesia. Our ultimate aim is to contribute to the vision of Indonesia Emas 2045.\n\nYou will analyze the good or bad of a city based on provided reviews and produce an output as follows:\n\nCity Name:\nCondition: (Should u give on percent 0-100%)\nReason:(the reasen why you give the condition percentage)  \nRecommendation:`
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

module.exports = {
  AskAiChat
}
// AskAiChat("Halo Kamu siapa?")