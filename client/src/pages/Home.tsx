import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileCheck2,
  Layers,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  UserCheck,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

export type ViewId =
  | "accueil"
  | "services"
  | "diagnostic"
  | "audit"
  | "strategie"
  | "resilience"
  | "rssi-externalise"
  | "tests-intrusion"
  | "formation"
  | "a-propos"
  | "contact";

const VALID_VIEWS: ViewId[] = [
  "accueil",
  "services",
  "diagnostic",
  "audit",
  "strategie",
  "resilience",
  "rssi-externalise",
  "tests-intrusion",
  "formation",
  "a-propos",
  "contact",
];

const SERVICE_VIEWS: ViewId[] = [
  "diagnostic",
  "audit",
  "strategie",
  "resilience",
  "rssi-externalise",
  "tests-intrusion",
  "formation",
];

const WHATSAPP_URL =
  "https://wa.me/2250711444588?text=" +
  encodeURIComponent(
    "Bonjour YASEE Cybersécurité, je souhaite échanger avec un expert concernant la sécurité informatique de mon organisation.",
  );

const WHATSAPP_DIAGNOSTIC_URL =
  "https://wa.me/2250711444588?text=" +
  encodeURIComponent(
    "Bonjour YASEE Cybersécurité, je souhaite demander un diagnostic de cybersécurité pour mon organisation.",
  );

const LINKEDIN_PROFILE_URL =
  "https://www.linkedin.com/in/ericyapo-cybersecurity?utm_source=share_via&utm_content=profile&utm_medium=member_ios";

type ServicePageData = {
  id: ViewId;
  category: "Votre premier pas" | "Nos domaines" | "Autres services";
  title: string;
  cardLines: [string, string];
  short: string;
  lead: string;
  deliverable: string;
  whenNeeded: string[];
  whatWeDo: string[];
  whatYouGet: string[];
  benefits: string[];
  steps: { title: string; text: string }[];
  vsBox?: {
    title: string;
    p1: ReactNode;
    p2: ReactNode;
    linkText: string;
    linkTarget: ViewId;
  };
  svgIcon: ReactNode;
};

/* Icônes linéaires épurées façon Aegis */
const ServiceIcons = {
  diagnostic: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="15" />
      <polygon points="28,20 22,22 20,28 26,26" strokeWidth="1.9" />
      <path d="M24 6V9M24 39V42M6 24H9M39 24H42" strokeOpacity="0.6" />
    </svg>
  ),
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
  pentest: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="10" width="32" height="28" rx="4" />
      <path d="M16 21L21 25L16 29" strokeWidth="2" />
      <path d="M24 29H31" strokeWidth="2" />
    </svg>
  ),
  formation: (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18L24 10L42 18L24 26L6 18Z" />
      <path d="M13 21.5V31.5C13 34.5 18 37 24 37C30 37 35 34.5 35 31.5V21.5" />
      <path d="M42 18V29" />
    </svg>
  ),
};

