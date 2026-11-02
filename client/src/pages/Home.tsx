import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";

type Service = {
  id: string;
  title: string;
  cardLines: [string, string];
  short: string;
  deliverable: string;
  whenNeeded: string[];
  whatWeDo: string[];
  whatYouGet: string[];
  svgIcon: ReactNode;
};

/* Icônes linéaires épurées façon Aegis (Capture 2) */
const ServiceIcons = {
  audit: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 7L35 11.5V20.5C35 28.2 30.2 34.4 24 37C17.8 34.4 13 28.2 13 20.5V11.5L24 7Z" />
      <path d="M19.5 21.5L22.8 24.8L29 18.5" strokeWidth="2" />
      <path d="M11 38L24 43L37 38" strokeOpacity="0.55" />
    </svg>
  ),
  strategie: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="24,7 39,15.5 39,32.5 24,41 9,32.5 9,15.5" strokeOpacity="0.75" />
      <path d="M24 31V17" strokeWidth="2.1" />
      <path d="M18.5 22L24 16.5L29.5 22" strokeWidth="2.1" />
    </svg>
  ),
  resilience: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 24C11 16.8 16.8 11 24 11C29.4 11 34 14.3 36 19" />
      <path d="M37 24C37 31.2 31.2 37 24 37C18.6 37 14 33.7 12 29" />
      <path d="M18 24H21L23 19L26 29L28 24H31" strokeWidth="2" />
    </svg>
  ),
  rssi: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="16" r="6" />
      <path d="M9 37C9 30.9 13.9 26 20 26C22.4 26 24.6 26.8 26.4 28" />
      <path d="M33 21L40 24V30.5C40 35.4 36.9 39.3 33 41C29.1 39.3 26 35.4 26 30.5V24L33 21Z" />
    </svg>
  ),
};

