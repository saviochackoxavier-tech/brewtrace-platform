export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  {
    label: 'Origin Beans',
    children: [
      { to: '/beans/manifesto', label: 'Manifesto' },
      { to: '/beans/ethiopia', label: 'Ethiopia Yirgacheffe' },
      { to: '/beans/kenya', label: 'Kenya Kahawa' },
      { to: '/beans/colonia', label: 'Colombia Huila' },
      { to: '/beans/sumatra', label: 'Sumatra Mandheling' },
    ],
  },
  {
    label: 'Operations',
    children: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/inventory', label: 'Inventory' },
      { to: '/sourcing', label: 'Sourcing' },
      { to: '/orders', label: 'Wholesale Orders' },
      { to: '/export/overview.csv', label: 'CSV Export' },
    ],
  },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/cookies', label: 'Cookie Policy' },
  { to: '/ethics', label: 'Sourcing Disclosures' },
  { to: '/checkout', label: 'Pay Online' },
];