/* Toutes les pages services avec le contenu exact de YASEE Cybersécurité.html */
const ALL_SERVICES: Record<string, ServicePageData> = {
  diagnostic: {
    id: "diagnostic",
    category: "Votre premier pas",
    title: "Diagnostic de cybersécurité & feuille de route",
    cardLines: ["Diagnostic &", "feuille de route"],
    short: "Votre premier pas : une vue claire de votre niveau de sécurité et des actions à engager en priorité. Sur site ou à distance.",
    lead: "Votre premier pas : une vue claire de votre niveau de sécurité et des actions à engager en priorité. Sur site ou à distance.",
    deliverable: "Niveau de maturité & feuille de route",
    whenNeeded: [
      "Vous ne savez pas par où commencer.",
      "Un client, un partenaire ou votre groupe vous demande des garanties.",
      "Vous avez subi un incident ou une tentative de fraude.",
      "Vous préparez un projet numérique important.",
    ],
    whatWeDo: [
      "Cadrage avec la direction : activité, enjeux, périmètre",
      "Entretiens avec les personnes clés",
      "Revue de l’organisation, des accès, des sauvegardes, des postes et du réseau",
      "Analyse des risques au regard de votre activité",
      "Positionnement sur notre échelle de maturité à 5 niveaux",
      "Premier état des lieux de vos obligations réglementaires",
    ],
    whatYouGet: [
      "Un rapport de diagnostic lisible par la direction",
      "Votre niveau de maturité sur 5 niveaux",
      "Vos risques prioritaires",
      "Une feuille de route avec des actions priorisées selon votre contexte",
      "Une restitution à votre direction",
    ],
    benefits: [
      "Décider en connaissance de cause",
      "Investir là où le risque est le plus élevé",
      "Disposer d’un document à présenter à vos partenaires",
    ],
    steps: [
      { title: "Cadrage", text: "Objectifs, périmètre et interlocuteurs définis avec la direction." },
      { title: "Collecte", text: "Entretiens, revue documentaire et observations." },
      { title: "Analyse", text: "Risques, écarts et niveau de maturité." },
      { title: "Restitution", text: "Présentation à la direction et remise du rapport." },
    ],
    vsBox: {
      title: "Diagnostic ou audit ?",
      p1: (
        <>
          Le <strong>diagnostic</strong> donne une vue d’ensemble de votre organisation et vous dit par où commencer.
          L’<strong>audit</strong> vérifie en profondeur, preuves à l’appui, un périmètre précis au regard d’un
          référentiel ou d’une exigence.
        </>
      ),
      p2: (
        <>
          <strong>Pas d’exigence précise à vérifier ?</strong> Commencez par le diagnostic.{" "}
          <strong>Une réglementation, un client ou votre groupe vous demande un contrôle ?</strong> Choisissez l’audit.
        </>
      ),
      linkText: "Découvrir l’audit de sécurité & conformité →",
      linkTarget: "audit",
    },
    svgIcon: ServiceIcons.diagnostic,
  },
  audit: {
    id: "audit",
    category: "Nos domaines",
    title: "Audit de sécurité & conformité",
    cardLines: ["Audit de sécurité", "& conformité"],
    short: "Vérifier, preuves à l’appui, la conformité et la sécurité d’un périmètre précis.",
    lead: "Vérifier, preuves à l’appui, la conformité et la sécurité d’un périmètre précis : un système, une application, un site ou une réglementation.",
    deliverable: "Rapport et recommandations priorisées",
    whenNeeded: [
      "Vous préparez un audit externe ou une inspection.",
      "Votre organisation ou votre informatique a beaucoup changé.",
      "Vous voulez vérifier le travail d’un prestataire.",
      "Un client, votre groupe ou un régulateur exige un contrôle.",
    ],
    whatWeDo: [
      "Audit de sécurité organisationnel et technique",
      "Audit de conformité : RGSSI, protection des données, exigences de votre secteur, ISO/IEC 27001",
      "Revue des droits d’accès, des sauvegardes et des configurations clés",
      "Contrôle des prestataires informatiques",
    ],
    whatYouGet: [
      "Un rapport d’audit clair",
      "Les écarts classés par niveau de risque",
      "Des recommandations priorisées",
      "Une synthèse pour la direction",
    ],
    benefits: [
      "Connaître votre situation réelle, pas supposée",
      "Aborder un audit externe sereinement",
      "Corriger d’abord ce qui expose le plus",
    ],
    steps: [
      { title: "Périmètre", text: "Choix du périmètre et du référentiel d’audit." },
      { title: "Preuves", text: "Entretiens, documents et vérifications sur les systèmes." },
      { title: "Écarts", text: "Analyse et classement des écarts par niveau de risque." },
      { title: "Rapport", text: "Restitution et recommandations priorisées." },
    ],
    vsBox: {
      title: "Diagnostic ou audit ?",
      p1: (
        <>
          Le <strong>diagnostic</strong> donne une vue d’ensemble de votre organisation et vous dit par où commencer.
          L’<strong>audit</strong> vérifie en profondeur, preuves à l’appui, un périmètre précis au regard d’un
          référentiel ou d’une exigence.
        </>
      ),
      p2: (
        <>
          <strong>Pas d’exigence précise à vérifier ?</strong> Commencez par le diagnostic.{" "}
          <strong>Une réglementation, un client ou votre groupe vous demande un contrôle ?</strong> Choisissez l’audit.
        </>
      ),
      linkText: "Découvrir le diagnostic →",
      linkTarget: "diagnostic",
    },
    svgIcon: ServiceIcons.audit,
  },
  strategie: {
    id: "strategie",
    category: "Nos domaines",
    title: "Stratégie & feuille de route",
    cardLines: ["Stratégie &", "feuille de route"],
    short: "Définir vos priorités et structurer la gouvernance de votre sécurité.",
    lead: "Définir vos priorités, structurer la gouvernance de votre sécurité et répondre à vos obligations.",
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
      "Conformité réglementaire : RGSSI, protection des données, exigences de votre secteur",
      "Rôles, responsabilités et comité de suivi",
      "Indicateurs et tableau de bord",
    ],
    whatYouGet: [
      "Une feuille de route claire",
      "Des actions priorisées selon votre contexte, vos risques et vos moyens",
      "Des politiques et procédures prêtes à adopter",
      "Des indicateurs de suivi",
    ],
    benefits: [
      "Une sécurité pilotée, plus subie",
      "Des investissements justifiés auprès de la direction",
      "Une conformité organisée dans la durée",
    ],
    steps: [
      { title: "Enjeux", text: "Comprendre votre activité et vos objectifs." },
      { title: "Risques", text: "Identifier et évaluer les risques prioritaires." },
      { title: "Cible", text: "Définir le niveau visé et les priorités." },
      { title: "Feuille de route", text: "Formaliser et partager le plan d’action." },
    ],
    svgIcon: ServiceIcons.strategie,
  },
  resilience: {
    id: "resilience",
    category: "Nos domaines",
    title: "Résilience & continuité",
    cardLines: ["Résilience &", "continuité"],
    short: "Préparer votre organisation à un incident et à la reprise d’activité.",
    lead: "Préparer votre organisation à un incident et à une reprise rapide de l’activité.",
    deliverable: "Plans de réponse et de reprise",
    whenNeeded: [
      "Personne ne sait quoi faire si vos systèmes sont bloqués.",
      "Vos sauvegardes n’ont jamais été testées en restauration.",
      "Votre activité ne peut pas s’arrêter plusieurs jours.",
      "Votre secteur exige un plan de continuité.",
    ],
    whatWeDo: [
      "Analyse d’impact sur l’activité",
      "Plan de continuité d’activité",
      "Plan de reprise informatique",
      "Plan de réponse aux incidents",
      "Exercices de crise et tests de restauration",
      "Sensibilisation des équipes aux bons réflexes",
    ],
    whatYouGet: [
      "Des plans documentés et testés",
      "Des rôles et contacts clairs en cas de crise",
      "Un rapport d’exercice",
      "Des axes d’amélioration",
    ],
    benefits: [
      "Réduire la durée d’interruption",
      "Limiter les pertes en cas d’attaque",
      "Rassurer vos clients et partenaires",
    ],
    steps: [
      { title: "Activités essentielles", text: "Identifier ce qui ne doit pas s’arrêter." },
      { title: "Stratégies", text: "Définir comment continuer et redémarrer." },
      { title: "Plans", text: "Rédiger des plans simples et opérationnels." },
      { title: "Exercices", text: "Tester, mesurer et améliorer." },
    ],
    svgIcon: ServiceIcons.resilience,
  },
  "rssi-externalise": {
    id: "rssi-externalise",
    category: "Nos domaines",
    title: "RSSI externalisé",
    cardLines: ["RSSI", "externalisé"],
    short: "Un pilotage de la sécurité sans recruter un responsable à temps plein.",
    lead: "Un responsable de la sécurité à vos côtés, sans recruter à temps plein.",
    deliverable: "Suivi régulier et tableau de bord",
    whenNeeded: [
      "Vous n’avez pas de responsable sécurité.",
      "Votre équipe informatique est seule face aux sujets de sécurité.",
      "Vous avez besoin d’un interlocuteur face à la direction, aux clients ou aux régulateurs.",
      "Vous êtes entre deux responsables sécurité.",
    ],
    whatWeDo: [
      "Pilotage du programme de sécurité",
      "Suivi des risques et de la conformité",
      "Rédaction et mise à jour des politiques",
      "Conseil à la direction et participation aux comités",
      "Relation avec vos prestataires",
      "Appui à la coordination en cas d’incident",
    ],
    whatYouGet: [
      "Un interlocuteur sécurité dédié",
      "Un tableau de bord régulier",
      "Des comptes rendus de suivi",
      "Des points planifiés avec la direction",
    ],
    benefits: [
      "Une compétence de haut niveau à coût maîtrisé",
      "Une sécurité suivie dans la durée",
      "Un volume d’intervention adapté à vos besoins",
    ],
    steps: [
      { title: "Prise de connaissance", text: "Votre organisation, vos risques, vos projets." },
      { title: "Plan de travail", text: "Priorités et rythme d’intervention définis ensemble." },
      { title: "Suivi", text: "Points réguliers et pilotage des actions." },
      { title: "Bilan", text: "Mesure des progrès et ajustement." },
    ],
    svgIcon: ServiceIcons.rssi,
  },
  "tests-intrusion": {
    id: "tests-intrusion",
    category: "Autres services",
    title: "Tests d’intrusion",
    cardLines: ["Tests", "d’intrusion"],
    short: "Vérifier la résistance de vos systèmes face à un attaquant.",
    lead: "Vérifier, en conditions réelles, la résistance de vos systèmes face à un attaquant.",
    deliverable: "Rapport de vulnérabilités & plan de correction",
    whenNeeded: [
      "Vous mettez en ligne un site ou une application.",
      "Un client ou un partenaire l’exige.",
      "Vous voulez vérifier que des corrections sont efficaces.",
      "Vos systèmes sont exposés sur Internet.",
    ],
    whatWeDo: [
      "Tests externes des systèmes exposés sur Internet",
      "Tests internes de votre réseau",
      "Tests d’applications web et mobiles",
      "Interventions encadrées par une autorisation écrite et un périmètre convenu",
    ],
    whatYouGet: [
      "Un rapport technique détaillé",
      "Une synthèse pour la direction",
      "Les vulnérabilités classées par criticité",
      "Un plan de correction priorisé",
    ],
    benefits: [
      "Découvrir vos failles avant un attaquant",
      "Prouver votre niveau de sécurité à vos clients",
      "Vérifier l’efficacité de vos corrections",
    ],
    steps: [
      { title: "Cadrage", text: "Périmètre, règles et autorisation écrite." },
      { title: "Tests", text: "Recherche et exploitation contrôlée des failles." },
      { title: "Rapport", text: "Vulnérabilités classées par criticité." },
      { title: "Restitution", text: "Plan de correction et contre-test si souhaité." },
    ],
    svgIcon: ServiceIcons.pentest,
  },
  formation: {
    id: "formation",
    category: "Autres services",
    title: "Formation certifiante & personnalisée",
    cardLines: ["Formation certifiante", "& personnalisée"],
    short: "Des programmes certifiants ou sur mesure pour vos équipes.",
    lead: "Former vos équipes et sensibiliser vos collaborateurs, avec des programmes certifiants ou sur mesure.",
    deliverable: "Supports, évaluation & attestation",
    whenNeeded: [
      "Vos équipes informatiques doivent monter en compétence.",
      "Vos collaborateurs sont exposés aux faux e-mails et aux fraudes.",
      "Un collaborateur prépare une certification professionnelle.",
      "Vous devez démontrer des actions de sensibilisation.",
    ],
    whatWeDo: [
      "Préparation aux certifications : ISO/IEC 27001, ISO/IEC 27005, EBIOS Risk Manager, gestion des risques",
      "Programmes sur mesure pour vos équipes informatiques",
      "Sensibilisation des collaborateurs adaptée à vos métiers",
      "Ateliers pour les dirigeants",
    ],
    whatYouGet: [
      "Un programme adapté à vos objectifs",
      "Des supports de formation",
      "Une attestation de participation",
      "Un bilan de la formation",
    ],
    benefits: [
      "Des équipes plus autonomes",
      "Moins d’incidents liés aux erreurs humaines",
      "Des compétences reconnues",
    ],
    steps: [
      { title: "Besoins", text: "Publics, objectifs et niveau de départ." },
      { title: "Programme", text: "Contenu et cas pratiques adaptés." },
      { title: "Animation", text: "En présentiel ou à distance." },
      { title: "Évaluation", text: "Mesure des acquis et bilan." },
    ],
    svgIcon: ServiceIcons.formation,
  },
};

