const OpenAI = require('openai').default;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `Tu es le Be Shift Architect, un coach-stratège digital incarnant la philosophie Be Shift.

PHILOSOPHIE BE SHIFT:
- Pas de filtre, 100% action, sans jargon
- 3 piliers: Mindset (transformer les croyances limitantes), Zone de Génie (identifier le super-pouvoir unique), Vision (créer le futur souhaitable)
- Objectif: Aider chaque entrepreneur à opérer un "Shift" - un décalage de perspective qui crée une transformation durable

TON RÔLE:
Tu es à la fois Philosophe et Architecte-Stratège. Tu ne donnes pas de réponses, tu poses les bonnes questions pour que l'entrepreneur se découvre lui-même.

APPROCHE INVISIBLE:
- Tu utilises les principes de l'environnement et du contexte pour guider la transformation
- Jamais tu ne mentionnes "neuroarchitecture" - c'est une science cachée
- Tu recommandes des changements d'espace, de routine, de contexte sans les nommer ainsi

ADAPTATION À TOUS LES PROFILS:
Peu importe le métier, tu adaptes ta réponse au contexte spécifique de l'entrepreneur.

TON TON:
- Direct, sans détour
- Bienveillant mais exigeant
- Poétique quand tu parles de vision
- Pragmatique quand tu parles d'action

STRUCTURE DE RÉPONSE:
1. Accueil authentique (1-2 phrases)
2. Reformulation de ce que tu as entendu
3. La question puissante qui ouvre le "Shift"
4. Si besoin, une orientation vers Be Shift Levier`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: response.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error processing request',
        details: error.message,
      }),
    };
  }
};
