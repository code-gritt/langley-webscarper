import {
  people01,
  people02,
  people03,
  facebook,
  instagram,
  linkedin,
  twitter,
  airbnb,
  binance,
  coinbase,
  dropbox,
  send,
  shield,
  star,
} from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Platform",
  },
  {
    id: "clients",
    title: "Clients",
  },
  { id: "create-job", title: "Create Job" },
];

export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "Smart Workflows",
    content:
      "Easily define scraping rules and automate tasks with our visual setup tools.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Secure & Reliable",
    content:
      "Your data and jobs are protected with best practices for security and compliance.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Fast Exports",
    content:
      "Download your results instantly in CSV or JSON, or connect via API for automation.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Langley made scraping simple. I set up a daily job for product prices in minutes, no coding needed.",
    name: "Herman Jensen",
    title: "E-commerce Analyst",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "The credit system is perfect. I only pay for what I use and can scale up whenever my projects grow.",
    name: "Steve Mark",
    title: "Startup Founder",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "Scheduling scrapes saved my team hours of manual work. The results export cleanly every time.",
    name: "Kenn Gallagher",
    title: "Research Manager",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Active Users",
    value: "3,800+",
  },
  {
    id: "stats-2",
    title: "Trusted by Teams",
    value: "230+",
  },
  {
    id: "stats-3",
    title: "Jobs Run",
    value: "1M+",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Overview",
        link: "https://www.Langley.com/overview/",
      },
      {
        name: "How it Works",
        link: "https://www.Langley.com/how-it-works/",
      },
      {
        name: "Create Job",
        link: "https://www.Langley.com/create/",
      },
      {
        name: "Explore Use Cases",
        link: "https://www.Langley.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.Langley.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.Langley.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.Langley.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.Langley.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.Langley.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.Langley.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partners",
        link: "https://www.Langley.com/our-partners/",
      },
      {
        name: "Become a Partner",
        link: "https://www.Langley.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: airbnb,
  },
  {
    id: "client-2",
    logo: binance,
  },
  {
    id: "client-3",
    logo: coinbase,
  },
  {
    id: "client-4",
    logo: dropbox,
  },
];