const CORE_DOMAIN_IDS: ViewId[] = ["audit", "strategie", "resilience", "rssi-externalise"];
const OTHER_SERVICE_IDS: ViewId[] = ["tests-intrusion", "formation"];

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

const homeSteps = [
  { number: "01", title: "Comprendre", text: "Votre activité, vos systèmes, vos contraintes et vos obligations." },
  { number: "02", title: "Évaluer", text: "Vos pratiques et vos risques, avec un niveau de maturité clair." },
  { number: "03", title: "Prioriser", text: "Les actions qui réduisent le plus de risque pour l’effort engagé." },
  { number: "04", title: "Accompagner", text: "La mise en œuvre et le suivi dans la durée." },
];

const aboutValues = [
  {
    title: "Notre conviction",
    text: "La cybersécurité n’est pas réservée aux grandes entreprises. Une démarche bien dimensionnée protège efficacement une organisation de toute taille.",
  },
  {
    title: "Notre manière de travailler",
    text: "Un langage clair, des priorités assumées et des recommandations à la mesure de vos moyens.",
  },
  {
    title: "Notre engagement",
    text: "Un conseil indépendant, la confidentialité de vos informations et un suivi dans la durée.",
  },
];

const aboutCompetencies = [
  {
    icon: <Shield size={22} />,
    title: "Gouvernance & conformité",
    text: "Gestion du SMSI, politiques et procédures, conformité au référentiel national (RGSSI).",
  },
  {
    icon: <Target size={22} />,
    title: "Analyse des risques",
    text: "Identifier, évaluer et traiter les risques au regard de vos enjeux métier.",
  },
  {
    icon: <FileCheck2 size={22} />,
    title: "Audit de sécurité",
    text: "Audits de sécurité et de conformité, fondés sur des preuves.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "Gestion de crise & résilience",
    text: "Préparation aux incidents, appui à la coordination de crise et à la reprise d’activité.",
  },
  {
    icon: <Layers size={22} />,
    title: "Pilotage de projets",
    text: "Programmes de sécurité pilotés de bout en bout : délais, budget, acteurs.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Formation & sensibilisation",
    text: "Formation des équipes informatiques et sensibilisation des collaborateurs.",
  },
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

const contactInterests = [
  "Diagnostic & feuille de route",
  "Audit de sécurité & conformité",
  "Stratégie & feuille de route",
  "Résilience & continuité",
  "RSSI externalisé",
  "Tests d’intrusion",
  "Formation certifiante & personnalisée",
];

function resolveCurrentView(pathname: string): ViewId {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "").trim() as ViewId;
  if (VALID_VIEWS.includes(cleanPath)) return cleanPath;
  const rawHash = window.location.hash.replace(/^#/, "").trim() as ViewId;
  if (VALID_VIEWS.includes(rawHash)) return rawHash;
  return "accueil";
}

function usePageMotion(activeView: ViewId) {
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
      { threshold: 0.1 },
    );

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const target = Number(element.dataset.counter ?? 0);
          const duration = 950;
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
      { threshold: 0.5 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    counters.forEach((counter) => counterObserver.observe(counter));

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, [activeView]);
}

