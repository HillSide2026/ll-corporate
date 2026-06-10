import { granville } from './granville';

export const homepage = {
  navigation: {
    links: [
      { text: 'Platform', href: '/#platform' },
      { text: 'Infrastructure', href: '/#payments' },
      { text: 'Contact', href: '/#contact' },
    ],
    primaryAction: {
      text: 'Request Access',
      href: granville.requestAccessUrl,
    },
  },
  hero: {
    tagline: 'Exclusive Platform',
    title: 'Corporate & Financial Services Knowledge for Innovative Businesses',
    subtitle: 'The Levine Law platform provides legal knowledge infrastructure for [clients].',
    primaryAction: {
      text: 'Request Access',
      href: granville.requestAccessUrl,
    },
    secondaryAction: {
      text: 'Discover Platform',
      href: '/#platform',
    },
    highlights: [],
  },
  products: {
    tagline: 'Platform',
    title: 'A Unified Platform for Legal and Regulatory Insight.',
    subtitle: '',
    items: [
      {
        title: 'Corporate Structure',
        description:
          'Build and maintain legal structures that support financing, growth, governance, and long-term operational stability.',
        icon: 'tabler:building',
      },
      {
        title: 'Regulatory Positioning',
        description:
          'Understand how your business model interacts with established and emerging regulatory frameworks.',
        icon: 'tabler:scale',
      },
      {
        title: 'Contract Architecture',
        description:
          'Align customer, vendor, platform, and commercial agreements into a coherent legal system that scales with the business.',
        icon: 'tabler:file-text',
      },
    ],
  },
  operatingModel: {
    tagline: 'LEGAL INFRASTRUCTURE',
    title: 'Build Infrastructure that Facilitates Growth',
    subtitle:
      'Levine Law helps businesses develop and implement legal playbooks so that the entire page is on the same page.',
    contentTitle: 'Built for Operators and Growth',
    contentBody:
      'Create legal systems that support growth, reduce friction, and improve organizational readiness as complexity increases.',
    items: [
      {
        title: 'Corporate Health',
        description:
          'Assess governance, ownership, shareholder alignment, and corporate structure before issues emerge.',
      },
      {
        title: 'Contract Systems',
        description:
          'Review agreement ecosystems for inconsistency, risk allocation gaps, and operational misalignment.',
      },
      {
        title: 'Regulatory Awareness',
        description:
          'Evaluate how money, decisions, and risk move through the business—and whether legal structures reflect operational reality.',
      },
    ],
  },
  company: {
    title: 'About Levine Law',
    items: [
      {
        title: 'Insights',
        description: 'Analysis and observations on corporate structure, governance, and financing.',
        icon: 'tabler:briefcase',
      },
      {
        title: 'News',
        description: 'Stay informed with firm updates, service developments, and industry trends',
        icon: 'tabler:news',
      },
    ],
  },
  closing: {
    tagline: 'CONTACT',
    title: 'Click to Request Access Now',
    subtitle: 'For a limited time, access the Levine Law now even if you are not yet a client',
    primaryAction: {
      text: 'Request access',
      href: granville.requestAccessUrl,
    },
    secondaryAction: {
      text: 'Contact Us',
      href: '/sign-up',
    },
  },
} as const;