/* Les 4 domaines d'intervention de la page d'accueil de YASEE Cybersécurité.html */
const coreServices: Service[] = [
  {
    id: "audit",
    title: "Audit de sécurité & conformité",
    cardLines: ["Audit de sécurité", "& conformité"],
    short: "Vérifier, preuves à l’appui, la conformité et la sécurité d’un périmètre précis.",
    deliverable: "Rapport et recommandations priorisées",
    whenNeeded: [
      "Vous préparez un audit externe ou une inspection.",
      "Votre organisation ou votre informatique a beaucoup changé.",
      "Vous voulez vérifier le travail d’un prestataire.",
      "Un client, votre groupe ou un régulateur exige un contrôle.",
    ],
    whatWeDo: [
      "Audit de sécurité organisationnel et technique",
      "Audit de conformité : RGSSI, protection des données, ISO/IEC 27001",
      "Revue des droits d’accès, des sauvegardes et des configurations clés",
      "Contrôle des prestataires informatiques",
    ],
    whatYouGet: [
      "Un rapport d’audit clair",
      "Les écarts classés par niveau de risque",
      "Des recommandations priorisées",
      "Une synthèse pour la direction",
    ],
    svgIcon: ServiceIcons.audit,
  },
  {
    id: "strategie",
    title: "Stratégie & feuille de route",
    cardLines: ["Stratégie &", "feuille de route"],
    short: "Définir vos priorités et structurer la gouvernance de votre sécurité.",
    deliverable: "Plan d’action étape par étape",
    whenNeeded: [
      "La sécurité est gérée au cas par cas.",
      "Vous n’avez pas de politique de sécurité formalisée.",
      "Vos obligations réglementaires sont mal connues.",
      "Vous devez justifier un budget sécurité.",
    ],
    whatWeDo: [
      "Analyse des risques au regard de vos enjeux métier",
      "Politique de sécurité et procédures",
      "Mise en place et gestion du SMSI",
      "Rôles, responsabilités et indicateurs de suivi",
    ],
    whatYouGet: [
      "Une feuille de route claire",
      "Des actions priorisées selon vos risques et vos moyens",
      "Des politiques et procédures prêtes à adopter",
      "Des indicateurs de suivi",
    ],
    svgIcon: ServiceIcons.strategie,
  },
  {
    id: "resilience",
    title: "Résilience & continuité",
    cardLines: ["Résilience &", "continuité"],
    short: "Préparer votre organisation à un incident et à la reprise d’activité.",
    deliverable: "Plans de réponse et de reprise",
    whenNeeded: [
      "Personne ne sait quoi faire si vos systèmes sont bloqués.",
      "Vos sauvegardes n’ont jamais été testées en restauration.",
      "Votre activité ne peut pas s’arrêter plusieurs jours.",
      "Votre secteur exige un plan de continuité.",
    ],
    whatWeDo: [
      "Analyse d’impact sur l’activité",
      "Plan de continuité et de reprise informatique",
      "Plan de réponse aux incidents",
      "Exercices de crise et tests de restauration",
    ],
    whatYouGet: [
      "Des plans documentés et testés",
      "Des rôles et contacts clairs en cas de crise",
      "Un rapport d’exercice",
      "Des axes d’amélioration",
    ],
    svgIcon: ServiceIcons.resilience,
  },
  {
    id: "rssi-externalise",
    title: "RSSI externalisé",
    cardLines: ["RSSI", "externalisé"],
    short: "Un pilotage de la sécurité sans recruter un responsable à temps plein.",
    deliverable: "Suivi régulier et tableau de bord",
    whenNeeded: [
      "Vous n’avez pas de responsable sécurité.",
      "Votre équipe informatique est seule face aux sujets de sécurité.",
      "Vous avez besoin d’un interlocuteur face à la direction ou aux clients.",
      "Vous êtes entre deux responsables sécurité.",
    ],
    whatWeDo: [
      "Pilotage du programme de sécurité",
      "Suivi des risques et de la conformité",
      "Conseil à la direction et participation aux comités",
      "Relation avec vos prestataires et appui en cas d’incident",
    ],
    whatYouGet: [
      "Un interlocuteur sécurité dédié",
      "Un tableau de bord régulier",
      "Des comptes rendus de suivi",
      "Des points planifiés avec la direction",
    ],
    svgIcon: ServiceIcons.rssi,
  },
];

const maturityLevels = [
  { level: 1, name: "Initial", desc: "aucune règle formalisée" },
  { level: 2, name: "Réactif", desc: "on agit après l’incident" },
  { level: 3, name: "Structuré", desc: "règles et responsabilités définies" },
  { level: 4, name: "Maîtrisé", desc: "risques suivis et mesurés" },
  { level: 5, name: "Optimisé", desc: "amélioration continue" },
];

const risks = [
  {
    title: "Arrêt d’activité",
    text: "Systèmes bloqués, ventes et services interrompus pendant des jours.",
  },
  {
    title: "Pertes financières",
    text: "Fraudes, rançons, coûts de remise en état et manque à gagner.",
  },
  {
    title: "Sanctions réglementaires",
    text: "Manquements aux obligations de protection des données et de sécurité.",
  },
  {
    title: "Atteinte à la réputation",
    text: "Confiance perdue de vos clients, partenaires et bailleurs.",
  },
];

const differentiators = [
  {
    num: "01",
    title: "Spécialisés",
    text: "La cybersécurité est notre seul métier : gouvernance, risques, conformité et résilience.",
  },
  {
    num: "02",
    title: "Proches de vous",
    text: "Basés à Abidjan, nous connaissons le contexte, les réglementations et les contraintes des entreprises ivoiriennes.",
  },
  {
    num: "03",
    title: "Indépendants",
    text: "Aucun produit à vendre : seul compte ce qui protège réellement votre activité.",
  },
  {
    num: "04",
    title: "Qualifiés",
    text: "13 ans d’expérience en systèmes d’information et des certifications reconnues : CISM, PMP, ISO/IEC 27001, EBIOS RM.",
  },
];

