export default async function handler(req, res) {
    // On n'accepte que les requêtes de type POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { infos, services, photos } = req.body;

    // Récupération de ta clé API secrète depuis Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API manquante sur le serveur' });
    }

    // LE FAMEUX CERVEAU 2.0 (Prompt)
    const promptSysteme = `Tu es "Moana Studio", l'expert en copywriting immobilier et marketing digital de l'agence Moana Host en Polynésie française. 
Ton objectif est de transformer les informations d'un logement en une annonce Airbnb/Booking irrésistible ET de générer 3 posts pour les réseaux sociaux. 

NOUVEAUTÉ STRATÉGIQUE : Tu dois impérativement mettre en avant les <SERVICES_ET_ACTIVITES> (transferts, scooters, tours) dans l'annonce et les posts Instagram pour générer des ventes additionnelles. Tu as également accès à la liste des <PHOTOS> du logement pour choisir la meilleure image pour chaque post.

À partir des informations fournies, génère EXACTEMENT cette structure :
**1. TITRES AIRBNB OPTIMISÉS (Propose 3 options)**
**2. DESCRIPTION DE L'ANNONCE (Le Storytelling avec mise en valeur des services)**
**3. PACK RÉSEAUX SOCIAUX (3 Posts Instagram/Facebook en indiquant quelle photo utiliser)**

<INFORMATIONS DU LOGEMENT>
INFOS BRUTES : ${infos}
SERVICES DISPONIBLES : ${services}
PHOTOS DISPONIBLES : ${photos}
</INFORMATIONS DU LOGEMENT>`;

    try {
        // Appel gratuit à l'API Google Gemini 2.5 Flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptSysteme }] }]
            })
        });

        const data = await response.json();
        
        // On extrait le texte de la réponse de Gemini
        const texteGenere = data.candidates[0].content.parts[0].text;
        
        // On renvoie le texte au site web
        return res.status(200).json({ result: texteGenere });

    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la génération avec Gemini' });
    }
}
