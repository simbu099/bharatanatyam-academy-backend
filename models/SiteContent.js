import mongoose from 'mongoose';

// Singleton document holding admin-editable landing page copy. Every
// field has a sensible default matching the original hardcoded design,
// so the site renders correctly even before an admin makes any edits.
const siteContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: 'ESTABLISHED 2001 • KALAKSHETRA BANI LINEAGE' },
      headline: { type: String, default: 'Preserving the Sacred Geometry of Classical Dancing' },
      headlineHighlight: { type: String, default: 'Sacred Geometry' },
      description: {
        type: String,
        default:
          'Immerse yourself in authentic classical dance education, footwork precision (Araimandi), and deep spiritual storytelling (Abhinaya) under the direct tutelage of Guru Smt. Jothi.',
      },
      primaryCtaText: { type: String, default: 'Apply & Book Slot' },
      secondaryCtaText: { type: String, default: 'Request Troupe Show' },
      backgroundImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=1920',
      },
      sideImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600',
      },
      stats: {
        type: [
          {
            value: { type: String, default: '' },
            label: { type: String, default: '' },
          },
        ],
        default: [
          { value: '1,500+', label: 'Graduated Disciples' },
          { value: '25+', label: 'Years Teaching Legacy' },
          { value: '100+', label: 'Solo Arangetrams' },
          { value: '400+', label: 'Global Concerts' },
        ],
      },
    },
    about: {
      photo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      },
      quote: {
        type: String,
        default: 'Dance is not merely body movement; it is the visual offering of the soul to the Divine Rhythm (Talam).',
      },
      bioParagraph1: {
        type: String,
        default:
          'Trained from the tender age of five under the legendary doyens of Kalakshetra and Tanjore Pandanallur Banis, Smt. Jothi embodies over 25 years of performance excellence and pedagogical mastery.',
      },
      bioParagraph2: {
        type: String,
        default:
          'Her teaching methodology rigorously balances Nritta (pure technical footwork & Araimandi posture) with the intricate emotional depth of Abhinaya (expression). Under her tutelage, over 100 disciples have successfully performed their debut solo Arangetrams.',
      },
      message: {
        type: String,
        default:
          "My mission through Jothi's is to nurture not just skilled dancers, but cultured individuals rooted in Indian classical aesthetics, discipline, and devotion.",
      },
    },
    contact: {
      address: { type: String, default: '#42, Temple Road, Mylapore, Chennai, Tamil Nadu - 600004, India' },
      phone: { type: String, default: '+91 98400 12345 / +91 44 2490 8899' },
      email: { type: String, default: 'admissions@natyabharati.com' },
    },
  },
  { timestamps: true }
);

const SiteContent = mongoose.model('SiteContent', siteContentSchema);

export default SiteContent;