const steps = [
  { number: "01", title: "Comprendre", text: "Votre activité, vos systèmes, vos contraintes et vos obligations." },
  { number: "02", title: "Évaluer", text: "Vos pratiques et vos risques, avec un niveau de maturité clair." },
  { number: "03", title: "Prioriser", text: "Les actions qui réduisent le plus de risque pour l’effort engagé." },
  { number: "04", title: "Accompagner", text: "La mise en œuvre et le suivi dans la durée." },
];

const certifications = [
  "CISM",
  "PMP",
  "ISO/IEC 27001 Lead Implementer",
  "ISO/IEC 27001 Lead Auditor",
  "ISO/IEC 27005 Lead Risk Manager",
  "EBIOS Risk Manager",
  "ISO 31000",
  "PECB Certified Trainer",
];

const stats = [
  { value: 13, suffix: " ans", label: "d’expérience SI & cybersécurité" },
  { value: 5, suffix: " niveaux", label: "sur notre échelle de maturité" },
  { value: 4, suffix: " domaines", label: "d’intervention clés" },
  { value: 8, suffix: " certifications", label: "internationales reconnues" },
];

const rotatingWords = [
  "la continuité de leurs activités",
  "leurs données critiques",
  "leur sécurité informatique",
  "leur réputation",
];

