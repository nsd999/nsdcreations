export type PricingPeriod = "" | "/month";
export type PricingPrefix = "Starting from" | "Fixed Price" | "Custom Quote";

export interface ServicePackage {
  name: string;
  price: string;
  isPopular?: boolean;
  features: string[];
  idealFor?: string;
}

export interface ServiceAddOn {
  name: string;
  price: string;
}

export interface ServiceProcess {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ServiceDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categoryGroup: "Creative" | "Brand & Marketing" | "Automation" | "Technology";
  startingPrice: string;
  currency: string;
  pricingPrefix: PricingPrefix;
  pricingPeriod: PricingPeriod;
  packages: ServicePackage[];
  features: string[];
  addOns?: ServiceAddOn[];
  process: ServiceProcess[];
  faqs: ServiceFAQ[];
  seo: ServiceSEO;
  iconName: string;
}

export const servicesData: ServiceDetail[] = [
  // -----------------------------------------------------
  // CATEGORY 1: AI CREATIVE & VIDEO PRODUCTION (Creative)
  // -----------------------------------------------------
  {
    id: "ai-video-advertisements",
    slug: "ai-video-advertisements",
    name: "AI Video Advertisements",
    shortDescription: "High-retention social commercials that drive conversions.",
    longDescription: "In a digital-first era, static images no longer convert. Our AI Video Advertisements service combines raw creative direction with modern AI generation models to deliver cinematic-quality social ads. Ideal for Instagram Reels, YouTube Shorts, and Facebook Ads campaigns.",
    category: "AI Creative & Video Production",
    categoryGroup: "Creative",
    startingPrice: "4,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "video",
    packages: [
      {
        name: "Starter",
        price: "₹4,999",
        idealFor: "Best for individuals",
        features: [
          "15–20 second video",
          "AI-generated scenes",
          "Basic script",
          "AI voice",
          "Background music",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹9,999",
        idealFor: "Best for growing businesses",
        features: [
          "30–45 second video",
          "Multiple AI scenes",
          "Professional script",
          "AI voiceover",
          "Sound design",
          "Captions",
          "2 revisions",
          "Social media formats"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹19,999+",
        idealFor: "Best for brands & campaigns",
        features: [
          "45–90 second production",
          "Cinematic storytelling",
          "Advanced AI scenes",
          "Product integration",
          "Premium voice",
          "Advanced editing",
          "Multiple formats"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Custom Direct-Response Scripts",
      "Cinematic AI Visual Generation",
      "Professional Synthetic Voiceovers",
      "Multi-Lingual Capabilities",
      "Optimized Formats (9:16 & 16:9)",
      "High-Retention Editing"
    ],
    addOns: [
      { name: "Extra revision", price: "Custom Quote" },
      { name: "Additional language", price: "Custom Quote" },
      { name: "Rush delivery", price: "Custom Quote" }
    ],
    process: [
      { title: "Scriptwriting & Copy", description: "Crafting a killer direct-response video script focusing on hooks." },
      { title: "AI Generation", description: "Generating cinematic AI assets curated to your brand." },
      { title: "Audio & Editing", description: "Integrating voiceovers, tracks, sound effects, and typography." },
      { title: "Review & Delivery", description: "Refining visual timing and exporting the final commercial." }
    ],
    faqs: [
      { question: "How long does it take?", answer: "Standard delivery is typically 3-5 business days depending on complexity." },
      { question: "How many revisions are included?", answer: "Depending on the package, 1 or 2 rounds of revisions are included. Additional revisions are available as an add-on." },
      { question: "Can we use different languages?", answer: "Yes, our synthetic voiceovers support multiple regional and international languages." },
      { question: "How do I start?", answer: "Simply click 'Get a Quote' and tell us about your brand, product, and target audience." }
    ],
    seo: {
      title: "AI Video Advertisement Pricing | NSD Creations",
      description: "Explore AI video advertisement pricing from NSD Creations. Create professional AI-powered promotional videos for businesses, brands and campaigns.",
      keywords: ["AI video ads", "social media commercials", "AI video production pricing", "video advertisements india"]
    }
  },
  {
    id: "ai-product-commercials",
    slug: "ai-product-commercials",
    name: "AI Product Commercials",
    shortDescription: "Virtual product launches and elegant brand visuals.",
    longDescription: "Launch products without setting up expensive photography stages. We build hyper-realistic AI product advertisements combining generative image tools with modern 3D projection to render your physical product in any setting imaginable.",
    category: "AI Creative & Video Production",
    categoryGroup: "Creative",
    startingPrice: "7,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "tv",
    packages: [
      {
        name: "Starter",
        price: "₹7,999",
        idealFor: "Best for individual products",
        features: [
          "Standard product environments",
          "High-fidelity renders",
          "Basic motion",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹14,999",
        idealFor: "Best for product lines",
        features: [
          "Premium product environments",
          "Advanced dynamic lighting",
          "Voiceover & music",
          "2 revisions",
          "Social formats"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹29,999+",
        idealFor: "Best for major launches",
        features: [
          "AI product environments",
          "Cinematic product shots",
          "Product storytelling",
          "Motion",
          "Voiceover",
          "Sound design",
          "CTA",
          "Multiple social formats"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Zero physical logistics cost",
      "Photorealistic virtual lighting",
      "Dynamic camera motion",
      "Brand-accurate label preservation",
      "High-resolution social exports"
    ],
    addOns: [
      { name: "Extra format", price: "Custom Quote" },
      { name: "Additional product variations", price: "Custom Quote" }
    ],
    process: [
      { title: "Product Analysis", description: "Studying your product geometry, labels, and core sales hooks." },
      { title: "Virtual Lighting & Framing", description: "Placing your product in premium, eye-catching virtual sets." },
      { title: "Motion & Editing", description: "Adding cinematic camera motion, voiceovers, and sound design." },
      { title: "Delivery", description: "Exporting high-fidelity video files ready for distribution." }
    ],
    faqs: [
      { question: "Can I use these for physically small products?", answer: "Absolutely! E-commerce products like cosmetics, jewelry, gadgets, and beverages are perfect candidates." },
      { question: "Is the branding preserved accurately?", answer: "Yes, we use advanced masking to ensure your exact logos and typography remain crystal-clear." },
      { question: "How long does it take?", answer: "Usually 5-7 business days based on the package selected." },
      { question: "Can the service be customised?", answer: "Yes, our Premium package offers full flexibility for custom storytelling and environments." }
    ],
    seo: {
      title: "AI Product Commercials Pricing | NSD Creations",
      description: "Get hyper-realistic AI product commercials without expensive photo shoots. View pricing and packages from NSD Creations.",
      keywords: ["AI product video", "virtual product commercial", "product video pricing", "ecommerce video ads"]
    }
  },
  {
    id: "ai-ugc-advertisement-videos",
    slug: "ai-ugc-advertisement-videos",
    name: "AI UGC Advertisement Videos",
    shortDescription: "High-converting UGC powered by digital creators.",
    longDescription: "Connect with your audience using relatable, high-trust User Generated Content (UGC) videos synthesized with photorealistic AI actors. No costly creator sourcing or usage rights fees required.",
    category: "AI Creative & Video Production",
    categoryGroup: "Creative",
    startingPrice: "4,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "smartphone",
    packages: [
      {
        name: "Starter",
        price: "₹4,999",
        idealFor: "Best for single-channel ads",
        features: [
          "1 AI creator persona",
          "Up to 30 seconds",
          "Script writing",
          "Native captions",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹9,999",
        idealFor: "Best for scaling ad accounts",
        features: [
          "1-2 AI creator personas",
          "Up to 60 seconds",
          "A/B testing hooks",
          "Advanced script strategy",
          "2 revisions"
        ],
        isPopular: true,
      },
      {
        name: "Campaign",
        price: "₹19,999+",
        idealFor: "Best for multi-channel campaigns",
        features: [
          "Multiple hooks",
          "Multiple scripts",
          "Multiple characters",
          "Multiple variations",
          "Multiple languages",
          "Campaign creatives"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Photorealistic AI Actors",
      "Native Social Media Editing",
      "Direct-Response Scriptwriting",
      "No Talent Usage Fees",
      "Rapid Variations for A/B Testing"
    ],
    addOns: [
      { name: "Additional language", price: "Custom Quote" },
      { name: "Extra hooks", price: "Custom Quote" }
    ],
    process: [
      { title: "Persona Matching", description: "Selecting the ideal digital advocate for your demographic." },
      { title: "Viral Scripting", description: "Writing natural, high-retention scripts with authentic hooks." },
      { title: "AI Generation", description: "Rendering natural gestures, expressions, and realistic voice sync." },
      { title: "Social Editing", description: "Adding native captions, overlays, and platform emojis." }
    ],
    faqs: [
      { question: "Does the video look realistic?", answer: "Yes! We use cutting-edge visual models ensuring lip-sync and facial micro-expressions are entirely natural." },
      { question: "Do we own the rights?", answer: "Yes, you receive full commercial usage rights for the final generated videos with no recurring talent fees." },
      { question: "How long are the videos?", answer: "They typically range from 15 to 60 seconds, optimized for TikTok, Reels, and YouTube Shorts." },
      { question: "How do I start?", answer: "Hit 'Get a Quote' and share your product details and target audience demographic." }
    ],
    seo: {
      title: "AI UGC Advertisement Video Pricing | NSD Creations",
      description: "Scale your ad creatives with AI-generated UGC videos. View our affordable packages and campaign options for high-converting ads.",
      keywords: ["AI UGC videos", "user generated content pricing", "AI actor videos", "UGC video ads india"]
    }
  },
  {
    id: "marketing-promotional-videos",
    slug: "marketing-promotional-videos",
    name: "Marketing & Promotional Videos",
    shortDescription: "Corporate explainers, brand journeys, and digital content.",
    longDescription: "Establish elite market authority with custom promotional reels, educational video content, and animated brand explainers designed to retain viewer attention and drive action.",
    category: "AI Creative & Video Production",
    categoryGroup: "Creative",
    startingPrice: "3,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "video",
    packages: [
      {
        name: "Starter",
        price: "₹3,999",
        idealFor: "Best for basic promos",
        features: [
          "Up to 30 seconds",
          "Motion graphics",
          "Royalty-free music",
          "Basic text animations",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹7,999",
        idealFor: "Best for explainers & reels",
        features: [
          "Up to 60 seconds",
          "Premium stock footage",
          "Voiceover integration",
          "Advanced motion graphics",
          "2 revisions"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹14,999+",
        idealFor: "Best for comprehensive campaigns",
        features: [
          "Promotional reels",
          "Explainer videos",
          "Educational content",
          "Animated content",
          "Social media formats",
          "CTA integration"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Custom Motion Graphics",
      "Premium Stock & AI Assets",
      "Professional Voiceovers",
      "Platform-Specific Formatting",
      "Brand-Aligned Styling"
    ],
    addOns: [
      { name: "Extra duration", price: "Custom Quote" },
      { name: "Source files", price: "Custom Quote" }
    ],
    process: [
      { title: "Concept Boarding", description: "Mapping out the storytelling sequence and core features." },
      { title: "Asset Assembly", description: "Combining premium motion graphics, custom renders, and layouts." },
      { title: "Audio & Editing", description: "Synchronizing high-quality background scores and transitions." },
      { title: "Review & Delivery", description: "Finalizing the cut and exporting for web and social." }
    ],
    faqs: [
      { question: "What is the typical turnaround time?", answer: "Most marketing videos take between 3 to 7 business days from script approval." },
      { question: "Can we use our own company voiceover?", answer: "Yes, you can provide your own recordings or we can synthesize a high-quality AI voice." },
      { question: "Can additional formats be requested?", answer: "Yes, we can optimize exports for 16:9 (YouTube/Web), 1:1 (Feed), and 9:16 (Reels/Shorts)." },
      { question: "Are third-party charges included?", answer: "All standard stock footage and royalty-free music licenses used in the project are included." }
    ],
    seo: {
      title: "Marketing & Promotional Video Pricing | NSD Creations",
      description: "Professional marketing videos and explainers starting at ₹3,999. Boost your brand authority with premium promotional content.",
      keywords: ["marketing video pricing", "promotional videos", "explainer video cost", "corporate video production"]
    }
  },
  {
    id: "tribute-videos",
    slug: "tribute-videos",
    name: "Tribute Videos",
    shortDescription: "Preserving legacy through emotional and cinematic storytelling.",
    longDescription: "Honor the memory and legacy of family pioneers, business founders, and loved ones. We restore historical photographs, craft highly emotional stories, and synchronize audio to leave an everlasting impact.",
    category: "AI Creative & Video Production",
    categoryGroup: "Creative",
    startingPrice: "2,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "heart",
    packages: [
      {
        name: "Basic",
        price: "₹2,999",
        idealFor: "Best for simple slideshows",
        features: [
          "Up to 3 minutes",
          "Standard transitions",
          "Background music",
          "Basic photo cleanup",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Premium",
        price: "₹5,999",
        idealFor: "Best for emotional tributes",
        features: [
          "Up to 7 minutes",
          "Cinematic transitions",
          "Light photo restoration",
          "Text & captions",
          "2 revisions"
        ],
        isPopular: true,
      },
      {
        name: "Advanced Legacy Film",
        price: "₹12,999+",
        idealFor: "Best for detailed documentaries",
        features: [
          "Extended duration",
          "Advanced photo restoration",
          "Custom voiceover/narration",
          "Symphonic audio engineering",
          "Unlimited photos",
          "Premium storytelling"
        ],
        isPopular: false,
      }
    ],
    features: [
      "AI Digital Photo Restoration",
      "Emotional Pacing & Storytelling",
      "Symphonic Audio Arrangement",
      "High-Definition Upscaling",
      "Private Secure Sharing Links"
    ],
    addOns: [
      { name: "Photo restoration", price: "₹100–₹300/photo" },
      { name: "Advanced restoration", price: "₹300–₹750/photo" },
      { name: "Additional minute", price: "₹500–₹1,500" },
      { name: "Custom voiceover", price: "₹500+" },
      { name: "Rush delivery", price: "+25–50%" }
    ],
    process: [
      { title: "Asset Collection", description: "Receiving legacy photographs and enhancing/restoring them." },
      { title: "Story Scripting", description: "Structuring a respectful, chronological life-journey narrative." },
      { title: "Cinematic Editing", description: "Arranging restored photos into a flowing timeline with emotional depth." },
      { title: "Audio Overlay", description: "Merging background instrumentals to evoke deep emotion." }
    ],
    faqs: [
      { question: "What if my photos are very old or blurry?", answer: "We use proprietary deep-learning AI tools to rebuild lost details and colorize black-and-white photos." },
      { question: "How long is a typical tribute video?", answer: "Most tribute videos run between 5 to 12 minutes to keep a perfect balance of story and audience attention." },
      { question: "Can we add family video clips?", answer: "Yes, we can seamlessly integrate your home videos along with the photographs." },
      { question: "How long does it take?", answer: "Usually 3 to 7 days, but rush delivery is available if needed urgently." }
    ],
    seo: {
      title: "Tribute & Legacy Video Pricing | NSD Creations",
      description: "Beautiful cinematic tribute and legacy videos. Professional photo restoration and emotional storytelling starting from ₹2,999.",
      keywords: ["tribute videos", "memorial video pricing", "legacy film", "photo restoration video"]
    }
  },

  // -----------------------------------------------------
  // CATEGORY 2: CREATIVE BRANDING & GRAPHIC DESIGN (Branding)
  // -----------------------------------------------------
  {
    id: "poster-designing",
    slug: "poster-designing",
    name: "Poster Designing",
    shortDescription: "Eye-catching, high-impact poster and flyer graphics.",
    longDescription: "Stunning promotional posters, event banners, and digital graphics built to grab immediate visual attention using bold layout grids, strong color theory, and premium typography.",
    category: "Creative Branding & Graphic Design",
    categoryGroup: "Creative",
    startingPrice: "299",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "image",
    packages: [
      {
        name: "Single Poster",
        price: "₹299",
        idealFor: "Best for quick announcements",
        features: [
          "1 Custom Poster",
          "Digital format (RGB)",
          "Standard layout",
          "1 revision"
        ],
        isPopular: false,
      },
      {
        name: "Professional Poster",
        price: "₹599",
        idealFor: "Best for marketing & events",
        features: [
          "Premium visual design",
          "Custom typography",
          "Print-ready (CMYK) & Web",
          "2 revisions",
          "High-conversion focus"
        ],
        isPopular: true,
      },
      {
        name: "Premium Poster",
        price: "₹999–₹1,499",
        idealFor: "Best for major campaigns",
        features: [
          "Complex composite design",
          "Advanced photo manipulation",
          "Source files included",
          "Unlimited revisions",
          "Multiple size variations"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Custom Graphic Elements",
      "Optimized for Print & Digital",
      "High-Fidelity Typography",
      "Fast Turnarounds",
      "Bulk Bundles Available"
    ],
    addOns: [
      { name: "5 Posters Bundle", price: "₹2,499" },
      { name: "10 Posters Bundle", price: "₹4,499" },
      { name: "20 Posters Bundle", price: "₹7,999" },
      { name: "Source Files", price: "Custom Quote" }
    ],
    process: [
      { title: "Creative Brief", description: "Identifying core event details, tone, and dimensions." },
      { title: "Wireframing", description: "Mapping visual hierarchy to ensure titles and CTAs pop." },
      { title: "Illustrative Design", description: "Crafting graphic elements, typography, and visual contrast." },
      { title: "Export Prep", description: "Color-matching and delivering final files in print-optimized formats." }
    ],
    faqs: [
      { question: "Do you provide source files?", answer: "Source files are included in our Premium packages or can be requested as an add-on." },
      { question: "How fast can you deliver a poster?", answer: "Standard delivery is between 24 to 48 hours depending on design complexity." },
      { question: "Do you do bulk discounts?", answer: "Yes, we offer bundles for 5, 10, or 20 posters at discounted rates." },
      { question: "Are these templates?", answer: "No, every poster is custom-designed based on your specific requirements and branding." }
    ],
    seo: {
      title: "Poster Design Pricing | NSD Creations",
      description: "Custom, high-impact poster and flyer designing starting at ₹299. Explore our single designs and bulk bundles.",
      keywords: ["poster design pricing", "flyer design cost", "graphic design posters", "event banner design"]
    }
  },
  {
    id: "graphic-designing",
    slug: "graphic-designing",
    name: "Graphic Designing",
    shortDescription: "Consistent, professional graphics for a robust brand identity.",
    longDescription: "Everyday marketing graphics, social assets, custom brochures, and company stationary crafted with a premium commercial finish.",
    category: "Creative Branding & Graphic Design",
    categoryGroup: "Creative",
    startingPrice: "499",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "palette",
    packages: [
      {
        name: "Social Media / Business Card",
        price: "₹499–₹999",
        idealFor: "Best for everyday assets",
        features: [
          "Custom vector design",
          "Brand-aligned colors",
          "Digital ready formats",
          "1-2 revisions"
        ],
        isPopular: false,
      },
      {
        name: "Brochures & Menus",
        price: "₹999–₹4,999",
        idealFor: "Best for physical marketing",
        features: [
          "Multi-page layout",
          "Premium typography",
          "Print-ready PDFs with bleed",
          "High-contrast visuals",
          "Priority revisions"
        ],
        isPopular: true,
      },
      {
        name: "Presentations & Complete Sets",
        price: "₹1,999–₹7,999",
        idealFor: "Best for corporate identity",
        features: [
          "Slide decks or full stationery",
          "Complete visual asset bundle",
          "Vector layouts (SVG/EPS)",
          "Source files",
          "Extensive revisions"
        ],
        isPopular: false,
      }
    ],
    features: [
      "No Generic Templates",
      "Brand-Consistent Styling",
      "Print (CMYK) & Digital (RGB)",
      "High-Contrast Layout Balancing",
      "Vector Quality Assets"
    ],
    addOns: [
      { name: "Rush Delivery", price: "Custom Quote" },
      { name: "Source Files", price: "Custom Quote" }
    ],
    process: [
      { title: "Guideline Setup", description: "Analyzing your brand colors, fonts, and graphical rules." },
      { title: "Asset Draft", description: "Creating rapid design drafts of requested assets." },
      { title: "Polish", description: "Adding custom elements, micro-shadows, and layout balancing." },
      { title: "Batch Exporting", description: "Formatting for various media needs, websites, and printing." }
    ],
    faqs: [
      { question: "Can you redesign our existing brochures?", answer: "Yes! We can take your legacy brochures and redesign them into ultra-premium modern marketing handouts." },
      { question: "Do you design restaurant menu cards?", answer: "Yes, restaurant and cafe menu styling is one of our creative design specialties." },
      { question: "How are prices calculated?", answer: "Pricing depends on the complexity and number of pages (e.g., a simple flyer vs. a 12-page company profile)." },
      { question: "Do you provide printing services?", answer: "We provide print-ready digital files (CMYK PDFs with bleed) that any professional printer can use." }
    ],
    seo: {
      title: "Graphic Design Pricing | NSD Creations",
      description: "Professional graphic design services including brochures, menus, and business cards starting at ₹499.",
      keywords: ["graphic design pricing", "brochure design cost", "business card design", "menu designing"]
    }
  },
  {
    id: "branding-brand-identity",
    slug: "branding-brand-identity",
    name: "Branding & Brand Identity",
    shortDescription: "Unforgettable, premium brand assets that position you as the leader.",
    longDescription: "Branding is the emotional connection your client has with your business. We design high-end, cohesive, and modern brand identities including logo design, color typography guides, and brand architecture.",
    category: "Creative Branding & Graphic Design",
    categoryGroup: "Brand & Marketing",
    startingPrice: "7,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "sparkles",
    packages: [
      {
        name: "Starter",
        price: "₹7,999",
        idealFor: "Best for individuals",
        features: [
          "Logo design",
          "Colour palette",
          "Typography selection",
          "Basic brand direction",
          "2 revisions"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹14,999",
        idealFor: "Best for growing businesses",
        features: [
          "Logo system & variations",
          "Colour & Typography system",
          "Brand guidelines (PDF)",
          "Social profile assets",
          "Business card design",
          "3 revisions"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹29,999+",
        idealFor: "Best for brands & campaigns",
        features: [
          "Complete visual identity",
          "Brand strategy",
          "Logo system",
          "Brand guidelines",
          "Stationery set",
          "Social templates",
          "Brand applications"
        ],
        isPopular: false,
      }
    ],
    features: [
      "100% Custom Crafted Vector Logos",
      "Color Psychology Engineering",
      "Corporate Design System Setup",
      "Full Commercial Copyrights",
      "Complete Master Files (AI/SVG/PDF)"
    ],
    addOns: [
      { name: "Extra Logo Concept", price: "Custom Quote" },
      { name: "Packaging Design", price: "Custom Quote" }
    ],
    process: [
      { title: "Discovery", description: "Pinpointing your brand essence, style preferences, and audience values." },
      { title: "Concepts", description: "Sketching and refining unique, high-concept modern vector logos." },
      { title: "Systems", description: "Selecting elite font structures and color codes built for visual accessibility." },
      { title: "Guidelines", description: "Assembling a complete brand book containing all rules for future application." }
    ],
    faqs: [
      { question: "Will I own the full copyrights to the logo?", answer: "Yes, upon final project payment, complete copyrights of the chosen logo and assets belong entirely to your business." },
      { question: "Do you use templates?", answer: "Never. All our logos and brand identities are built 100% from scratch to ensure a unique trademarkable asset." },
      { question: "How long does the branding process take?", answer: "Typically 2 to 4 weeks depending on the feedback loops and package selected." },
      { question: "Do you design business stationery?", answer: "Yes, our Professional and Premium packages include stationary design like business cards and letterheads." }
    ],
    seo: {
      title: "Branding & Logo Design Pricing | NSD Creations",
      description: "Premium logo design and complete brand identity packages starting at ₹7,999. Elevate your corporate identity.",
      keywords: ["branding pricing", "logo design cost", "brand identity packages", "corporate branding india"]
    }
  },

  // -----------------------------------------------------
  // CATEGORY 3: DIGITAL MARKETING & STRATEGY (Marketing)
  // -----------------------------------------------------
  {
    id: "social-media-management",
    slug: "social-media-management",
    name: "Social Media Management",
    shortDescription: "Organic, aesthetic, and compounding social media growth.",
    longDescription: "Take back your time. We script, design, and schedule beautiful social feeds that reflect elite brand authority. Transform your profiles into trustworthy digital storefronts.",
    category: "Digital Marketing & Strategy",
    categoryGroup: "Brand & Marketing",
    startingPrice: "9,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "/month",
    iconName: "share",
    packages: [
      {
        name: "Starter",
        price: "₹9,999",
        idealFor: "Best for establishing presence",
        features: [
          "8 posts / month",
          "4 stories",
          "Professional Captions",
          "Content calendar",
          "Visual grid planning"
        ],
        isPopular: false,
      },
      {
        name: "Growth",
        price: "₹19,999",
        idealFor: "Best for growing engagement",
        features: [
          "12 posts / month",
          "4 reels",
          "8 stories",
          "Captions & Hashtags",
          "Auto-Scheduling",
          "Basic analytics"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹34,999",
        idealFor: "Best for dominant brands",
        features: [
          "16–20 posts / month",
          "8–12 reels",
          "Stories strategy",
          "Content strategy",
          "Community management",
          "Analytics & Reporting",
          "Monthly strategy calls"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Consistent Visual Aesthetics",
      "Authority-Driven Copywriting",
      "Strategic Keyword & Hashtags",
      "Content Calendar Management",
      "Note: Advertising spend is separate"
    ],
    addOns: [
      { name: "Extra Reels", price: "Custom Quote" },
      { name: "DM / Comment Management", price: "Custom Quote" }
    ],
    process: [
      { title: "Visual Theme", description: "Setting up a premium, unified aesthetic grid for your feeds." },
      { title: "Content Calendar", description: "Brainstorming and writing custom content concepts for the month." },
      { title: "Asset Creation", description: "Designing high-definition graphics, carousel frames, and thumbnails." },
      { title: "Scheduling", description: "Scheduling posts at optimal times and monitoring performance." }
    ],
    faqs: [
      { question: "Do you reply to comments and direct messages?", answer: "Our standard packages focus on content. Community management is included in the Premium tier." },
      { question: "Is there a minimum contract length?", answer: "We work on flexible month-to-month retainers, though a 3-month commitment is recommended for organic growth." },
      { question: "Are ad budgets included?", answer: "No, advertising spend is completely separate from our management fee." },
      { question: "Do you shoot the videos?", answer: "We can edit and animate supplied footage, or generate AI videos. Physical on-location shoots require a custom scope." }
    ],
    seo: {
      title: "Social Media Management Pricing | NSD Creations",
      description: "Professional monthly social media management and content creation packages starting at ₹9,999/month.",
      keywords: ["social media management pricing", "SMM packages", "instagram management cost", "social media agency india"]
    }
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortDescription: "ROI-driven digital marketing and on-page search visibility.",
    longDescription: "Accelerate your client acquisitions through hyper-targeted search ads, organic visibility, and custom high-conversion landing pages. We focus on actual conversions instead of vain clicks.",
    category: "Digital Marketing & Strategy",
    categoryGroup: "Brand & Marketing",
    startingPrice: "9,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "/month",
    iconName: "trending-up",
    packages: [
      {
        name: "Starter",
        price: "₹9,999",
        idealFor: "Best for local businesses",
        features: [
          "Basic campaign strategy",
          "Single platform ads",
          "Basic conversion tracking",
          "Monthly reporting",
          "NSD management fee only"
        ],
        isPopular: false,
      },
      {
        name: "Growth",
        price: "₹19,999",
        idealFor: "Best for scaling leads",
        features: [
          "Campaign strategy",
          "Meta Ads management",
          "Google presence",
          "Landing-page optimisation",
          "Conversion tracking",
          "Monthly reporting"
        ],
        isPopular: true,
      },
      {
        name: "Premium",
        price: "₹39,999+",
        idealFor: "Best for aggressive scaling",
        features: [
          "Multi-channel campaigns",
          "Lead generation",
          "Funnel strategy",
          "Retargeting",
          "Conversion optimisation",
          "Advanced analytics"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Data-Driven Campaign Setups",
      "High-Conversion Ad Copy",
      "Pixel & Tag Tracking Integration",
      "Transparent Analytics Dashboard",
      "Note: Client advertising budget is separate"
    ],
    addOns: [
      { name: "Custom Landing Page", price: "From ₹14,999" },
      { name: "SEO Optimization", price: "Custom Quote" }
    ],
    process: [
      { title: "Competitor Analysis", description: "Auditing direct competitors' ad scripts, search positions, and offers." },
      { title: "Campaign Design", description: "Writing high-relevance search copies and configuring geo-targeting." },
      { title: "Conversion Setup", description: "Optimizing or building fast landing pages matching the ad focus." },
      { title: "Optimization", description: "A/B testing copies, checking metrics, and scaling top performers." }
    ],
    faqs: [
      { question: "What is the recommended advertising budget?", answer: "We recommend a minimum ad spend of ₹10,000 to ₹15,000/month to gather enough data, paid directly to Google/Meta." },
      { question: "How long before we see results?", answer: "Paid ads generate leads almost instantly upon approval. Organic search rankings take 60-90 days to compound." },
      { question: "Do you include ad spend in your pricing?", answer: "No, our pricing reflects the agency management and strategy fee. The ad budget is billed directly to your card by the platforms." },
      { question: "Do you build the ad creatives?", answer: "Yes, ad creatives (graphics/short videos) are built as part of the campaign management strategy." }
    ],
    seo: {
      title: "Digital Marketing & Ads Pricing | NSD Creations",
      description: "ROI-focused digital marketing and ad management starting at ₹9,999/month. Scale your leads with Meta and Google ads.",
      keywords: ["digital marketing pricing", "performance marketing cost", "google ads management", "meta ads agency"]
    }
  },

  // -----------------------------------------------------
  // CATEGORY 4: AI, WHATSAPP & BUSINESS AUTOMATION (Automation)
  // -----------------------------------------------------
  {
    id: "ai-automation",
    slug: "ai-automation",
    name: "AI Automation Solutions",
    shortDescription: "Supercharge your business productivity with custom intelligent workflows.",
    longDescription: "Automate repetitive daily tasks, content generation, and email outreach using custom-engineered intelligent visual workflows. Connect powerful AI engines to automate documents and trigger actions in real-time.",
    category: "AI, WhatsApp & Business Automation",
    categoryGroup: "Automation",
    startingPrice: "9,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "cpu",
    packages: [
      {
        name: "Basic",
        price: "₹9,999",
        idealFor: "Best for simple task automation",
        features: [
          "Single workflow setup",
          "Basic AI prompts",
          "2-3 App Integrations",
          "Standard notifications",
          "1 month support"
        ],
        isPopular: false,
      },
      {
        name: "Professional",
        price: "₹24,999",
        idealFor: "Best for operational teams",
        features: [
          "Complex multi-step workflow",
          "Lead automation",
          "Data processing",
          "CRM integration",
          "Email automation",
          "Error handling logs"
        ],
        isPopular: true,
      },
      {
        name: "Advanced",
        price: "₹59,999+",
        idealFor: "Best for enterprise processes",
        features: [
          "Multiple complex workflows",
          "Custom AI agents",
          "Full business workflow automation",
          "Custom API connections",
          "Extensive testing",
          "Priority support"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Custom Workflow Architecture",
      "Seamless API Integrations",
      "Intelligent Data Processing",
      "Automated Email & CRM Entry",
      "Zero Coding Required from Your End"
    ],
    addOns: [
      { name: "Additional workflow", price: "Custom Quote" },
      { name: "Custom AI Agent", price: "Custom Quote" }
    ],
    process: [
      { title: "Operational Audit", description: "Mapping out your team's repetitive tasks and data flows." },
      { title: "Architecture", description: "Designing secure pipelines connecting your daily apps with AI connectors." },
      { title: "Agent Setup", description: "Calibrating prompts to ensure output is accurate and on-brand." },
      { title: "Launch", description: "Running safety logs, edge cases, and pushing the system live." }
    ],
    faqs: [
      { question: "Will this replace my employees?", answer: "No, AI automations act as digital super-assistants, taking over boring tasks so your team can focus on growth." },
      { question: "Do I need technical skills?", answer: "Not at all. We build the systems and hand over simple documentation." },
      { question: "Are third-party API costs included?", answer: "No, platforms like Make, Zapier, or OpenAI API bill separately based on your specific usage volume." },
      { question: "Can it integrate with my existing CRM?", answer: "Yes, as long as your CRM supports webhooks or has a public API." }
    ],
    seo: {
      title: "AI Automation Solutions Pricing | NSD Creations",
      description: "Automate your workflows with AI. Custom business automation and AI agent pricing starting from ₹9,999.",
      keywords: ["AI automation pricing", "business workflow automation", "Zapier integration cost", "AI agent development"]
    }
  },
  {
    id: "whatsapp-automation",
    slug: "whatsapp-automation",
    name: "WhatsApp Automation",
    shortDescription: "Direct-to-mobile chat marketing and 24/7 client support.",
    longDescription: "Automate client support, send transaction updates, and launch promotional broadcasts on WhatsApp. We help you build official API-powered conversational chatbots and marketing broadcasts.",
    category: "AI, WhatsApp & Business Automation",
    categoryGroup: "Automation",
    startingPrice: "7,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "message-square",
    packages: [
      {
        name: "Basic",
        price: "₹7,999",
        idealFor: "Best for simple auto-replies",
        features: [
          "API setup assistance",
          "Greeting message",
          "FAQ automation",
          "Basic interactive menu",
          "Standard responses"
        ],
        isPopular: false,
      },
      {
        name: "Business",
        price: "₹19,999",
        idealFor: "Best for lead generation",
        features: [
          "Complex chat flow",
          "Lead capture logic",
          "Automated follow-ups",
          "Google Sheets / CRM sync",
          "Approved templates",
          "Basic chatbot logic"
        ],
        isPopular: true,
      },
      {
        name: "AI Business Agent",
        price: "₹49,999+",
        idealFor: "Best for 24/7 intelligent sales",
        features: [
          "AI conversational agent",
          "Natural language understanding",
          "Lead qualification",
          "Dynamic CRM integration",
          "Booking systems",
          "Multiple complex workflows"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Official Meta API Setup",
      "Visual Conversation Flows",
      "Database / CRM Webhooks",
      "Automated Lead Capture",
      "Broadcast Capability Setup"
    ],
    addOns: [
      { name: "Additional language flow", price: "Custom Quote" },
      { name: "Advanced AI fine-tuning", price: "Custom Quote" }
    ],
    process: [
      { title: "API Configuration", description: "Guiding you through setting up your verified WhatsApp Business line." },
      { title: "Flowchart Design", description: "Mapping the exact conversation tree and automated answers." },
      { title: "Database Hookup", description: "Connecting your bot to your CRM or Google Sheets for instant sync." },
      { title: "Live Calibrations", description: "Testing user prompts and pushing the chat service live." }
    ],
    faqs: [
      { question: "Can we use our existing number?", answer: "Yes, you can register an existing number for the official API, provided it is verified and deleted from the consumer app." },
      { question: "Are there extra message costs?", answer: "Yes, Meta charges small per-conversation fees for API usage, billed separately." },
      { question: "Can the bot understand free text?", answer: "Basic packages use button menus. The AI Business Agent package understands natural human conversation." },
      { question: "How long does verification take?", answer: "Meta's business verification usually takes 1-3 business days if all documents are correct." }
    ],
    seo: {
      title: "WhatsApp API Automation Pricing | NSD Creations",
      description: "Build official WhatsApp chatbots and automated sales funnels. Pricing starts at ₹7,999 for Meta API integrations.",
      keywords: ["whatsapp automation pricing", "whatsapp api cost", "whatsapp chatbot developer", "business chat automation"]
    }
  },
  {
    id: "business-automation",
    slug: "business-automation",
    name: "Business Automation",
    shortDescription: "Unify your business systems, invoice models, and workflows.",
    longDescription: "Streamline customer onboarding, automate invoice routing, and sync sales pipelines into a single high-efficiency machine. We build custom CRM pipelines to help you run a paperless, friction-free office.",
    category: "AI, WhatsApp & Business Automation",
    categoryGroup: "Automation",
    startingPrice: "14,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "workflow",
    packages: [
      {
        name: "Starter",
        price: "₹14,999",
        idealFor: "Best for small operations",
        features: [
          "Basic CRM setup",
          "Form to database sync",
          "Email notifications",
          "Standard workflow mapping",
          "1 revision round"
        ],
        isPopular: false,
      },
      {
        name: "Growth",
        price: "₹34,999",
        idealFor: "Best for scaling sales teams",
        features: [
          "Advanced CRM pipeline",
          "Lead → Quote → Invoice flow",
          "Payment verifications",
          "Automated follow-ups",
          "Team notifications (Slack/WhatsApp)"
        ],
        isPopular: true,
      },
      {
        name: "Advanced",
        price: "₹74,999+",
        idealFor: "Best for enterprise systems",
        features: [
          "Bespoke operational architecture",
          "Multi-platform data sync",
          "Custom dashboard connections",
          "Advanced reporting",
          "Full scale system integration"
        ],
        isPopular: false,
      }
    ],
    features: [
      "Custom CRM Pipelines",
      "Automated Invoicing Triggers",
      "Cross-Platform Syncing",
      "Paperless Client Onboarding",
      "Scalable System Design"
    ],
    addOns: [
      { name: "Additional CRM integration", price: "Custom Quote" },
      { name: "Custom training session", price: "Custom Quote" }
    ],
    process: [
      { title: "Process Mapping", description: "Documenting every action from inquiry to final project sign-off." },
      { title: "CRM Setup", description: "Configuring user-friendly platforms for easy pipeline tracking." },
      { title: "Trigger Setup", description: "Setting up automated actions like invoice generation upon deal won." },
      { title: "Training", description: "Providing a quick video guide showing your team how to use the system." }
    ],
    faqs: [
      { question: "Can we connect our payment processors?", answer: "Yes! We can set up secure webhooks that trigger actions as soon as Stripe/Razorpay verifies transactions." },
      { question: "What if our business model is unique?", answer: "We specialize in bespoke flows. We map out custom variables and logic triggers specific to you." },
      { question: "Does this include software subscriptions?", answer: "No, subscriptions for CRMs (like HubSpot, Pipedrive, or Make) are billed by those platforms." },
      { question: "Is final pricing strictly ₹14,999?", answer: "No, pricing heavily depends on the complexity of your workflow and the number of integrations required." }
    ],
    seo: {
      title: "Business Automation & CRM Pricing | NSD Creations",
      description: "Automate invoicing, pipelines, and onboarding with custom business automation solutions starting at ₹14,999.",
      keywords: ["business automation pricing", "CRM setup cost", "sales pipeline automation", "invoice automation services"]
    }
  },

  // -----------------------------------------------------
  // CATEGORY 5: WEBSITE & APP DEVELOPMENT (Technology)
  // -----------------------------------------------------
  {
    id: "website-development",
    slug: "website-development",
    name: "Website Development",
    shortDescription: "Ultra-fast custom business websites engineered to convert.",
    longDescription: "Forget slow page loads or generic visual builders. We craft hand-coded, search-optimized, blazing-fast business websites using modern React and Next.js architectures.",
    category: "Website & App Development",
    categoryGroup: "Technology",
    startingPrice: "14,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "globe",
    packages: [
      {
        name: "Landing Page",
        price: "₹14,999",
        idealFor: "Best for quick campaigns",
        features: [
          "Single-page high converting website",
          "Responsive mobile design",
          "Strong CTA sections",
          "Contact form integration",
          "Standard deployment"
        ],
        isPopular: false,
      },
      {
        name: "Business Website",
        price: "₹29,999",
        idealFor: "Best for company profiles",
        features: [
          "5–8 custom coded pages",
          "Premium UI/UX design",
          "On-page SEO basics",
          "Contact & Social integration",
          "Fast Edge deployment"
        ],
        isPopular: true,
      },
      {
        name: "Premium / Web App",
        price: "₹59,999+",
        idealFor: "Best for complex digital presence",
        features: [
          "Advanced UI/UX with animations",
          "Advanced technical SEO",
          "Third-party API integrations",
          "CMS/backend where required",
          "Performance optimisation",
          "Custom functionality"
        ],
        isPopular: false,
      }
    ],
    features: [
      "100% Hand-Coded (Next.js/React)",
      "Blazing Fast Page Speeds",
      "No Clunky WordPress Builders",
      "Fully Responsive Design",
      "On-Page Technical SEO"
    ],
    addOns: [
      { name: "Additional pages", price: "Custom Quote" },
      { name: "Content Management System", price: "Custom Quote" },
      { name: "Payment integration", price: "Custom Quote" }
    ],
    process: [
      { title: "UX Layout", description: "Drafting high-conversion layouts prioritizing value propositions." },
      { title: "UI Mockups", description: "Designing gorgeous, high-fidelity interfaces." },
      { title: "Development", description: "Writing lightweight, secure code with smooth motion effects." },
      { title: "Deployment", description: "Optimizing assets and hosting on robust digital edge servers." }
    ],
    faqs: [
      { question: "Do you use WordPress?", answer: "No. Every line of code is handwritten using modern frameworks like Next.js to ensure maximum speed and security." },
      { question: "Do you integrate contact forms?", answer: "Yes! We wire forms to direct emails or Google Sheets so you never miss a lead." },
      { question: "Are hosting costs included?", answer: "We deploy on platforms like Vercel (often free for small sites). Custom domains and premium hosting are billed separately." },
      { question: "How long does a business website take?", answer: "A standard 5-page business website takes 2-4 weeks from design approval." }
    ],
    seo: {
      title: "Website Development Pricing | NSD Creations",
      description: "Hand-coded, blazing fast business websites and landing pages starting at ₹14,999. No slow templates.",
      keywords: ["website development pricing", "custom web design cost", "Next.js development india", "business landing page"]
    }
  },
  {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    name: "Mobile App Development",
    shortDescription: "High-performance iOS and Android mobile applications.",
    longDescription: "Bespoke Mobile Applications crafted with intuitive UI, offline sync, and native fluid speed. We build lightweight cross-platform applications that deliver premium performance.",
    category: "Website & App Development",
    categoryGroup: "Technology",
    startingPrice: "49,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "smartphone",
    packages: [
      {
        name: "Basic App",
        price: "₹49,999+",
        idealFor: "Best for simple utility apps",
        features: [
          "Cross-platform (iOS & Android)",
          "Simple user interface",
          "Local data storage",
          "Standard UI components",
          "Store deployment assist"
        ],
        isPopular: false,
      },
      {
        name: "Business App",
        price: "₹99,999+",
        idealFor: "Best for standard platforms",
        features: [
          "Cloud database backend",
          "User authentication",
          "Push notifications",
          "Custom UI/UX",
          "API integrations"
        ],
        isPopular: true,
      },
      {
        name: "Advanced Platform",
        price: "₹1,99,999+",
        idealFor: "Best for complex ecosystems",
        features: [
          "Complex state management",
          "Real-time chat/data sync",
          "Payment gateways",
          "Maps/Geolocation",
          "Admin dashboard panel",
          "Custom animations"
        ],
        isPopular: false,
      }
    ],
    features: [
      "iOS and Android Cross-Platform",
      "Fluid Native-Like Performance",
      "Secure Backend Integration",
      "App Store & Play Store Launch",
      "Offline Capabilities"
    ],
    addOns: [
      { name: "Complex Admin Dashboard", price: "Custom Quote" },
      { name: "Hardware Integration (Bluetooth)", price: "Custom Quote" }
    ],
    process: [
      { title: "Journey Mapping", description: "Defining screen layouts and key touch points." },
      { title: "UI Design", description: "Creating stunning visual screens tailored to mobile thumb reach." },
      { title: "Development", description: "Building responsive modules with state-of-the-art frameworks." },
      { title: "Testing & Launch", description: "Debugging on real devices and managing store submissions." }
    ],
    faqs: [
      { question: "Will my app work offline?", answer: "Yes, if required, we implement local storage databases so users can interact without active internet." },
      { question: "Do you assist with publishing?", answer: "Absolutely! We guide you step-by-step through setting up developer accounts and handle the submission." },
      { question: "What factors increase the price?", answer: "Pricing increases with backend complexity, authentication, payments, maps, and third-party APIs." },
      { question: "Is the backend included?", answer: "Backend logic (databases, APIs, servers) is scoped and priced based on the specific package." }
    ],
    seo: {
      title: "Mobile App Development Pricing | NSD Creations",
      description: "Cross-platform iOS and Android app development starting at ₹49,999. Premium fluid mobile applications.",
      keywords: ["mobile app development cost", "iOS app pricing", "cross platform app developer", "custom android app"]
    }
  },
  {
    id: "custom-software-development",
    slug: "custom-software-development",
    name: "Custom Software Development",
    shortDescription: "Tailored business software built for performance and scale.",
    longDescription: "Bespoke Business Software, advanced admin portals, and custom API integrations built from the ground up to fit your operational scale and brand security.",
    category: "Website & App Development",
    categoryGroup: "Technology",
    startingPrice: "74,999",
    currency: "₹",
    pricingPrefix: "Starting from",
    pricingPeriod: "",
    iconName: "settings",
    packages: [
      {
        name: "Business Software",
        price: "₹74,999+",
        idealFor: "Best for internal tools",
        features: [
          "Custom web application",
          "Standard database architecture",
          "Secure login systems",
          "Basic data reporting",
          "Cloud deployment"
        ],
        isPopular: false,
      },
      {
        name: "CRM / Admin System",
        price: "₹1,49,999+",
        idealFor: "Best for operational management",
        features: [
          "Complex database relations",
          "Role-based access control",
          "Third-party API hooks",
          "Advanced analytics dashboards",
          "Secure data pipelines"
        ],
        isPopular: true,
      },
      {
        name: "SaaS / MVP",
        price: "₹2,49,999+",
        idealFor: "Best for tech startups",
        features: [
          "Multi-tenant architecture",
          "Stripe/Subscription billing",
          "Scalable cloud infrastructure",
          "High-performance endpoints",
          "Complete code ownership"
        ],
        isPopular: false,
      }
    ],
    features: [
      "100% Customized Architecture",
      "Highly Scalable Systems",
      "Secure Role-Based Authentication",
      "Modern Tech Stack (React/Node/Next)",
      "Zero Vendor Lock-in"
    ],
    addOns: [
      { name: "Complex Platform Architecture", price: "₹4,99,999+" },
      { name: "Ongoing Maintenance SLA", price: "Custom Quote" }
    ],
    process: [
      { title: "Blueprinting", description: "Writing exhaustive technical specifications covering database logic." },
      { title: "Prototyping", description: "Mapping advanced layouts and visual states before coding." },
      { title: "Development", description: "Building robust backend endpoints and frontend interfaces." },
      { title: "Testing & Rollout", description: "Deploying secure server setups and running stress tests." }
    ],
    faqs: [
      { question: "Will we have full access to the code?", answer: "Yes, we hand over full repository ownership. You are never locked into our services." },
      { question: "Do you offer post-launch maintenance?", answer: "Yes, we provide flexible monthly maintenance packages to monitor servers and push updates." },
      { question: "What technologies do you use?", answer: "We specialize in the modern JavaScript ecosystem: React, Next.js, Node, PostgreSQL, and serverless architectures." },
      { question: "Is this a fixed price?", answer: "No, custom software is strictly scope-based. The prices shown are entry baselines." }
    ],
    seo: {
      title: "Custom Software Development Pricing | NSD Creations",
      description: "Bespoke SaaS, CRM, and custom software development services starting at ₹74,999. Secure, scalable architectures.",
      keywords: ["custom software cost", "SaaS development pricing", "custom CRM builder", "enterprise web app development"]
    }
  }
];
