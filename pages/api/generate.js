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

//Methods
//Describe the person (attempting now)
//Describe 3 other gifts you have got the person

//Test prompt: a 42 year old lesbian who likes jigsaws, chickens and helping refugees

function generatePrompt(animal) {
  // const capitalizedAnimal =
  //   animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three gifts for a loved one.

Recipient: A 65 year old woman who likes animals, fashion and astronomy.
Gifts: A popular book about space, a cross stitch kit of a robin, a fluffy pink scarf
Recipient: A 42 year old man who likes gaming, whiskey and sci fi
Gifts: A Steam gift card, a tibetan whiskey, a sci fi comic book
Recipient: ${animal}
Gifts:`;
}
