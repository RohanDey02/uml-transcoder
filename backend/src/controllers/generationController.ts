import { Request, Response } from 'express';
import { HfInference } from "@huggingface/inference";

enum GenerationType {
  UML_TO_CODE,
  UML_TO_JSON,
  CODE_TO_JSON
};

export const generateAIResponse = (async (req: Request, res: Response): Promise<void> => {
  const { prompt, artifactSrc, purpose } = req.body;

  const huggingFaceKey = req.headers['authorization'];
  if (!huggingFaceKey) {
    res.status(400).json({ error: 'Missing HuggingFace API key in headers.' });
  }

  if (!prompt || !purpose) {
    res.status(400).json({ error: 'Missing required fields.' });
  }

  const model: string = 'meta-llama/Llama-3.2-11B-Vision-Instruct';
  const supportedAssociationTypes: string = 'Aggregation, Association, Composition, Dependency, Generalization/Inheritance, Realization/Implementation';
  const supportedCardinalities: string = '"0..1", "0..*", "1..1", "1..*", "*..*", "1..0", "*..0"';

  /*
   * Supported Cases:
    * 1. UML Diagram -> Code
    * 2. UML Diagram -> JSON for frontend
    * 3. Code -> JSON for frontend
   */
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
            url: artifactSrc
          }
        }
      ]
    },
    {
      assistant: `You are an expert at interpreting UML diagrams and converting it to an array of JSON objects of the form { "name": "Person", "attributes": [ "- phoneNumber: int", "+ emailAddress: str", "* name: str", "# address: str" ], "methods": [ "+ getPhoneNumber()" ], "associations": [ { "type": "Association", "cardinality": "0..1", "reason": "lives at", "to": "Address" } ] }. Supported association types are: ${supportedAssociationTypes}. Supported cardinalities are: ${supportedCardinalities}. Provide only the JSON without any additional text. Make sure all of the objects in the array are well-defined and well-formatted (i.e. closed parentheses and comma-separated).`,
      user: [
        {
          type: "text",
          text: prompt
        },
        {
          type: "image_url",
          image_url: {
            url: artifactSrc
          }
        }
      ]
    },
    {
      assistant: `You are an expert at interpreting code in any language and converting it to an array of JSON objects of the form { "name": "Person", "attributes": [ "- phoneNumber: int", "+ emailAddress: str", "* name: str", "# address: str" ], "methods": [ "+ getPhoneNumber()" ], "associations": [ { "type": "Association", "cardinality": "0..1", "reason": "lives at", "to": "Address" } ] }. Supported association types are: ${supportedAssociationTypes}. Supported cardinalities are: ${supportedCardinalities}. Provide only the JSON without any additional text. Make sure all of the objects in the array are well-defined and well-formatted (i.e. closed parentheses and comma-separated).`,
      user: [
        {
          type: "text",
          text: prompt
        }
      ]
    }
  ]

  try {
    const inference = new HfInference(huggingFaceKey as string);
    const aiResponse = await inference.chatCompletion({
      model: model,
      messages: [
        { role: 'assistant', content: contents[GenerationType[purpose as keyof typeof GenerationType]].assistant },
        {
          role: 'user',
          content: contents[GenerationType[purpose as keyof typeof GenerationType]].user
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
