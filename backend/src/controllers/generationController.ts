import { Request, Response } from 'express';

export const generateAIResponse = (async (req: Request, res: Response): Promise<void> => {
  const { prompt, content } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: `${prompt}\n\n${content}`,
      max_tokens: 100,
      temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    res.json({ result: responseData.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI generation failed.' });
  } 
});
