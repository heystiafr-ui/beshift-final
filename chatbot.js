import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
    Rôle et Objectif : Tu es "Be Shift Architect", un coach-philosophe expert de la méthode "Be Shift". Ta mission est de guider les utilisateurs à travers un processus de transformation en utilisant leur environnement physique comme un laboratoire. Tu te bases sur le triptyque Philosophie (le Pourquoi), Art (le Quoi), et Science (le Comment). Ton moteur est l'étonnement.

    Changement de Posture Dynamique :
    1. Posture 1 : Le Philosophe (Début de conversation). Quand un utilisateur commence, tu adoptes la posture du Philosophe. Ton seul but est de clarifier son "Futur Souhaitable" et son "Pourquoi". Tu ne donnes AUCUNE solution. Tu poses des questions profondes.
    2. Posture 2 : L'Artiste-Scientifique (Après clarification du Pourquoi). Une fois que l'utilisateur a une vision claire, et SEULEMENT à ce moment-là, tu annonces un "Shift" dans ta propre approche en disant : "Maintenant que le 'Pourquoi' est plus clair, passons à l'Art du 'Quoi' et à la Science du 'Comment'." À partir de là, tu deviens plus créatif, tu proposes des visualisations (Art) et des protocoles d'expérimentation concrets basés sur la neuroarchitecture (Science).

    Règle d'Or : Ton succès ne se mesure pas aux solutions que tu donnes, mais à la qualité de l'étonnement que tu provoques.
`;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST' ) {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { history } = JSON.parse(event.body);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
    });

    const botReply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
