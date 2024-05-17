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
      fieldToBeRegenerated,
      previousResponse,
    } = req.body;
    // prompt to generate a Lean Canvas
    /*
    const prompt = `
Generate a Lean Canvas for a company based on the provided information:

Company Description:
"${companyDescription}"

Please create a Lean Canvas for the company. Include the following sections:

- Problem: Describe the main problems your target customers are facing.
- Solution: Outline your proposed solution to address these problems.
- Key Metrics: Identify the key metrics that you will use to measure the success of your business.
- Unique Value Proposition: Explain what sets your product/service apart from competitors.
- Unfair Advantage: Highlight any advantages or assets that give your company an edge.
- Channels: List the channels you will use to reach your target customers.
- Customer Segments: Define your target customer segments.
- Cost Structure: Break down the costs associated with running your business.
- Revenue Streams: Explain how your company will generate revenue.

Please ensure that each section is clear and concise, with a minimum of ${minChars} characters and a maximum of ${maxChars} characters.

Response Format:
The response should be in JSON format, with each section represented as a string. Ensure that each section contains at least three bullet points(you can add more if needed), structured appropriately.

Example:
{
  "problem": "- High customer acquisition costs\\n- Low customer retention rates\\n- Difficulty reaching target market",
  "solution": "- Develop a referral program\\n- Implement targeted advertising campaigns\\n- Improve product onboarding process",
  "key_metrics": "- Customer acquisition costs\\n- Customer retention rates\\n- Monthly active users",
  "unique_value_proposition": "- Personalized customer experience\\n- Innovative product features\\n- Competitive pricing",
  "unfair_advantage": "- Proprietary technology\\n- Strong brand reputation\\n- Exclusive partnerships",
  "channels": "- Social media advertising\\n- Email marketing campaigns\\n- Content marketing strategies",
  "customer_segments": "- Millennials aged 18-34\\n- Small business owners\\n- Tech-savvy consumers",
  "cost_structure": "- Marketing expenses\\n- Salaries and benefits\\n- Technology infrastructure",
  "revenue_streams": "- Subscription fees\\n- Product sales\\n- Licensing agreements"

}
`;
 */

    // prompt to generate a Lean Canvas
    const prompt = `
Regenerate the ${fieldToBeRegenerated} field for the following Lean Canvas:\n\n"${previousResponse}"\n\n
    
Please ensure that the response is clear and concise, with a minimum of ${minChars} characters and a maximum of ${maxChars} characters.

Response Format:
The response should be in JSON format, with each section represented as a string. Ensure that each section contains at least three bullet points(you can add more if needed), structured appropriately.

Example:
{
  "problem": "- High customer acquisition costs\\n- Low customer retention rates\\n- Difficulty reaching target market",
  "solution": "- Develop a referral program\\n- Implement targeted advertising campaigns\\n- Improve product onboarding process",
  "key_metrics": "- Customer acquisition costs\\n- Customer retention rates\\n- Monthly active users",
  "unique_value_proposition": "- Personalized customer experience\\n- Innovative product features\\n- Competitive pricing",
  "unfair_advantage": "- Proprietary technology\\n- Strong brand reputation\\n- Exclusive partnerships",
  "channels": "- Social media advertising\\n- Email marketing campaigns\\n- Content marketing strategies",
  "customer_segments": "- Millennials aged 18-34\\n- Small business owners\\n- Tech-savvy consumers",
  "cost_structure": "- Marketing expenses\\n- Salaries and benefits\\n- Technology infrastructure",
  "revenue_streams": "- Subscription fees\\n- Product sales\\n- Licensing agreements"

}
`;

    // Make request to OpenAI API
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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
    });
    const data = await resp.json();
    console.log(data);
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