function usePageMotion() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-counter]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      counters.forEach((counter) => {
        counter.textContent = counter.dataset.counter ?? "0";
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const target = Number(element.dataset.counter ?? 0);
          const duration = 1000;
          const startedAt = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(element);
        });
      },
      { threshold: 0.6 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    counters.forEach((counter) => counterObserver.observe(counter));

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeMaturity, setActiveMaturity] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  usePageMotion();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setDdOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="site-shell">
      {/* =====================================================================
          HEADER — Exactement les liens de YASEE Cybersécurité.html
         ===================================================================== */}
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="brand"
            href="#accueil"
            aria-label="YASEE Cybersécurité, accueil"
            onClick={closeMenus}
          >
            <img
              src="/yasee-logo.png"
              alt="Logo YASEE IT"
              className="brand-logo"
              width={40}
              height={41}
            />
            <span className="brand-copy">
              <strong>YASEE CYBERSÉCURITÉ</strong>
              <small>Une expertise de YASEE IT</small>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nav"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav
            id="nav"
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Navigation principale"
          >
            <a href="#accueil" onClick={closeMenus}>
              Accueil
            </a>

            <div
              className={`nav-dd ${ddOpen ? "is-open" : ""}`}
              onMouseEnter={() => setDdOpen(true)}
              onMouseLeave={() => setDdOpen(false)}
            >
              <a href="#services" className="nav-dd-top" onClick={closeMenus}>
                Nos services
              </a>
              <button
                type="button"
                className="nav-dd-btn"
                aria-expanded={ddOpen}
                aria-label="Afficher les services"
                onClick={() => setDdOpen((v) => !v)}
              >
                <ChevronDown size={14} />
              </button>
              <div className="nav-dd-menu" role="menu">
                <a href="#maturite" role="menuitem" onClick={closeMenus}>
                  Diagnostic &amp; feuille de route
                </a>
                <span className="dd-sep" aria-hidden="true" />
                {coreServices.map((s) => (
                  <a
                    key={s.id}
                    href="#services"
                    role="menuitem"
                    onClick={() => {
                      setSelectedService(s);
                      closeMenus();
                    }}
                  >
                    {s.title}
                  </a>
                ))}
                <span className="dd-sep" aria-hidden="true" />
                <a href="#contact" role="menuitem" onClick={closeMenus}>
                  Tests d’intrusion
                </a>
                <a href="#contact" role="menuitem" onClick={closeMenus}>
                  Formation
                </a>
              </div>
            </div>

            <a href="#pourquoi-yasee" onClick={closeMenus}>
              Qui sommes-nous
            </a>
            <a href="#contact" onClick={closeMenus}>
              Contact
            </a>

            <a className="header-phone" href="tel:+2250711444588">
              <Phone size={15} className="phone-icon" />
              <span>(+225) 07 11 444 588</span>
            </a>

            <a className="btn-pill btn-primary nav-cta" href="#contact" onClick={closeMenus}>
              Demander un diagnostic
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* =====================================================================
            ÉTAPE 1 : HERO — Pur, lisible et aéré comme la Capture 1 d'Aegis
           ===================================================================== */}
        <section id="accueil" className="hero-section">
          <div className="hero-bg" aria-hidden="true">
            <img src="/hero-team.jpg" alt="" className="hero-photo" />
            <div className="hero-overlay" />
          </div>

          <div className="container hero-container">
            <div className="hero-content reveal">
              <span className="hero-eyebrow">Cabinet de conseil en cybersécurité</span>

              <h1 className="hero-title">
                Comprendre vos risques.
                <br />
                Définir vos priorités.
                <br />
                <span>Renforcer votre sécurité.</span>
              </h1>

              <p className="hero-lead">
                Nous aidons les organisations à identifier leurs risques numériques, renforcer leur sécurité
                informatique et protéger{" "}
                <span className="word-rotator" aria-live="polite">
                  <span key={wordIndex} className="word-rotator-text">
                    {rotatingWords[wordIndex]}
                  </span>
                  <span className="word-rotator-bar" aria-hidden="true" />
                </span>
                .{" "}
                <strong>Des conseils indépendants, sans produit à vous vendre.</strong>
              </p>

              <div className="hero-buttons">
                <a className="btn-pill btn-primary" href="#contact">
                  Demander un diagnostic
                </a>
                <a className="btn-pill btn-outline-light" href="#services">
                  Découvrir nos services
                </a>
              </div>
            </div>
          </div>

          {/* Découpe cambrée douce du bas du Hero (Capture 2 d'Aegis) */}
          <div className="section-cut cut-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 130" fill="none" preserveAspectRatio="none">
              <path
                d="M0 130 L0 118 L960 16 Q1035 8 1110 22 L1440 84 L1440 130 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* =====================================================================
            ÉTAPE 2 : COMMENT NOUS POUVONS VOUS AIDER — Exactement la Capture 2 ("How We Can Help")
            Cartes sombres épurées (juste icône + titre + flèche), zéro surcharge !
           ===================================================================== */}
        <section id="services" className="section services-section">
          <div className="container">
            <div className="aegis-split">
              {/* Colonne gauche éditoriale */}
              <div className="aegis-left reveal">
                <span className="eyebrow">Comment nous pouvons vous aider</span>
                <h2 className="aegis-big-heading">
                  <span>Quatre domaines</span>
                  <strong>d’intervention</strong>
                </h2>
                <p className="aegis-green-sub">
                  Protéger vos données, vos systèmes et la continuité de vos activités.
                </p>
                <p className="aegis-body">
                  Tout commence par un <strong>diagnostic</strong> pour avoir une vue claire de votre niveau de
                  sécurité et des actions à engager en priorité. Selon votre besoin, nous intervenons ensuite sur
                  quatre domaines complémentaires, à Abidjan ou à distance.
                </p>
                <a href="#maturite" className="text-arrow-link">
                  Découvrir notre diagnostic à 5 niveaux <ArrowRight size={16} />
                </a>
              </div>

              {/* Colonne droite : 4 cartes sombres épurées avec décalage doux (Capture 2) */}
              <div className="aegis-cards-grid">
                {coreServices.map((service, index) => {
                  const isActive = selectedService?.id === service.id;
                  const staggerClass = index % 2 === 1 ? "card-offset" : "";
                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`aegis-clean-card ${staggerClass} reveal reveal-delay-${(index % 3) + 1} ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() =>
                        setSelectedService(isActive ? null : service)
                      }
                      aria-expanded={isActive}
                    >
                      <div className="clean-card-icon">{service.svgIcon}</div>

                      <div className="clean-card-bottom">
                        <div>
                          <h3>
                            {service.cardLines[0]}
                            <br />
                            {service.cardLines[1]}
                          </h3>
                          <span className="clean-card-deliv">{service.deliverable}</span>
                        </div>
                        <span className="clean-card-arrow" aria-hidden="true">
                          <ChevronRight size={17} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Détail léger et lisible uniquement quand on clique sur une carte */}
            {selectedService && (
              <div className="service-drawer reveal" role="region" aria-live="polite">
                <div className="drawer-top">
                  <div>
                    <span className="eyebrow">Détail du domaine sélectionné</span>
                    <h3>{selectedService.title}</h3>
                    <p>{selectedService.short}</p>
                  </div>
                  <button
                    type="button"
                    className="drawer-close"
                    onClick={() => setSelectedService(null)}
                    aria-label="Fermer le détail"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="drawer-cols">
                  <div>
                    <h4>Quand en avez-vous besoin ?</h4>
                    <ul>
                      {selectedService.whenNeeded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Ce que nous faisons</h4>
                    <ul>
                      {selectedService.whatWeDo.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="drawer-deliv-box">
                    <h4>Ce que vous recevez</h4>
                    <ul>
                      {selectedService.whatYouGet.map((item) => (
                        <li key={item}>
                          <Check size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" className="btn-pill btn-primary drawer-cta">
                      Demander un échange
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================
            ÉTAPE 3 : POURQUOI LA CYBERSÉCURITÉ VOUS CONCERNE + UN CONSEIL INDÉPENDANT
            (Fond sablé doux + Surlignage bas Capture 3 + Comparatif Capture 4)
           ===================================================================== */}
        <section className="section sand-section">
          {/* Transition courbée douce en haut */}
          <div className="section-cut cut-top" aria-hidden="true">
            <svg viewBox="0 0 1440 70" fill="none" preserveAspectRatio="none">
              <polygon points="0,0 1440,0 1440,56 0,10" fill="#ffffff" />
            </svg>
          </div>

          <div className="container">
            <div className="centered-intro reveal">
              <span className="eyebrow">Pourquoi la cybersécurité vous concerne</span>
              <h2>
                Une attaque ne coûte pas{" "}
                <span className="marker-bar">seulement des données.</span>
              </h2>
              <p>
                La cybersécurité protège vos ordinateurs, vos logiciels et vos données contre le vol, la fraude ou le
                blocage. Faux e-mails, fraudes au virement, rançongiciels : ces attaques ne visent plus seulement les
                grandes entreprises.
              </p>
            </div>

            {/* Les 4 risques du HTML en ligne épurée */}
            <div className="risks-row">
              {risks.map((risk, idx) => (
                <div
                  key={risk.title}
                  className={`risk-col ${idx % 2 === 1 ? "stagger-sm" : ""} reveal reveal-delay-${(idx % 3) + 1}`}
                >
                  <h3>{risk.title}</h3>
                  <p>{risk.text}</p>
                </div>
              ))}
            </div>

            <p className="good-news-text reveal">
              La bonne nouvelle : des mesures simples et bien choisies réduisent fortement ces risques.
            </p>

            {/* Comparatif Côte à Côte — Un conseil indépendant (Style Capture 4 : ✕ vs ✓) */}
            <div className="indep-comparison reveal">
              <div className="indep-head">
                <span className="eyebrow">Un conseil indépendant</span>
                <h3>Nous ne vendons ni logiciel, ni matériel.</h3>
                <p>
                  Nos recommandations servent uniquement vos intérêts. Vous gardez le choix de vos solutions et de vos
                  fournisseurs.
                </p>
              </div>

              <div className="indep-two-cols">
                <ul className="indep-col is-muted">
                  <li>
                    <span className="icon-circle cross" aria-hidden="true">
                      <X size={13} strokeWidth={2.5} />
                    </span>
                    <span>Des conseils orientés par les commissions d’un vendeur de logiciels.</span>
                  </li>
                  <li>
                    <span className="icon-circle cross" aria-hidden="true">
                      <X size={13} strokeWidth={2.5} />
                    </span>
                    <span>Des outils coûteux empilés sans priorité ni vision d’ensemble.</span>
                  </li>
                  <li>
                    <span className="icon-circle cross" aria-hidden="true">
                      <X size={13} strokeWidth={2.5} />
                    </span>
                    <span>Un prestataire juge et partie lorsqu’il faut contrôler la sécurité.</span>
                  </li>
                </ul>

                <ul className="indep-col is-bold">
                  <li>
                    <span className="icon-circle check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>Aucune commission de fournisseur ou d’éditeur.</span>
                  </li>
                  <li>
                    <span className="icon-circle check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>Des recommandations proportionnées à vos moyens, pas au catalogue d’un vendeur.</span>
                  </li>
                  <li>
                    <span className="icon-circle check" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>Un regard neutre sur vos prestataires informatiques actuels.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Légère inclinaison vers la section sombre (Capture 1 & 4) */}
          <div className="section-cut cut-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 72" fill="none" preserveAspectRatio="none">
              <polygon points="0,12 1440,68 1440,72 0,72" fill="#091929" />
            </svg>
          </div>
        </section>

        {/* =====================================================================
            ÉTAPE 4 : OÙ EN EST VOTRE ENTREPRISE ? (5 Niveaux de Maturité — Style Capture 1 nouvelle)
           ===================================================================== */}
        <section id="maturite" className="section maturity-dark-section">
          <div className="container">
            <div className="maturity-center reveal">
              <span className="eyebrow eyebrow-light">Diagnostic de maturité</span>
              <h2>Où en est votre entreprise ?</h2>
              <p>
                Notre diagnostic situe votre organisation sur cinq niveaux de maturité, puis trace le chemin vers le
                niveau suivant.
              </p>
            </div>

            {/* 5 onglets épurés avec barre verte sous l'élément actif (Exacte Capture 1 nouvelle) */}
            <div className="maturity-cards-row reveal" role="tablist" aria-label="Cinq niveaux de maturité">
              {maturityLevels.map((lvl) => {
                const active = activeMaturity === lvl.level;
                return (
                  <button
                    key={lvl.level}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`maturity-step-card ${active ? "is-active" : ""}`}
                    onClick={() => setActiveMaturity(lvl.level)}
                  >
                    <span className="m-num">0{lvl.level}</span>
                    <strong>{lvl.name}</strong>
                    <span>{lvl.desc}</span>
                  </button>
                );
              })}
            </div>

            <p className="maturity-footnote reveal">
              Indicateur interne d’accompagnement, distinct d’une certification officielle.
            </p>

            {/* 4 chiffres clés sobres en une ligne */}
            <div className="stats-strip reveal">
              {stats.map((st) => (
                <div key={st.label} className="stat-cell">
                  <div className="stat-val">
                    <span data-counter={st.value}>{st.value}</span>
                    <em>{st.suffix}</em>
                  </div>
                  <p>{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Courbe douce vers la section blanche */}
          <div className="section-cut cut-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 84" fill="none" preserveAspectRatio="none">
              <path d="M0 84 L0 52 Q720 -10 1440 52 L1440 84 Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* =====================================================================
            ÉTAPE 5 : POURQUOI YASEE & NOTRE DÉMARCHE EN 4 ÉTAPES
           ===================================================================== */}
        <section id="pourquoi-yasee" className="section why-section">
          <div className="container">
            {/* Pourquoi YASEE : Split Photo Abidjan + 4 différenciateurs */}
            <div className="why-split">
              <div className="why-photo-wrap reveal">
                <img
                  src="/about-team.jpg"
                  alt="Équipe de conseil YASEE Cybersécurité à Abidjan"
                  className="why-photo"
                />
              </div>

              <div className="why-copy reveal reveal-delay-2">
                <span className="eyebrow">Pourquoi YASEE</span>
                <h2>
                  Ce qui nous <span className="marker-bar">distingue</span>
                </h2>
                <p className="why-lead">
                  YASEE Cybersécurité accompagne les dirigeants et les équipes informatiques qui veulent protéger leur
                  activité sans se perdre dans la technique.
                </p>

                <div className="diff-2x2">
                  {differentiators.map((d) => (
                    <div key={d.num} className="diff-box">
                      <span className="diff-num">{d.num}</span>
                      <h3>{d.title}</h3>
                      <p>{d.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notre démarche : Quatre étapes, des résultats concrets */}
            <div className="steps-section-block reveal">
              <div className="steps-head">
                <span className="eyebrow">Notre démarche</span>
                <h2>Quatre étapes, des résultats concrets</h2>
              </div>

              <div className="steps-grid-4">
                {steps.map((step) => (
                  <div key={step.number} className="step-item">
                    <span className="step-num">{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nos certifications */}
            <div className="certs-block reveal">
              <span className="eyebrow">Nos certifications</span>
              <div className="certs-row">
                {certifications.map((cert) => (
                  <span key={cert} className="cert-tag">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            ÉTAPE 6 : CONTACT — Clair, aéré et compréhensible en 2 secondes
           ===================================================================== */}
        <section id="contact" className="section contact-clean-section">
          <div className="section-cut cut-top" aria-hidden="true">
            <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
              <polygon points="0,0 1440,0 1440,12 0,60" fill="#ffffff" />
            </svg>
          </div>

          <div className="container">
            <div className="contact-clean-layout">
              {/* Colonne gauche : Coordonnées directes et lisibles */}
              <div className="contact-info-col reveal">
                <span className="eyebrow eyebrow-light">Contact</span>
                <h2>Demander un diagnostic ou un premier échange</h2>
                <p className="contact-sub">
                  Décrivez-nous votre situation en quelques lignes. Nous revenons vers vous rapidement pour convenir
                  d’un rendez-vous, sur site à Abidjan ou à distance.
                </p>

                <div className="contact-direct-list">
                  <a href="tel:+2250711444588" className="direct-item">
                    <span className="direct-icon">
                      <Phone size={20} />
                    </span>
                    <div>
                      <small>Téléphone</small>
                      <strong>(+225) 07 11 444 588</strong>
                    </div>
                  </a>

                  <a href="mailto:info@yasee-it.ci" className="direct-item">
                    <span className="direct-icon">
                      <Mail size={20} />
                    </span>
                    <div>
                      <small>E-mail</small>
                      <strong>info@yasee-it.ci</strong>
                    </div>
                  </a>

                  <div className="direct-item">
                    <span className="direct-icon">
                      <MapPin size={20} />
                    </span>
                    <div>
                      <small>Basés à</small>
                      <strong>Abidjan, Côte d’Ivoire</strong>
                      <span>Interventions sur site ou à distance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Carte formulaire blanche épurée (4 champs simples) */}
              <div className="contact-card-col reveal reveal-delay-2">
                {submitted ? (
                  <div className="contact-success" role="status" aria-live="polite">
                    <div className="success-circle">
                      <Check size={26} />
                    </div>
                    <h3>Merci pour votre message</h3>
                    <p>
                      Votre demande est bien prise en compte. Notre équipe vous recontacte très vite pour organiser un
                      premier échange.
                    </p>
                    <button
                      type="button"
                      className="btn-pill btn-primary"
                      onClick={() => setSubmitted(false)}
                    >
                      Envoyer une autre demande
                    </button>
                  </div>
                ) : (
                  <form className="clean-form" onSubmit={handleSubmit} noValidate>
                    <h3>Envoyez-nous un message</h3>

                    <div className="clean-form-row">
                      <label htmlFor="c-nom">
                        Nom et prénom *
                        <input
                          id="c-nom"
                          name="nom"
                          type="text"
                          placeholder="Votre nom"
                          required
                        />
                      </label>
                      <label htmlFor="c-ent">
                        Entreprise *
                        <input
                          id="c-ent"
                          name="ent"
                          type="text"
                          placeholder="Nom de votre entreprise"
                          required
                        />
                      </label>
                    </div>

                    <div className="clean-form-row">
                      <label htmlFor="c-mail">
                        E-mail professionnel *
                        <input
                          id="c-mail"
                          name="mail"
                          type="email"
                          placeholder="vous@entreprise.ci"
                          required
                        />
                      </label>
                      <label htmlFor="c-tel">
                        Téléphone
                        <input
                          id="c-tel"
                          name="tel"
                          type="tel"
                          placeholder="(+225) 07 00 00 00 00"
                        />
                      </label>
                    </div>

                    <label htmlFor="c-besoin">
                      Ce qui vous intéresse
                      <select id="c-besoin" name="besoin" defaultValue="Diagnostic & feuille de route">
                        <option value="Diagnostic & feuille de route">Diagnostic &amp; feuille de route (Premier pas)</option>
                        <option value="Audit de sécurité & conformité">Audit de sécurité &amp; conformité</option>
                        <option value="Stratégie & feuille de route">Stratégie &amp; feuille de route</option>
                        <option value="Résilience & continuité">Résilience &amp; continuité</option>
                        <option value="RSSI externalisé">RSSI externalisé</option>
                        <option value="Tests d’intrusion">Tests d’intrusion</option>
                        <option value="Formation">Formation professionnelle</option>
                      </select>
                    </label>

                    <label htmlFor="c-msg">
                      Votre message *
                      <textarea
                        id="c-msg"
                        name="msg"
                        rows={4}
                        placeholder="Décrivez brièvement votre besoin ou vos questions…"
                        required
                      />
                    </label>

                    <button type="submit" className="btn-pill btn-primary clean-submit">
                      Envoyer ma demande <Send size={15} />
                    </button>

                    <p className="clean-form-note">
                      <ShieldCheck size={15} /> Échange strictement confidentiel et sans engagement.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          FOOTER — Conforme à YASEE Cybersécurité.html
         ===================================================================== */}
      <footer className="site-footer">
        <div className="container footer-wrap">
          <div className="footer-brand-stack">
            <a className="brand" href="#accueil">
              <img
                src="/yasee-logo.png"
                alt="Logo YASEE IT"
                className="brand-logo"
                width={36}
                height={37}
              />
              <span className="brand-copy">
                <strong>YASEE CYBERSÉCURITÉ</strong>
                <small>Une expertise de YASEE IT</small>
              </span>
            </a>
            <p>
              Conseil indépendant en cybersécurité, gouvernance, risques et conformité. Une expertise de YASEE IT.
            </p>
          </div>

          <div className="footer-col">
            <b>Services</b>
            <ul>
              <li><a href="#maturite">Diagnostic &amp; feuille de route</a></li>
              <li><a href="#services">Audit de sécurité &amp; conformité</a></li>
              <li><a href="#services">Stratégie &amp; feuille de route</a></li>
              <li><a href="#services">Résilience &amp; continuité</a></li>
              <li><a href="#services">RSSI externalisé</a></li>
              <li><a href="#contact">Tests d’intrusion</a></li>
              <li><a href="#contact">Formation</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <b>Contact</b>
            <ul>
              <li><a href="tel:+2250711444588">(+225) 07 11 444 588</a></li>
              <li><a href="mailto:info@yasee-it.ci">info@yasee-it.ci</a></li>
              <li>Abidjan, Côte d’Ivoire</li>
              <li><a href="#pourquoi-yasee">Qui sommes-nous</a></li>
            </ul>
          </div>

          <div className="footer-legal">© YASEE IT · yasee-it.ci</div>
        </div>
      </footer>

      {/* Bouton flottant discret en bas à droite */}
      <a href="#contact" className="floating-cta-pill">
        <span className="floating-dot" aria-hidden="true" />
        <MessageCircle size={17} />
        <span>Parler à un expert</span>
      </a>
    </div>
  );
}
