import { granville } from './data/granville';

export const headerData = {
  links: [],
  actions: [{ text: 'Request access', href: granville.requestAccessUrl }],
};

export const footerData = {
  links: [
    {
      title: 'Navigation',
      links: [
        { text: 'Home', href: '/' },
        { text: 'Client Portal', href: '/#client-portal' },
        { text: 'Request Access', href: granville.requestAccessUrl },
        { text: 'Sign In', href: '/sign-in' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    {
      text: '<span class="sr-only">LinkedIn</span>',
      href: granville.linkedinUrl,
      ariaLabel: 'LinkedIn',
      icon: 'tabler:brand-linkedin',
      target: '_blank',
    },
  ],
  description: 'Corporate governance and financial services counsel to valued clients.',
  footNote: 'Levine Law. Toronto, Ontario.',
};
