import {themes} from 'prism-react-renderer';

const config = {
  title: 'Visual Plan Construct Language',
  tagline: 'A visual language for teaching and learning programming.',
  favicon: 'img/favicon.ico',
  url: 'https://vpcl.vercel.app',
  baseUrl: '/',
  organizationName: 'vpcl',
  projectName: 'vpc-website',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/alex42837405/VPCL/tree/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'VPCL',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/alex42837405/VPCL',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'VPCL Phases',
              to: '/docs/vpcl-overview',
            },
            {
              label: 'Language Library',
              to: '/docs/language-construct-library',
            },
          ],
        },
        {
          title: 'Research',
          items: [
            {
              label: 'Original Paper',
              href: 'https://www.sciencedirect.com/science/article/pii/1045926X9290021D',
            },
            {
              label: 'Patent',
              href: 'https://patents.google.com/patent/US20060179420A1',
            },
          ],
        },
      ],
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['pascal', 'c', 'java'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
};

export default config;