export default function Home() {
  const [location, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<ViewId>(() => resolveCurrentView(location));
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [activeMaturity, setActiveMaturity] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);

  /* État du formulaire de contact (fidèle à YASEE Cybersécurité.html) */
  const [nom, setNom] = useState("");
  const [ent, setEnt] = useState("");
  const [mail, setMail] = useState("");
  const [tel, setTel] = useState("");
  const [ville, setVille] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Diagnostic & feuille de route",
  ]);
  const [msg, setMsg] = useState("");
  const [formError, setFormError] = useState(false);
  const [recapText, setRecapText] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  usePageMotion(currentView);

  useEffect(() => {
    const nextView = resolveCurrentView(location);
    setCurrentView(nextView);
    setMenuOpen(false);
    setDdOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    const onHashChange = () => {
      const nextView = resolveCurrentView(window.location.pathname);
      setCurrentView(nextView);
      setMenuOpen(false);
      setDdOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const navigateTo = (view: ViewId, preselectInterest?: string) => {
    if (preselectInterest && !selectedInterests.includes(preselectInterest)) {
      setSelectedInterests((prev) => [...prev, preselectInterest]);
    }
    const targetPath = view === "accueil" ? "/" : `/${view}`;
    setLocation(targetPath);
    setCurrentView(view);
    setMenuOpen(false);
    setDdOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanNom = nom.trim();
    const cleanEnt = ent.trim();
    const cleanMail = mail.trim();
    if (!cleanNom || !cleanEnt || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanMail)) {
      setFormError(true);
      return;
    }
    setFormError(false);
    const recap =
      `Demande de contact – YASEE Cybersécurité\n\n` +
      `Nom : ${cleanNom}\n` +
      `Entreprise : ${cleanEnt}\n` +
      `E-mail : ${cleanMail}\n` +
      `Téléphone : ${tel.trim() || "—"}\n` +
      `Ville : ${ville.trim() || "—"}\n` +
      `Intérêt : ${selectedInterests.join(", ") || "—"}\n\n` +
      `Message :\n${msg.trim() || "—"}`;
    setRecapText(recap);
  };

  const isServicesActive =
    currentView === "services" || SERVICE_VIEWS.includes(currentView);

  /* =========================================================================
     RENDU D'UNE PAGE SERVICE DÉTAILLÉE (7 pages : Diagnostic, Audit, Stratégie,
     Résilience, RSSI externalisé, Tests d'intrusion, Formation certifiante & personnalisée)
     ========================================================================= */
  const renderServiceDetailPage = (service: ServicePageData) => {
    const otherServiceIds = SERVICE_VIEWS.filter((id) => id !== service.id);
    const serviceWhatsAppUrl =
      "https://wa.me/2250711444588?text=" +
      encodeURIComponent(
        `Bonjour YASEE Cybersécurité, je souhaite demander un échange concernant le service : ${service.title}.`,
      );

    return (
      <div className="page-view" key={service.id}>
        {/* Hero éditorial atmosphérique avec découpe cambrée façon Aegis */}
        <section className="sp-hero-aegis">
          <div className="hero-bg" aria-hidden="true">
            <img src="/hero-team.jpg" alt="" className="hero-photo" />
            <div className="hero-overlay" />
          </div>

          <div className="container sp-hero-inner reveal">
            <nav className="crumb-aegis" aria-label="Fil d’Ariane">
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("services");
                }}
              >
                Nos services
              </a>
              <span aria-hidden="true">/</span>
              <span>{service.category}</span>
            </nav>

            <h1>{service.title}</h1>
            <p className="sp-hero-lead">{service.lead}</p>

            <div className="hero-buttons">
              <a
                className="btn-pill btn-primary"
                href={serviceWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demander un échange
              </a>
              <a
                className="btn-pill btn-outline-light"
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("services");
                }}
              >
                Tous nos services
              </a>
            </div>
          </div>

          <div className="section-cut cut-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 110" fill="none" preserveAspectRatio="none">
              <path
                d="M0 110 L0 92 L960 14 Q1035 6 1110 20 L1440 74 L1440 110 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* Corps éditorial : 2 colonnes aérées sans boîtes IA */}
        <section className="section">
          <div className="container">
            <div className="sp-grid-aegis">
              <div className="sp-left-stack reveal">
                <div className="sp-editorial-block">
                  <span className="eyebrow">Votre contexte</span>
                  <h2>
                    Quand en avez-vous <span className="marker-bar">besoin ?</span>
                  </h2>
                  <ol className="editorial-numbered-list">
                    {service.whenNeeded.map((item, idx) => (
                      <li key={item}>
                        <span className="ed-num">0{idx + 1}</span>
                        <p>{item}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="sp-editorial-block">
                  <span className="eyebrow">Notre intervention</span>
                  <h2>Ce que nous faisons</h2>
                  <ul className="editorial-check-list">
                    {service.whatWeDo.map((item) => (
                      <li key={item}>
                        <span className="icon-circle check" aria-hidden="true">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.vsBox && (
                  <div className="vs-editorial-note">
                    <h3>{service.vsBox.title}</h3>
                    <p>{service.vsBox.p1}</p>
                    <p>{service.vsBox.p2}</p>
                    <a
                      href={`/${service.vsBox.linkTarget}`}
                      className="text-arrow-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(service.vsBox!.linkTarget);
                      }}
                    >
                      {service.vsBox.linkText}
                    </a>
                  </div>
                )}
              </div>

              {/* Colonne droite : Panneau sombre Aegis des livrables */}
              <aside className="getbox-aegis reveal reveal-delay-2">
                <div className="getbox-icon-head">
                  <span className="eyebrow eyebrow-light">Livrables concrets</span>
                  <div className="clean-card-icon">{service.svgIcon}</div>
                </div>
                <h2>Ce que vous recevez</h2>
                <ul className="getbox-list">
                  {service.whatYouGet.map((item) => (
                    <li key={item}>
                      <span className="icon-circle check" aria-hidden="true">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="getbox-benefits">
                  <span className="eyebrow eyebrow-light">Vos bénéfices</span>
                  <ul>
                    {service.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="getbox-actions">
                  <a
                    href="/contact"
                    className="btn-pill btn-primary w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("contact", service.title);
                    }}
                  >
                    Demander ce service
                  </a>
                  <a
                    href={serviceWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-outline-light w-full"
                  >
                    <MessageCircle size={16} />
                    <span>Échangeons</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Démarche en 4 étapes : Ligne architecturale sur fond aux couleurs YASEE */}
        <section className="section sand-section sp-steps-section">
          <div className="section-cut cut-top" aria-hidden="true">
            <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
              <polygon points="0,0 1440,0 1440,52 0,10" fill="#ffffff" />
            </svg>
          </div>

          <div className="container">
            <div className="editorial-steps-intro reveal">
              <h2>Notre démarche en 4 étapes</h2>
            </div>

            <div className="editorial-steps-line reveal">
              {service.steps.map((st, idx) => (
                <div key={st.title} className="editorial-step-col">
                  <span className="ed-step-big-num">0{idx + 1}</span>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bandeau d'appel à l'action */}
        <section className="cta-band-green">
          <div className="container cta-band-inner">
            <div>
              <h2>Parlons de votre situation</h2>
              <p>
                Un premier échange pour comprendre votre contexte et voir si ce service répond à votre besoin.
              </p>
            </div>
            <div className="cta-band-buttons">
              <a
                className="btn-pill btn-white-green"
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("contact", service.title);
                }}
              >
                Nous contacter
              </a>
              <a
                className="btn-pill btn-outline-light"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp direct</span>
              </a>
            </div>
          </div>
        </section>

        {/* Navigation éditoriale vers les autres services */}
        <section className="section others-section">
          <div className="container">
            <div className="others-editorial-bar">
              <span className="eyebrow">Explorer nos autres expertises</span>
              <div className="others-pills">
                {otherServiceIds.map((id) => {
                  const s = ALL_SERVICES[id];
                  return (
                    <a
                      key={id}
                      href={`/${id}`}
                      className="other-pill-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(id);
                      }}
                    >
                      <span>{s.title}</span>
                      <ArrowRight size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="site-shell">
      {/* =====================================================================
          HEADER COLLANT — Navigation multi-pages + WhatsApp derrière le numéro
         ===================================================================== */}
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="brand"
            href="/"
            aria-label="YASEE Cybersécurité, accueil"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("accueil");
            }}
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
            <a
              href="/"
              aria-current={currentView === "accueil" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("accueil");
              }}
            >
              Accueil
            </a>

            <div
              className={`nav-dd ${ddOpen ? "is-open" : ""}`}
              onMouseEnter={() => setDdOpen(true)}
              onMouseLeave={() => setDdOpen(false)}
            >
              <a
                href="/services"
                className={`nav-dd-top ${isServicesActive ? "is-active" : ""}`}
                aria-current={currentView === "services" ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("services");
                }}
              >
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
                <a
                  href="/diagnostic"
                  role="menuitem"
                  aria-current={currentView === "diagnostic" ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("diagnostic");
                  }}
                >
                  Diagnostic &amp; feuille de route
                </a>
                <span className="dd-sep" aria-hidden="true" />
                {CORE_DOMAIN_IDS.map((id) => {
                  const s = ALL_SERVICES[id];
                  return (
                    <a
                      key={id}
                      href={`/${id}`}
                      role="menuitem"
                      aria-current={currentView === id ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(id);
                      }}
                    >
                      {s.title}
                    </a>
                  );
                })}
                <span className="dd-sep" aria-hidden="true" />
                <a
                  href="/tests-intrusion"
                  role="menuitem"
                  aria-current={currentView === "tests-intrusion" ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("tests-intrusion");
                  }}
                >
                  Tests d’intrusion
                </a>
                <a
                  href="/formation"
                  role="menuitem"
                  aria-current={currentView === "formation" ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("formation");
                  }}
                >
                  Formation certifiante &amp; personnalisée
                </a>
              </div>
            </div>

            <a
              href="/a-propos"
              aria-current={currentView === "a-propos" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("a-propos");
              }}
            >
              Qui sommes-nous
            </a>

            <a
              href="/contact"
              aria-current={currentView === "contact" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("contact");
              }}
            >
              Contact
            </a>

            {/* Numéro relié directement à WhatsApp (Todo 1) */}
            <a
              className="header-phone"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Discuter sur WhatsApp : (+225) 07 11 444 588"
            >
              <MessageCircle size={16} className="phone-icon" />
              <span>(+225) 07 11 444 588</span>
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ===================================================================
            VUE 1 : ACCUEIL (#accueil)
           =================================================================== */}
        {currentView === "accueil" && (
          <div className="page-view" key="accueil">
            {/* ÉTAPE 1 : HERO */}
            <section className="hero-section">
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
                    <a
                      className="btn-pill btn-primary"
                      href={WHATSAPP_DIAGNOSTIC_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demander un diagnostic
                    </a>
                    <a
                      className="btn-pill btn-outline-light"
                      href="/services"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo("services");
                      }}
                    >
                      Découvrir nos services
                    </a>
                  </div>
                </div>
              </div>

              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 130" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 130 L0 118 L960 16 Q1035 8 1110 22 L1440 84 L1440 130 Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </section>

            {/* ÉTAPE 2 : QUATRE DOMAINES D'INTERVENTION (Style Aegis "How We Can Help") */}
            <section className="section services-section">
              <div className="container">
                <div className="aegis-split">
                  <div className="aegis-left reveal">
                    <h2 className="aegis-big-heading">
                      <span>COMMENT NOUS</span>
                      <strong>VOUS AIDONS</strong>
                    </h2>
                    <p className="aegis-green-sub">
                      Protéger vos données, vos systèmes et la continuité de vos activités.
                    </p>
                    <p className="aegis-body">
                      En tant qu’entreprise expérimentée et indépendante de cybersécurité, notre mission est de soulager
                      du stress lié à la cybersécurité en offrant des solutions claires, pratiques et adaptées à votre
                      entreprise.
                    </p>
                    <p className="aegis-body">
                      Que vous commenciez tout juste à explorer vos besoins en matière de cybersécurité ou que vous
                      souhaitiez renforcer vos défenses existantes, nous sommes là pour vous soutenir à chaque étape.
                    </p>
                    <div className="aegis-left-links">
                      <a
                        href="/diagnostic"
                        className="text-arrow-link"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("diagnostic");
                        }}
                      >
                        Découvrir notre diagnostic (1er pas) <ArrowRight size={16} />
                      </a>
                      <a
                        href="/services"
                        className="text-arrow-link secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("services");
                        }}
                      >
                        Voir tous nos services <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>

                  {/* 4 cartes sombres épurées qui ouvrent directement la page dédiée du service */}
                  <div className="aegis-cards-grid">
                    {CORE_DOMAIN_IDS.map((id, index) => {
                      const service = ALL_SERVICES[id];
                      const staggerClass = index % 2 === 1 ? "card-offset" : "";
                      return (
                        <a
                          key={service.id}
                          href={`/${service.id}`}
                          className={`aegis-clean-card ${staggerClass} reveal reveal-delay-${(index % 3) + 1}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(service.id);
                          }}
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
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ÉTAPE 3 : POURQUOI LA CYBERSÉCURITÉ VOUS CONCERNE + CONSEIL INDÉPENDANT */}
            <section className="section sand-section">
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
                    La cybersécurité protège vos ordinateurs, vos logiciels et vos données contre le vol, la fraude ou
                    le blocage. Faux e-mails, fraudes au virement, rançongiciels : ces attaques ne visent plus
                    seulement les grandes entreprises.
                  </p>
                </div>

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

                <div className="indep-comparison reveal">
                  <div className="indep-head">
                    <span className="eyebrow">Un conseil indépendant</span>
                    <h3>Nous ne vendons ni logiciel, ni matériel.</h3>
                    <p>
                      Nos recommandations servent uniquement vos intérêts. Vous gardez le choix de vos solutions et de
                      vos fournisseurs.
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

              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 72" fill="none" preserveAspectRatio="none">
                  <polygon points="0,12 1440,68 1440,72 0,72" fill="#091929" />
                </svg>
              </div>
            </section>

            {/* ÉTAPE 4 : OÙ EN EST VOTRE ENTREPRISE ? (5 Niveaux de Maturité) */}
            <section className="section maturity-dark-section">
              <div className="container">
                <div className="maturity-center reveal">
                  <span className="eyebrow eyebrow-light">Diagnostic de maturité</span>
                  <h2>Où en est votre entreprise ?</h2>
                  <p>
                    Notre diagnostic situe votre organisation sur cinq niveaux de maturité, puis trace le chemin vers
                    le niveau suivant.
                  </p>
                </div>

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
                  Indicateur interne d’accompagnement, distinct d’une certification officielle.{" "}
                  <a
                    href="/diagnostic"
                    className="footnote-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("diagnostic");
                    }}
                  >
                    En savoir plus sur le diagnostic →
                  </a>
                </p>

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

              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 84" fill="none" preserveAspectRatio="none">
                  <path d="M0 84 L0 52 Q720 -10 1440 52 L1440 84 Z" fill="#ffffff" />
                </svg>
              </div>
            </section>

            {/* ÉTAPE 5 : POURQUOI YASEE, NOTRE DÉMARCHE & CERTIFICATIONS */}
            <section className="section why-section">
              <div className="container">
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
                      YASEE Cybersécurité accompagne les dirigeants et les équipes informatiques qui veulent protéger
                      leur activité sans se perdre dans la technique.
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

                    <a
                      href="/a-propos"
                      className="text-arrow-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo("a-propos");
                      }}
                    >
                      Découvrir qui nous sommes et nos compétences <ArrowRight size={16} />
                    </a>
                  </div>
                </div>

                <div className="steps-section-block reveal">
                  <div className="editorial-steps-intro">
                    <span className="eyebrow">Notre démarche</span>
                    <h2>Quatre étapes, des résultats concrets</h2>
                  </div>

                  <div className="editorial-steps-line">
                    {homeSteps.map((step) => (
                      <div key={step.number} className="editorial-step-col">
                        <span className="ed-step-big-num">{step.number}</span>
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

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

            {/* Bandeau final d'appel au diagnostic */}
            <section className="cta-band-green">
              <div className="container cta-band-inner">
                <div>
                  <h2>Prêt à faire le point sur votre sécurité ?</h2>
                  <p>
                    Demandez un diagnostic ou échangez directement avec nous sur WhatsApp pour convenir d’un premier
                    rendez-vous.
                  </p>
                </div>
                <div className="cta-band-buttons">
                  <a
                    className="btn-pill btn-white-green"
                    href={WHATSAPP_DIAGNOSTIC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demander un diagnostic
                  </a>
                  <a
                    className="btn-pill btn-outline-light"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp (+225) 07 11 444 588</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            VUE 2 : NOS SERVICES — Vue d'ensemble (/services)
           =================================================================== */}
        {currentView === "services" && (
          <div className="page-view" key="services">
            <section className="sp-hero-aegis">
              <div className="hero-bg" aria-hidden="true">
                <img src="/hero-team.jpg" alt="" className="hero-photo" />
                <div className="hero-overlay" />
              </div>

              <div className="container sp-hero-inner reveal">
                <span className="hero-eyebrow">Nos services</span>
                <h1>Un premier pas simple, puis un accompagnement à votre rythme</h1>
                <p className="sp-hero-lead">
                  Tout commence par un diagnostic. Selon vos priorités, nous vous accompagnons ensuite sur un ou
                  plusieurs domaines.
                </p>
              </div>
              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 110" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 110 L0 92 L960 14 Q1035 6 1110 20 L1440 74 L1440 110 Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </section>

            {/* Premier pas : Diagnostic + Nos 4 domaines en split Aegis */}
            <section className="section">
              <div className="container">
                {/* Bloc éditorial Votre Premier Pas */}
                <a
                  href="/diagnostic"
                  className="featured-diag-banner reveal"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("diagnostic");
                  }}
                >
                  <div className="featured-diag-left">
                    <span className="eyebrow eyebrow-light">Votre premier pas</span>
                    <h2>Diagnostic de cybersécurité &amp; feuille de route</h2>
                    <p>
                      Une vue claire de votre niveau de sécurité sur 5 niveaux de maturité et des actions à engager en
                      priorité. Sur site à Abidjan ou à distance.
                    </p>
                    <span className="featured-diag-cta">
                      Découvrir le diagnostic <ArrowRight size={17} />
                    </span>
                  </div>
                  <div className="featured-diag-icon" aria-hidden="true">
                    {ServiceIcons.diagnostic}
                  </div>
                </a>

                {/* Split Aegis : Texte à gauche + 4 cartes sombres décalées à droite */}
                <div className="aegis-split services-page-split">
                  <div className="aegis-left reveal">
                    <span className="eyebrow">Cœur de métier</span>
                    <h2 className="aegis-big-heading">
                      <span>Nos domaines</span>
                      <strong>d’intervention</strong>
                    </h2>
                    <p className="aegis-green-sub">
                      Un accompagnement indépendant, proportionné à vos enjeux et à vos moyens.
                    </p>
                    <p className="aegis-body">
                      Chaque domaine fait l’objet d’une démarche structurée, de livrables lisibles par la direction et
                      d’un suivi concret dans la durée. Cliquez sur un domaine pour découvrir le détail de notre
                      intervention.
                    </p>
                  </div>

                  <div className="aegis-cards-grid">
                    {CORE_DOMAIN_IDS.map((id, index) => {
                      const s = ALL_SERVICES[id];
                      const staggerClass = index % 2 === 1 ? "card-offset" : "";
                      return (
                        <a
                          key={s.id}
                          href={`/${s.id}`}
                          className={`aegis-clean-card ${staggerClass} reveal reveal-delay-${(index % 3) + 1}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(s.id);
                          }}
                        >
                          <div className="clean-card-icon">{s.svgIcon}</div>
                          <div className="clean-card-bottom">
                            <div>
                              <h3>
                                {s.cardLines[0]}
                                <br />
                                {s.cardLines[1]}
                              </h3>
                              <span className="clean-card-deliv">{s.deliverable}</span>
                            </div>
                            <span className="clean-card-arrow" aria-hidden="true">
                              <ChevronRight size={17} />
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Autres services sur fond sablé avec découpe cambrée */}
            <section className="section sand-section sp-steps-section">
              <div className="section-cut cut-top" aria-hidden="true">
                <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
                  <polygon points="0,0 1440,0 1440,52 0,10" fill="#ffffff" />
                </svg>
              </div>

              <div className="container">
                <div className="aegis-split">
                  <div className="aegis-left reveal">
                    <span className="eyebrow">Expertises complémentaires</span>
                    <h2 className="aegis-big-heading">
                      <span>Autres</span>
                      <strong>services</strong>
                    </h2>
                    <p className="aegis-body">
                      Pour tester la résistance réelle de vos applications ou faire monter vos équipes en compétence
                      avec des programmes certifiants ou sur mesure.
                    </p>
                  </div>

                  <div className="aegis-cards-grid">
                    {OTHER_SERVICE_IDS.map((id, idx) => {
                      const s = ALL_SERVICES[id];
                      const staggerClass = idx % 2 === 1 ? "card-offset" : "";
                      return (
                        <a
                          key={s.id}
                          href={`/${s.id}`}
                          className={`aegis-clean-card ${staggerClass} reveal reveal-delay-${idx + 1}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(s.id);
                          }}
                        >
                          <div className="clean-card-icon">{s.svgIcon}</div>
                          <div className="clean-card-bottom">
                            <div>
                              <h3>
                                {s.cardLines[0]}
                                <br />
                                {s.cardLines[1]}
                              </h3>
                              <span className="clean-card-deliv">{s.deliverable}</span>
                            </div>
                            <span className="clean-card-arrow" aria-hidden="true">
                              <ChevronRight size={17} />
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            VUES 3 à 9 : LES 7 PAGES DE SERVICES DÉTAILLÉES
           =================================================================== */}
        {SERVICE_VIEWS.includes(currentView) && renderServiceDetailPage(ALL_SERVICES[currentView])}

        {/* ===================================================================
            VUE 10 : QUI SOMMES-NOUS (/a-propos)
           =================================================================== */}
        {currentView === "a-propos" && (
          <div className="page-view" key="a-propos">
            <section className="sp-hero-aegis">
              <div className="hero-bg" aria-hidden="true">
                <img src="/about-team.jpg" alt="" className="hero-photo" />
                <div className="hero-overlay" />
              </div>

              <div className="container sp-hero-inner reveal">
                <span className="hero-eyebrow">Qui sommes-nous</span>
                <h1>YASEE Cybersécurité, le pôle conseil en cybersécurité de YASEE IT</h1>
                <p className="sp-hero-lead">
                  Nous accompagnons les dirigeants et les équipes informatiques qui veulent protéger leur activité sans
                  se perdre dans la technique. Notre rôle : traduire les risques numériques en décisions claires, puis
                  aider à les mettre en œuvre.
                </p>
              </div>
              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 110" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 110 L0 92 L960 14 Q1035 6 1110 20 L1440 74 L1440 110 Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </section>

            {/* Split éditorial : Photo + 3 engagements séparés par de fines lignes (zéro boîte IA) */}
            <section className="section">
              <div className="container">
                <div className="about-top-split">
                  <div className="why-photo-wrap reveal">
                    <img
                      src="/about-team.jpg"
                      alt="Consultants YASEE Cybersécurité à Abidjan"
                      className="why-photo"
                    />
                  </div>

                  <div className="about-editorial-copy reveal reveal-delay-2">
                    <span className="eyebrow">Notre approche</span>
                    <h2>
                      Une expertise <span className="marker-bar">proche de vous</span> et indépendante
                    </h2>
                    <div className="about-hairline-list">
                      {aboutValues.map((val, idx) => (
                        <div key={val.title} className="about-hairline-row">
                          <span className="ed-num">0{idx + 1}</span>
                          <div>
                            <h3>{val.title}</h3>
                            <p>{val.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Nos compétences : Grille typographique architecturale (zéro petite boîte d'icône IA) */}
            <section className="section sand-section">
              <div className="section-cut cut-top" aria-hidden="true">
                <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
                  <polygon points="0,0 1440,0 1440,52 0,10" fill="#ffffff" />
                </svg>
              </div>

              <div className="container">
                <div className="editorial-steps-intro reveal">
                  <span className="eyebrow">Nos compétences</span>
                  <h2>
                    13 ans d’expérience en systèmes d’information et{" "}
                    <span className="marker-bar">cybersécurité</span>
                  </h2>
                </div>

                <div className="editorial-competencies-grid reveal">
                  {aboutCompetencies.map((comp, idx) => (
                    <div key={comp.title} className="editorial-comp-item">
                      <span className="ed-num">0{idx + 1}</span>
                      <h3>{comp.title}</h3>
                      <p>{comp.text}</p>
                    </div>
                  ))}
                </div>

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

            <section className="cta-band-green">
              <div className="container cta-band-inner">
                <div>
                  <h2>Parlons de vos enjeux de cybersécurité</h2>
                  <p>
                    Un premier échange pour comprendre votre contexte et identifier les actions utiles.
                  </p>
                </div>
                <div className="cta-band-buttons">
                  <a
                    className="btn-pill btn-white-green"
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("contact");
                    }}
                  >
                    Nous contacter
                  </a>
                  <a
                    className="btn-pill btn-outline-light"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp direct</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            VUE 11 : CONTACT (/contact)
           =================================================================== */}
        {currentView === "contact" && (
          <div className="page-view" key="contact">
            <section className="sp-hero-aegis">
              <div className="hero-bg" aria-hidden="true">
                <img src="/hero-team.jpg" alt="" className="hero-photo" />
                <div className="hero-overlay" />
              </div>

              <div className="container sp-hero-inner reveal">
                <span className="hero-eyebrow">Contact</span>
                <h1>Demander un diagnostic ou un premier échange</h1>
                <p className="sp-hero-lead">
                  Décrivez-nous votre situation en quelques lignes. Nous revenons vers vous pour convenir d’un
                  rendez-vous.
                </p>
              </div>
              <div className="section-cut cut-bottom" aria-hidden="true">
                <svg viewBox="0 0 1440 110" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 110 L0 92 L960 14 Q1035 6 1110 20 L1440 74 L1440 110 Z"
                    fill="#091929"
                  />
                </svg>
              </div>
            </section>

            <section className="section contact-clean-section contact-page-body">
              <div className="container">
                <div className="contact-clean-layout">
                  {/* Colonne gauche : Coordonnées directes avec WhatsApp derrière le numéro */}
                  <div className="contact-info-col reveal">
                    <span className="eyebrow eyebrow-light">Coordonnées directes</span>
                    <h2>Échangeons en toute confidentialité</h2>
                    <p className="contact-sub">
                      Vous pouvez nous écrire via le formulaire ou nous joindre directement sur WhatsApp ou par e-mail.
                    </p>

                    <div className="contact-direct-list">
                      <div className="direct-item-with-copy">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="direct-item-main"
                        >
                          <span className="direct-icon">
                            <MessageCircle size={20} />
                          </span>
                          <div>
                            <small>WhatsApp &amp; Téléphone</small>
                            <strong>(+225) 07 11 444 588</strong>
                            <span>Cliquez pour ouvrir WhatsApp</span>
                          </div>
                        </a>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => copyToClipboard("(+225) 07 11 444 588", "tel")}
                        >
                          <Copy size={13} />
                          <span>{copiedKey === "tel" ? "Copié" : "Copier"}</span>
                        </button>
                      </div>

                      <div className="direct-item-with-copy">
                        <a href="mailto:info@yasee-it.ci" className="direct-item-main">
                          <span className="direct-icon">
                            <Mail size={20} />
                          </span>
                          <div>
                            <small>E-mail</small>
                            <strong>info@yasee-it.ci</strong>
                            <span>Réponse rapide sous 24h ouvrées</span>
                          </div>
                        </a>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => copyToClipboard("info@yasee-it.ci", "mail")}
                        >
                          <Copy size={13} />
                          <span>{copiedKey === "mail" ? "Copié" : "Copier"}</span>
                        </button>
                      </div>

                      <div className="direct-item">
                        <span className="direct-icon">
                          <MapPin size={20} />
                        </span>
                        <div>
                          <small>Basés à</small>
                          <strong>Abidjan, Côte d’Ivoire</strong>
                          <span>Interventions sur site ou à distance.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite : Formulaire complet & épuré */}
                  <div className="contact-card-col reveal reveal-delay-2">
                    {recapText ? (
                      <div className="contact-success" role="status" aria-live="polite">
                        <div className="success-circle">
                          <Check size={26} />
                        </div>
                        <h3>Votre demande est prête</h3>
                        <p>
                          Vous pouvez envoyer ce récapitulatif directement sur notre WhatsApp en un clic, par e-mail à{" "}
                          <strong>info@yasee-it.ci</strong>, ou le copier.
                        </p>
                        <textarea
                          className="recap-textarea"
                          value={recapText}
                          readOnly
                          rows={8}
                        />
                        <div className="recap-actions">
                          <a
                            href={`https://wa.me/2250711444588?text=${encodeURIComponent(recapText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill btn-primary"
                          >
                            <MessageCircle size={16} />
                            <span>Envoyer sur WhatsApp</span>
                          </a>
                          <button
                            type="button"
                            className="btn-pill btn-secondary-dark"
                            onClick={() => copyToClipboard(recapText, "recap")}
                          >
                            <Copy size={15} />
                            <span>
                              {copiedKey === "recap" ? "Récapitulatif copié !" : "Copier le récapitulatif"}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="text-reset-btn"
                            onClick={() => setRecapText(null)}
                          >
                            Modifier la demande
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form className="clean-form" onSubmit={handleContactSubmit} noValidate>
                        <h3>Envoyez-nous votre demande</h3>

                        <div className="clean-form-row">
                          <label htmlFor="f-nom">
                            Nom et prénom *
                            <input
                              id="f-nom"
                              type="text"
                              autoComplete="name"
                              value={nom}
                              onChange={(e) => setNom(e.target.value)}
                              placeholder="Votre nom et prénom"
                              required
                            />
                          </label>
                          <label htmlFor="f-ent">
                            Entreprise *
                            <input
                              id="f-ent"
                              type="text"
                              autoComplete="organization"
                              value={ent}
                              onChange={(e) => setEnt(e.target.value)}
                              placeholder="Nom de votre organisation"
                              required
                            />
                          </label>
                        </div>

                        <div className="clean-form-row">
                          <label htmlFor="f-mail">
                            E-mail professionnel *
                            <input
                              id="f-mail"
                              type="email"
                              autoComplete="email"
                              value={mail}
                              onChange={(e) => setMail(e.target.value)}
                              placeholder="vous@entreprise.ci"
                              required
                            />
                          </label>
                          <label htmlFor="f-tel">
                            Téléphone / WhatsApp
                            <input
                              id="f-tel"
                              type="tel"
                              autoComplete="tel"
                              value={tel}
                              onChange={(e) => setTel(e.target.value)}
                              placeholder="(+225) 07 00 00 00 00"
                            />
                          </label>
                        </div>

                        <label htmlFor="f-ville">
                          Ville
                          <input
                            id="f-ville"
                            type="text"
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                            placeholder="Abidjan, Bouaké, San Pedro…"
                          />
                        </label>

                        <div className="interests-group">
                          <span className="interests-label">Ce qui vous intéresse</span>
                          <div className="interests-chips">
                            {contactInterests.map((item) => {
                              const active = selectedInterests.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  className={`interest-chip ${active ? "is-selected" : ""}`}
                                  onClick={() => toggleInterest(item)}
                                  aria-pressed={active}
                                >
                                  {active && <Check size={13} />}
                                  <span>{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <label htmlFor="f-msg">
                          Votre message
                          <textarea
                            id="f-msg"
                            rows={4}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Votre activité, votre besoin, vos échéances…"
                          />
                        </label>

                        {formError && (
                          <p className="form-err-msg" role="alert">
                            Merci d’indiquer votre nom, votre entreprise et une adresse e-mail valide.
                          </p>
                        )}

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
          </div>
        )}
      </main>

      {/* =====================================================================
          FOOTER — Navigation vers toutes les pages + WhatsApp derrière le numéro
         ===================================================================== */}
      <footer className="site-footer">
        <div className="container footer-wrap">
          <div className="footer-brand-stack">
            <a
              className="brand"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("accueil");
              }}
            >
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
              <li>
                <a
                  href="/diagnostic"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("diagnostic");
                  }}
                >
                  Diagnostic &amp; feuille de route
                </a>
              </li>
              <li>
                <a
                  href="/audit"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("audit");
                  }}
                >
                  Audit de sécurité &amp; conformité
                </a>
              </li>
              <li>
                <a
                  href="/strategie"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("strategie");
                  }}
                >
                  Stratégie &amp; feuille de route
                </a>
              </li>
              <li>
                <a
                  href="/resilience"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("resilience");
                  }}
                >
                  Résilience &amp; continuité
                </a>
              </li>
              <li>
                <a
                  href="/rssi-externalise"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("rssi-externalise");
                  }}
                >
                  RSSI externalisé
                </a>
              </li>
              <li>
                <a
                  href="/tests-intrusion"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("tests-intrusion");
                  }}
                >
                  Tests d’intrusion
                </a>
              </li>
              <li>
                <a
                  href="/formation"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("formation");
                  }}
                >
                  Formation certifiante &amp; personnalisée
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <b>Contact</b>
            <ul>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-wa-link"
                >
                  <MessageCircle size={14} />
                  <span>(+225) 07 11 444 588</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@yasee-it.ci">info@yasee-it.ci</a>
              </li>
              <li>Abidjan, Côte d’Ivoire</li>
              <li>
                <a
                  href={LINKEDIN_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-linkedin-link"
                  aria-label="Profil LinkedIn YASEE Cybersécurité"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="/a-propos"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("a-propos");
                  }}
                >
                  Qui sommes-nous
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-legal">© YASEE IT · yasee-it.ci</div>
        </div>
      </footer>
    </div>
  );
}
