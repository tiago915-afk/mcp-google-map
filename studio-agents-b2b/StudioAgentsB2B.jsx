import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Layers, MessageSquare, Globe, TrendingUp } from 'lucide-react';

// Base de données complète de veille concurrentielle (10+ marques)
const competitorIntel = {
  loreal: {
    name: "L'Oréal Professionnel",
    focus: "Pression sur les volumes, plateformes digitales froides, présence e-commerce massive.",
    angle: "Opposer la relation humaine de proximité, l'accompagnement physique et la protection du prix salon face à la concurrence web."
  },
  wella: {
    name: "Wella Professionals",
    focus: "Largeur de gamme technique importante, investissement lourd en stock couleur.",
    angle: "Mettre en avant la simplicité d'un cadencier compact, sans immobiliser la trésorerie du salon."
  },
  schwarzkopf: {
    name: "Schwarzkopf Professional",
    focus: "Forte culture technique, communication orientée transformation et tendances pures.",
    angle: "Insister sur l'accompagnement business global et la marge réelle au bac, au-delà de la technique pure."
  },
  eugene_perma: {
    name: "Eugène Perma Professionnel",
    focus: "Positionnement historique Made in France, parfois perçu comme classique.",
    angle: "Dynamiser l'image avec un discours moderne de coach en rentabilité et de proximité terrain en Île-de-France."
  },
  subtil: {
    name: "Subtil (Drakkar)",
    focus: "Distribution généraliste, forte présence chez les grossistes et cash & carry.",
    angle: "Valoriser l'exclusivité de l'accompagnement technico-commercial direct, sans passer par un intermédiaire impersonnel."
  },
  redken: {
    name: "Redken",
    focus: "Image urbaine branchée, focus prononcé sur les services dits 'high-end' et acides.",
    angle: "Démontrer qu'une marque française exigeante offre la même performance technique avec un vrai suivi de proximité."
  },
  matrix: {
    name: "Matrix",
    focus: "Entrée/milieu de gamme pro, volumes accessibles mais suivi commercial distant.",
    angle: "Montrer que la rentabilité d'un salon ne se fait pas sur du volume brut, mais sur le conseil et la marge sur chaque service."
  },
  revlon: {
    name: "Revlon Professional",
    focus: "Offre globale salon et revente (Eksperience, Nutri Color), ciblage large.",
    angle: "Mettre en avant la réactivité locale d'un technico-commercial dédié qui connaît chaque salon de son secteur par cœur."
  },
  davines: {
    name: "Davines",
    focus: "Positionnement éco-responsable haut de gamme, esthétique épurée.",
    angle: "Allier engagement éthique (Made in France ISO 9001 Fauvert) et pragmatisme économique direct pour le gérant."
  },
  indola: {
    name: "Indola",
    focus: "Simplicité, prix serrés, positionnement orienté petit budget salon.",
    angle: "Défendre la valeur de la haute technicité française abordable et l'accompagnement sur-mesure de la revente au bac."
  }
};

// Palette appliquée à toute la page (pas seulement aux slides)
const themes = {
  dark: {
    page: 'bg-slate-950 text-slate-100',
    panel: 'bg-slate-900 border-slate-800',
    field: 'bg-slate-950 border-slate-800 text-slate-100',
    title: 'text-white',
    muted: 'text-slate-400',
    label: 'text-slate-300',
    strong: 'text-slate-200',
    border: 'border-slate-800',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    tabIdle: 'text-slate-400 hover:bg-slate-900',
    slide: 'bg-slate-950 text-white border-slate-800'
  },
  cream: {
    page: 'bg-amber-50 text-stone-800',
    panel: 'bg-white border-amber-200',
    field: 'bg-amber-50/60 border-amber-200 text-stone-900',
    title: 'text-stone-900',
    muted: 'text-stone-500',
    label: 'text-stone-600',
    strong: 'text-stone-800',
    border: 'border-amber-200',
    ghost: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
    tabIdle: 'text-stone-500 hover:bg-amber-100',
    slide: 'bg-amber-50 text-amber-950 border-amber-200'
  },
  emerald: {
    page: 'bg-emerald-950 text-emerald-50',
    panel: 'bg-emerald-900/60 border-emerald-800',
    field: 'bg-emerald-950 border-emerald-800 text-emerald-50',
    title: 'text-white',
    muted: 'text-emerald-200/70',
    label: 'text-emerald-100',
    strong: 'text-emerald-50',
    border: 'border-emerald-800',
    ghost: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-50',
    tabIdle: 'text-emerald-200/70 hover:bg-emerald-900',
    slide: 'bg-emerald-950 text-emerald-100 border-emerald-800'
  }
};

