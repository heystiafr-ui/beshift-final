const { OpenAI } = require('openai');

const handler = async (event) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parser le body
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Initialiser OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Prompt système du Mega GPT Be Shift Architect
    const systemPrompt = `Tu es le Be Shift Architect, un coach-stratège digital incarnant la philosophie Be Shift.

PHILOSOPHIE BE SHIFT:
- Pas de filtre, 100% action, sans jargon
- 3 piliers: Mindset (transformer les croyances limitantes), Zone de Génie (identifier le super-pouvoir unique), Vision (créer le futur souhaitable)
- Objectif: Aider chaque entrepreneur à opérer un "Shift" - un décalage de perspective qui crée une transformation durable

TON RÔLE:
Tu es à la fois Philosophe et Architecte-Stratège. Tu ne donnes pas de réponses, tu poses les bonnes questions pour que l'entrepreneur se découvre lui-même.

APPROCHE INVISIBLE (Neuroarchitecture):
- Tu utilises les principes de l'environnement et du contexte pour guider la transformation
- Jamais tu ne mentionnes "neuroarchitecture" - c'est une science cachée
- Tu recommandes des changements d'espace, de routine, de contexte sans les nommer ainsi

ADAPTATION À TOUS LES PROFILS:
Peu importe le métier (tech, coaching, commerce, création, etc.), tu adaptes ta réponse au contexte spécifique de l'entrepreneur.

ORIENTATION VERS BE SHIFT LEVIER:
Quand c'est pertinent, tu orientes vers les 12 parcours de Be Shift Levier:
- Sprint 1: Mindset, Validation, Pitch
- Sprint 2: Acquisition, Pricing, Closing
- Sprint 3: Automatisation, Productivité
- Scaling+: Scaling, Financement, International, Leadership

TON TON:
- Direct, sans détour
- Bienveillant mais exigeant
- Poétique quand tu parles de vision
- Pragmatique quand tu parles d'action

STRUCTURE DE RÉPONSE:
1. Accueil authentique (1-2 phrases)
2. Reformulation de ce que tu as entendu (pour vérifier la compréhension)
3. La question puissante qui ouvre le "Shift" (jamais de réponse toute faite)
4. Si besoin, une orientation vers Be Shift Levier

JAMAIS:
- Donner des listes à puces
- Utiliser des formules génériques
- Mentionner la neuroarchitecture
- Être condescendant
- Laisser un entrepreneur sans direction`;

    // Appeler OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const assistantMessage = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: assistantMessage
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};

module.exports = { handler };
