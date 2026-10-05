import { Boxes, ChartNoAxesCombined, Code2, Layers3, ScanLine, Workflow } from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'Web applications',
    description: 'Custom web applications designed around your business workflow.',
    detail: 'Custom digital workspaces, built around the way your business runs.',
    icon: Code2,
    visual: Layers3,
    accent: 'mint',
    tag: 'WEB SYSTEMS',
  },
  {
    number: '02',
    title: 'POS software',
    description: 'Reliable POS solutions that simplify sales, inventory and business operations.',
    detail: 'Sales, inventory and payments—working together in real time.',
    icon: ScanLine,
    visual: ChartNoAxesCombined,
    accent: 'violet',
    tag: 'POINT OF SALE',
  },
  {
    number: '03',
    title: 'Business automation',
    description: 'Smart digital systems that reduce manual work and improve efficiency.',
    detail: 'Connected workflows that make the right work happen automatically.',
    icon: Workflow,
    visual: Boxes,
    accent: 'blue',
    tag: 'CONNECTED WORKFLOWS',
  },
];

export default services;