export default function StudioAgentsB2B() {
  const [activeTab, setActiveTab] = useState('linkedin');
  const [copied, setCopied] = useState(null); // 'linkedin' | 'caption' | 'error' | null
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'cream' | 'emerald'
  const t = themes[theme];

  // Paramètres de tournée et veille concurrentielle élargie
  const [salonContext, setSalonContext] = useState('Salon indépendant, Île-de-France, 3 bacs');
  const [selectedCompetitor, setSelectedCompetitor] = useState('loreal');
  const [topic, setTopic] = useState('Trésorerie bloquée dans le labo et stock mort');

  const [generatedOutput, setGeneratedOutput] = useState({
    linkedin: `Hier après-midi, en tournée en Île-de-France, je pousse la porte d'un salon indépendant.\n\nLa gérante m'accueille avec le sourire, mais quand on passe dans le labo, le constat est le même : près de 3 500 € de tubes de coloration qui dorment sur les étagères à cause des remises au volume poussées par les grands groupes.\n\nSur le papier, la réduction fait plaisir. Dans la réalité, la trésorerie est piégée dans des nuances qui sortent deux fois par an, pendant que les charges fixes tombent chaque mois.\n\nMon rôle de technico-commercial chez Fauvert Professionnel, ce n'est pas de remplir vos placards pour faire mon chiffre et disparaître. Si le produit ne sort pas du salon, personne ne gagne.\n\nAvec mes salons partenaires, on fonctionne différemment :\n1. On fait le tri net dans le stock mort.\n2. On mise sur des gammes françaises agiles, à vraie marge nette (Colorea, Vitacolor).\n3. Je passe régulièrement ajuster les cadenciers selon votre réalité terrain.\n\nUn partenaire doit alléger votre gestion, pas l'alourdir.\n\nÀ quand remonte le dernier vrai tri rentable de votre labo ?`,
    igCaption: `1 500 € qui dorment sur tes étagères ? 📉\n\nEntre les commandes minimales imposées et les stocks de nuances qui ne tournent pas, la trésorerie du salon prend cher.\n\nSwipe vers la droite pour découvrir les 3 erreurs de stock à corriger d'urgence ➔\n\nTu gères un salon en Île-de-France ? Envoie-moi « DIAGNOSTIC » en DM pour qu'on optimise ton linéaire ensemble. 💬\n\n#coiffure #fauvertprofessionnel #technicocommercial #salondecoiffure #rentabilite`,
    igSlides: [
      { title: "1 500 € qui dorment sur tes étagères ?", body: "Les erreurs de stock et de volume qui plombent la rentabilité de ton salon." },
      { title: "1. Le piège des remises au volume", body: "Acheter trop pour une fausse promo, c'est bloquer de la trésorerie sur des nuances mortes." },
      { title: "2. La saturation du labo", body: "Trop de références différentes embrouillent l'équipe et ralentissent la rotation." },
      { title: "3. Le choix du vrai partenariat", body: "Un fournisseur de proximité t'aide à purger et réajuster, sans te forcer la main." },
      { title: "Faisons le point sur ton salon", body: "Écris-moi en DM pour un audit gratuit de ton linéaire en Île-de-France 🤝" }
    ]
  });

  const comp = competitorIntel[selectedCompetitor];

  // Génère le contenu de l'onglet actif à partir du contexte, du sujet ET de la marque ciblée
  const handleGenerate = () => {
    const type = activeTab;
    setLoading(true);

    setTimeout(() => {
      const ctx = salonContext.trim() || 'un salon indépendant';
      const sujet = topic.trim() || 'La rentabilité du salon';

      if (type === 'linkedin') {
        setGeneratedOutput(prev => ({
          ...prev,
          linkedin: `En tournée cette semaine (${ctx}), j'ai eu une discussion franche avec un gérant qui s'arrachait les cheveux avec ${comp.name}.\n\nLe sujet sur la table : ${sujet.toLowerCase()}.\n\nLeur politique actuelle (${comp.focus.toLowerCase()}) laisse souvent les indépendants seuls face à ce problème.\n\nCe que je vois trop souvent sur le terrain : des équipes techniques formées aux grands lancements, mais des gérants qui finissent le mois avec de la trésorerie immobile sur leurs étagères.\n\nNotre métier chez Fauvert Professionnel face à cela est simple : ${comp.angle}\n\n1. On rationalise le labo pour ne garder que ce qui tourne.\n2. On valorise chaque service au bac pour booster la marge nette sans forcer.\n3. Je passe régulièrement voir si les chiffres suivent dans votre salon.\n\nUn fournisseur ne doit pas être un simple livreur de cartons.\n\nEt chez vous, comment ça se passe sur ce point en ce moment ?`
        }));
      } else {
        setGeneratedOutput(prev => ({
          ...prev,
          igCaption: `${sujet} : pourquoi changer ses habitudes face aux géants comme ${comp.name} ? ⚠️\n\nVu en tournée (${ctx}) : entre ${comp.focus.toLowerCase()} et le manque de suivi local, nombre de salons s'essoufflent.\n\nSwipe pour voir comment reprendre le contrôle de ta rentabilité ➔\n\n#fauvertprofessionnel #coiffeur #salondecoiffure #technicocommercial #paris`,
          igSlides: [
            { title: sujet, body: `Le constat terrain face aux pratiques de ${comp.name}.` },
            { title: "1. Reprendre la main sur le stock", body: "Fini les placards pleins de nuances mortes. On rationalise avec un cadencier malin." },
            { title: "2. Valoriser la marge au bac", body: "Le vrai gain ne vient pas du volume acheté en gros, mais de la revente conseillée." },
            { title: "3. Le choix du vrai partenaire", body: "Un technico-commercial dédié qui connaît ton salon et t'accompagne chaque mois." },
            { title: "On en discute dans ton salon ?", body: "Envoie « AUDIT » en DM et on fait le point ensemble 🤝" }
          ]
        }));
      }
      setLoading(false);
    }, 600);
  };

  const handleCopy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied('error');
    }
    setTimeout(() => setCopied(null), 2000);
  };

  const copyLabel = (key, label) =>
    copied === key ? 'Copié !' : copied === 'error' ? 'Copie impossible' : label;

  const CopyIcon = ({ id }) =>
    copied === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />;

  const fieldClass = `w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition ${t.field}`;
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${t.label}`;

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 transition-colors ${t.page}`}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* En-tête */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 ${t.border}`}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Veille Concurrentielle Active (10+ Marques)
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Ton 100% Humain & Terrain
              </span>
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight mt-2 ${t.title}`}>
              Studio Agents B2B — Coiffure
            </h1>
            <p className={`text-sm mt-1 ${t.muted}`}>
              Pilotez votre communication en analysant les failles des concurrents de Fauvert sur le terrain en Île-de-France.
            </p>
          </div>

          <div className={`flex items-center gap-2 p-1.5 rounded-xl border self-start ${t.panel}`}>
            {[
              ['dark', 'Dark Pro', 'bg-slate-800 text-white shadow'],
              ['cream', 'Chaud / Crème', 'bg-amber-100 text-amber-900 shadow'],
              ['emerald', 'Émeraude', 'bg-emerald-800 text-emerald-50 shadow']
            ].map(([key, label, activeClass]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${theme === key ? activeClass : t.muted}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Panneau de Veille Concurrentielle & Paramètres */}
        <div className={`border rounded-2xl p-5 space-y-4 shadow-xl ${t.panel}`}>
          <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold">
            <Globe className="w-4 h-4" />
            <span>Veille Marché & Stratégie Concurrente Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cible / Contexte de tournée :</label>
              <input
                type="text"
                value={salonContext}
                onChange={(e) => setSalonContext(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>Marque concurrente ciblée (Veille active) :</label>
              <select
                value={selectedCompetitor}
                onChange={(e) => setSelectedCompetitor(e.target.value)}
                className={fieldClass}
              >
                {Object.entries(competitorIntel).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name} ({val.focus.slice(0, 35)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Encadré d'analyse en direct de la marque sélectionnée */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${t.field}`}>
            <p className="font-semibold text-amber-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Analyse terrain & Angle d'attaque Fauvert face à {comp.name} :
            </p>
            <p className={`leading-relaxed ${t.muted}`}>
              <strong className={t.strong}>Constat :</strong> {comp.focus} <br />
              <strong className={t.strong}>Positionnement Fauvert :</strong> {comp.angle}
            </p>
          </div>

          <div>
            <label className={labelClass}>Sujet / Situation du jour (Vécu en salon) :</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex. Stock mort dans le labo, marge au bac, commande minimale..."
                className={`flex-1 ${fieldClass}`}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-amber-900/20">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {activeTab === 'linkedin' ? 'Générer le post LinkedIn' : 'Générer le carrousel'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation des agents : changer d'onglet ne régénère rien */}
        <div className={`flex flex-wrap gap-2 border-b pb-3 ${t.border}`}>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${activeTab === 'linkedin' ? 'bg-amber-600/10 text-amber-500 border border-amber-500/30' : t.tabIdle}`}>
            <MessageSquare className="w-4 h-4" />
            Post LinkedIn Pro (Veille active)
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${activeTab === 'instagram' ? 'bg-amber-600/10 text-amber-500 border border-amber-500/30' : t.tabIdle}`}>
            <Layers className="w-4 h-4" />
            Carrousel Statique Instagram (@tiago_beaute_pro)
          </button>
        </div>

        {/* Contenu généré */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'linkedin' ? (
            <div className={`border rounded-2xl p-6 space-y-4 ${t.panel}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs uppercase tracking-wider font-semibold ${t.muted}`}>
                  Aperçu Post LinkedIn — Basé sur la veille {comp.name}
                </span>
                <button
                  onClick={() => handleCopy('linkedin', generatedOutput.linkedin)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition shrink-0 ${t.ghost}`}>
                  <CopyIcon id="linkedin" />
                  {copyLabel('linkedin', 'Copier le post')}
                </button>
              </div>

              <div className={`p-5 rounded-xl border whitespace-pre-line text-sm leading-relaxed ${t.field}`}>
                {generatedOutput.linkedin}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`border rounded-2xl p-6 space-y-4 ${t.panel}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${t.muted}`}>
                    Légende Instagram (@tiago_beaute_pro)
                  </span>
                  <button
                    onClick={() => handleCopy('caption', generatedOutput.igCaption)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition shrink-0 ${t.ghost}`}>
                    <CopyIcon id="caption" />
                    {copyLabel('caption', 'Copier la légende')}
                  </button>
                </div>
                <div className={`p-4 rounded-xl border whitespace-pre-line text-sm ${t.field}`}>
                  {generatedOutput.igCaption}
                </div>
              </div>

              {/* Aperçu des Slides du Carrousel Statique */}
              <div className={`border rounded-2xl p-6 space-y-4 ${t.panel}`}>
                <h3 className={`text-xs uppercase tracking-wider font-semibold ${t.muted}`}>
                  Slides du Carrousel Statique (5 visuels Canva)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {generatedOutput.igSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between h-48 text-left ${t.slide}`}
                    >
                      <div className="flex justify-between items-center text-[10px] opacity-70">
                        <span>Slide {idx + 1} / 5</span>
                        <span>@tiago_beaute_pro</span>
                      </div>
                      <div className="space-y-1.5 my-auto">
                        <h4 className="font-bold text-xs leading-tight">{slide.title}</h4>
                        <p className="text-[11px] opacity-80 leading-snug">{slide.body}</p>
                      </div>
                      <div className="h-1 w-8 bg-amber-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
