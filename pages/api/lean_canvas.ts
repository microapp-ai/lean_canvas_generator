import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
    res.status(200).end(); // Preflight request
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const {
      companyDescription,
      minChars,
      maxChars,
    } = req.body;
  const prompt = `Generate a Lean Canvas for a company with the following description:\n\n"${companyDescription}"\n\nResponse should be in form of json string with the following fields with max ${maxChars} characters and min ${minChars} characters each
    :\n\n- problem\n- solution\n- key_metrics\n- unique_value_proposition\n- unfair_advantage\n- channels\n- customer_segments\n- cost_structure\n- revenue_streams\n\n`;

    // Make request to OpenAI API
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 3000,
        temperature: 1,
        stop: '',
      }),
    })
    const data = await resp.json();
    const output = JSON.parse(data.choices[0].message.content);
    console.log(output);
    res.status(200).json(output);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Something went wrong.',
    });
  }
}
