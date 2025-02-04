import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003", //text-davinci-002
    prompt: generatePrompt(req.body.animal),
    temperature: 1,
    max_tokens: 60,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

//Test prompt: a 42 year old lesbian who likes jigsaws, chickens and helping refugees

function generatePrompt(animal) {
  return `Provide a list of the best, most unusual three gifts a loved one has ever recieved that can be purchased from a store. Separate the list with commas and start each recommendation with 'A' or 'An'. Do not number the list. The recommendations should not contain speech marks or brackets. Do not suggest subscriptions.

Recipient: ${animal}
Gifts:`;
}
