import { Request, Response } from 'express';
import { HfInference } from "@huggingface/inference";

export const generateAIResponse = (async (req: Request, res: Response): Promise<void> => {
  const { prompt, imageModel, imageUrl } = req.body;

  const openAIKey = req.headers['authorization'];
  if (!openAIKey) {
    res.status(400).json({ error: 'Missing OpenAI API key in headers.' });
    return;
  }

  const model: string = 'meta-llama/Llama-3.2-11B-Vision-Instruct';
  const contents = [
    {
      assistant: 'You are an expert at interpreting UML diagrams and generating code in any language. Provide only the code without any additional text.',
      user: [
        {
          type: "text",
          text: prompt
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl
          }
        }
      ]
    },
    {
      assistant: 'You are an expert at interpreting code in any language and converting it to a JSON of the form of { "name": "Person", "attributes": [ "- phoneNumber: int", "+ emailAddress: str", "* name: str", "# address: str" ], "methods": [ "+ getPhoneNumber()" ], "associations": [ "reason": "0..1 lives at", "to": "Address" ] }. Provide only the JSON without any additional text.',
      user: [
        {
          type: "text",
          text: prompt
        }
      ]
    }
  ]

  try {
    const inference = new HfInference(openAIKey as string);
    const aiResponse = await inference.chatCompletion({
      model: model,
      messages: [
        { role: 'assistant', content: imageModel === 'true' ? contents[0].assistant : contents[1].assistant },
        {
          role: 'user',
          content: imageModel === 'true' ? contents[0].user : contents[1].user
        }
      ],
      max_tokens: 1000
    });

    res.json({ result: aiResponse.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI generation failed.' });
  }
});
