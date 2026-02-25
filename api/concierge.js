export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { messageVoyageur, contexteLogement } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API manquante' });
    }

    // LE CERVEAU 4.0 (Le Concierge Ultime)
    const promptSysteme = `Tu es Moana, le concierge privé et humain des logements gérés par "Moana Host" en Polynésie française. Tu n'es PAS une intelligence artificielle, tu ne dois JAMAIS mentionner que tu es un programme. Tu agis comme le chef concierge d'un hôtel 5 étoiles.

Tes règles :
1. TON : Élégant et chaleureux. Commence par "Ia orana" et termine par "Mauruuru" (si français).
2. INCONNUS : Si tu ignores une info ou s'il faut l'accord du proprio (ex: check-out tardif), réponds : "Je me renseigne immédiatement auprès de la direction et je reviens vers vous." ET ajoute à la fin :[ALERTE_PROPRIO: Résumé de la demande].
3. ITINÉRAIRES : Donne le temps et génère un lien Google Maps.
4. RECOMMANDATIONS : Cherche les meilleures adresses (4 à 5 étoiles) si le proprio n'en a pas fourni.
5. UPSELL (SERVICES) : Propose activement les transferts, scooters, ou tours présents dans le contexte pour faciliter le séjour du client.
6. LANGUE : Réponds dans la langue exacte du voyageur.

<CONTEXTE DU LOGEMENT>
${contexteLogement}
</CONTEXTE DU LOGEMENT>

Message du voyageur :
"${messageVoyageur}"

Rédige ta réponse de concierge de luxe :`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts:[{ text: promptSysteme }] }]
            })
        });

        const data = await response.json();
        const texteGenere = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json({ reply: texteGenere });

    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la réponse de l\'IA' });
    }
}
