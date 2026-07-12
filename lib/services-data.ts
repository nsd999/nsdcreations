export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  overview: string;
  benefits: string[];
  process: { title: string; description: string }[];
  deliverables: string[];
  technologies: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: Record<string, ServiceDetail> = {
  "ai-video-advertisements": {
    slug: "ai-video-advertisements",
    title: "AI Video Advertisements",
    tagline: "High-retention social commercials that drive conversions.",
    category: "AI Creative & Video Production",
    description: "Create stunning short-form and long-form video advertisements for social platforms using cutting-edge generative AI video models.",
    overview: "In a digital-first era, static images no longer convert. Our AI Video Advertisements service combines raw creative direction with modern AI generation models to deliver cinematic-quality social ads. Ideal for Instagram Reels, YouTube Shorts, and Facebook Ads campaigns at a fraction of standard production costs.",
    benefits: [
      "Up to 10x lower cost than traditional commercial production shoots.",
      "Extremely rapid turnaround—get multiple variations in days, not months.",
      "Optimized for high retention rates with snappy AI visual transitions.",
      "Multi-lingual voiceovers using custom professional brand voices."
    ],
    process: [
      { title: "Scriptwriting & Copy", description: "Crafting a killer direct-response video script focusing on hooks, emotional pillars, and CTAs." },
      { title: "AI Prompting & Rendering", description: "Generating cinematic, high-definition AI assets and motion frames curated to your brand guidelines." },
      { title: "Professional Audio Synthesis", description: "Integrating custom voiceovers, background tracks, sound effects, and clean typography overlays." },
      { title: "Iterative Review", description: "Refining visual timing, colour grading, and rendering the final ultra-sharp commercial export." }
    ],
    deliverables: [
      "Primary Ad Concept Video (FHD MP4/MOV formats)",
      "3 high-performing alternative hook variations for A/B testing",
      "Full professional direct-response copywriting script",
      "Optimized vertical (9:16) and landscape (16:9) formats"
    ],
    technologies: ["AI Generative Video", "High-Definition Upscaling", "Symphonic Audio Synthesis", "Professional Post-Production"],
    faqs: [
      { question: "What do I need to provide to start?", answer: "All we need is a description of your product, service, or target audience. If you have brand assets (logos, images, brand colors), you can share those as well!" },
      { question: "Do you use realistic voiceovers?", answer: "Yes, we use top-tier synthetic voice clones that sound completely human, expressive, and professional, supporting multiple accents and regional languages." }
    ]
  },
  "ai-product-commercials": {
    slug: "ai-product-commercials",
    title: "AI Product Commercials",
    tagline: "Virtual product launches and elegant brand visuals.",
    category: "AI Creative & Video Production",
    description: "Launch products without setting up expensive photography stages. We build hyper-realistic AI product advertisements.",
    overview: "Traditional commercial photography requires expensive studio setups, props, and lighting systems. Our AI Product Commercials combine generative image tools with modern 3D projection to render your physical product in any setting imaginable—from a luxurious quartz surface to a breathtaking natural landscape.",
    benefits: [
      "Zero logistical cost for shipping products to physical studios.",
      "Unlimited creative backdrops and photorealistic lighting rigs.",
      "Highly professional commercial output built for luxury, e-commerce, and digital brands.",
      "Staged environments that make your product look five times more premium."
    ],
    process: [
      { title: "Product Analysis", description: "Studying your physical product geometry, labels, and core sales hooks." },
      { title: "Virtual Lighting & Framing", description: "Placing your product in premium, eye-catching virtual sets with dynamic camera motion." },
      { title: "Commercial Rendering", description: "Exporting high-fidelity cinematic video files with rich musical scores." }
    ],
    deliverables: [
      "1x Core Product Commercial Video (30 seconds)",
      "5x Ultra-premium static product photoshoot catalog renders",
      "Format crops optimized for social feeds and website headers"
    ],
    technologies: ["Photorealistic AI Modeling", "Dynamic Camera Motion Tracking", "Digital Lighting Engine"],
    faqs: [
      { question: "Can I use these for physically small products?", answer: "Absolutely! E-commerce products like cosmetics, jewelry, gadgets, and beverages are perfect candidates for gorgeous, hyper-realistic virtual staging." },
      { question: "Is the branding on my product preserved accurately?", answer: "Yes, we use advanced layer masks and vector alignments to ensure your exact logos, typography, and package details remain crystal-clear and un-distorted." }
    ]
  },
  "ai-ugc-advertisements": {
    slug: "ai-ugc-advertisements",
    title: "AI UGC Advertisement Videos",
    tagline: "High-converting User Generated Content powered by digital creators.",
    category: "AI Creative & Video Production",
    description: "Connect with your audience using relatable, high-trust User Generated Content (UGC) videos synthesized with photorealistic AI actors.",
    overview: "Modern consumers trust relatable people over corporate billboards. Our AI UGC Advertisements provide the high-converting power of user-generated content without the pain of hiring, managing, and shipping products to human influencers. We generate hyper-realistic, native-looking testimonial and unboxing videos with natural-speaking brand advocates.",
    benefits: [
      "No costly creator sourcing, contract negotiations, or usage rights fees.",
      "Script and visual changes done instantly without scheduling reshoots.",
      "Extremely organic look and feel that blends seamlessly into social feeds.",
      "Proven to increase click-through rates by up to 45% compared to traditional ads."
    ],
    process: [
      { title: "UGC Persona Matching", description: "Selecting the ideal digital advocate persona matching your target demographic." },
      { title: "Viral Scripting", description: "Writing natural, high-retention script with authentic hooks, problem introduction, and direct-response CTA." },
      { title: "Seamless Generation", description: "Rendering natural gestures, expressions, and highly realistic voice synchronization." },
      { title: "Social-First Editing", description: "Adding native captions, graphic overlays, and platform emojis for a high-retention social feed feel." }
    ],
    deliverables: [
      "Primary UGC Testimonial Video (9:16 vertical format)",
      "Alternative hook and call-to-action variants",
      "Printable script with direct-response strategy details"
    ],
    technologies: ["Digital Human Synthesis", "Direct-Response Scriptwriting", "Social Platform Native Video Editing"],
    faqs: [
      { question: "Does the video look realistic?", answer: "Yes! We use cutting-edge, state-of-the-art visual models that ensure lip-sync, blinking, and facial micro-expressions are entirely natural and indistinguishable from real recordings." },
      { question: "Can we use different languages?", answer: "Absolutely. We can produce UGC advertisements in English, Spanish, Hindi, Telugu, and over 40 other regional languages." }
    ]
  },
  "marketing-videos": {
    slug: "marketing-videos",
    title: "Marketing Videos",
    tagline: "Corporate explainers, brand journeys, and digital content.",
    category: "AI Creative & Video Production",
    description: "Establish elite market authority with custom promotional reels, educational video content, and animated brand explainers.",
    overview: "From introducing your business model to onboarding high-value clients, standard text descriptions are no longer sufficient. Our Marketing Videos service builds high-production explainer reels, company presentations, and product walk-throughs designed to retain viewer attention and drive action.",
    benefits: [
      "Simplifies complex services or business products into clean, visual stories.",
      "Significantly increases the time visitors spend on your landing pages.",
      "Perfect for email marketing, sales pitches, and corporate presentations.",
      "Engaging cinematic-grade backing tracks and custom-animated typography."
    ],
    process: [
      { title: "Concept Boarding", description: "Mapping out the storytelling sequence, core service features, and style guide." },
      { title: "Visual Assets Assembly", description: "Combining premium motion graphics, custom AI renders, and brand layouts." },
      { title: "Audio & Editing Setup", description: "Synchronizing high-quality background scores, natural voiceover tracks, and transitions." }
    ],
    deliverables: [
      "Full HD Marketing Explainer Video",
      "Shorter cuts optimized for email newsletters and landing page embeds",
      "Full digital storyboard guide and script archive"
    ],
    technologies: ["Vector Animation Engine", "Professional Motion Graphics", "Multi-Track Audio Engineering"],
    faqs: [
      { question: "What is the typical turnaround time?", answer: "Most marketing videos take between 3 to 7 business days from script approval." },
      { question: "Can we use our own company voiceover?", answer: "Yes, you can provide your own recordings, or we can clone your voice with studio-grade clarity." }
    ]
  },
  "tribute-videos": {
    slug: "tribute-videos",
    title: "Tribute Videos",
    tagline: "Preserving legacy through emotional and cinematic storytelling.",
    category: "AI Creative & Video Production",
    description: "Preserve the precious legacy of loved ones with high-quality photo restoration, moving narratives, and professional music editing.",
    overview: "NSD Creations began with deep family roots. Our Tribute Videos service honors the memory and legacy of family pioneers, business founders, and loved ones. We restore historical family photographs, craft highly emotional stories, and synchronize audio to leave an everlasting impact.",
    benefits: [
      "Santhosh Juluri testimonial: 'Deeply moved the viewers with tear-inducing emotional visual pacing.'",
      "Restoration of older, low-resolution, damaged physical or digital photos.",
      "Symphonic music arrangement and pacing designed to connect generations.",
      "Fully personalized scripting that respects values and memory."
    ],
    process: [
      { title: "Asset Collection & Clean-Up", description: "Receiving legacy photographs and applying AI enhancements to clean dust, tears, and restore colors." },
      { title: "Legacy Interview or Scripting", description: "Writing a respectful, chronological life-journey script based on key family or professional milestones." },
      { title: "Cinematic Editing", description: "Arranging restored photos into a flowing timeline with emotional depth, zoom-transitions, and voice tracks." },
      { title: "Symphonic Audio Overlay", description: "Merging background instrumentals and sound engineering to evoke deep emotion." }
    ],
    deliverables: [
      "Master Legacy / Tribute Video in high resolution",
      "Archive pack containing all enhanced/restored photographs",
      "Private Google Drive link for easy sharing with relatives worldwide"
    ],
    technologies: ["Digital Photo Restoration Engine", "High-Definition Upscaling", "Cinematic Transitions System"],
    faqs: [
      { question: "What if my photos are very old or blurry?", answer: "We specialize in digital photo restoration. We use proprietary deep-learning tools to rebuild lost details, colorize black-and-white photos, and make them look crisp on modern screens." },
      { question: "What is the typical length of a legacy video?", answer: "Most tribute videos run between 5 to 12 minutes, keeping a perfect balance of chronological story, emotion, and audience attention." }
    ]
  },
  "poster-designing": {
    slug: "poster-designing",
    title: "Poster Designing",
    tagline: "Eye-catching, high-impact poster and flyer graphics.",
    category: "Creative Branding & Graphic Design",
    description: "Stunning promotional posters, event banners, and digital graphics built to grab immediate visual attention.",
    overview: "Whether you are hosting an educational seminar, a restaurant grand opening, or launching a campaign, your poster is your visual calling card. Our Poster Designing service focuses on bold layout grids, strong color theory, and premium typography that demands attention in physical and social spaces.",
    benefits: [
      "Designed with optimal readability and high conversion principles.",
      "Available in both CMYK (print-ready) and RGB (digital sharing) formats.",
      "Bespoke designs custom-made for your exact brand guidelines.",
      "Incorporation of premium custom digital graphic elements."
    ],
    process: [
      { title: "Creative Brief", description: "Identifying core event details, tone, target audience, and size dimensions." },
      { title: "Wireframing Layout", description: "Mapping visual hierarchy—ensuring titles and main CTAs pop immediately." },
      { title: "Illustrative Design", description: "Crafting graphic background elements, typography curves, and visual contrast." },
      { title: "Print & Export Prep", description: "Color-matching and delivering final files in print-optimized PDFs." }
    ],
    deliverables: [
      "High-Resolution Print PDF with bleed lines",
      "Optimized JPEG/PNG for social media networks and WhatsApp broadcasts",
      "Source asset file for future adjustments"
    ],
    technologies: ["Professional Layout Grid Design", "High-Fidelity Vector Graphics", "Digital Typography Styling"],
    faqs: [
      { question: "Do you provide source files?", answer: "Yes, we include layered source files in our premium design bundles so your teams can make quick updates later." },
      { question: "How fast can you deliver a poster?", answer: "Standard delivery is between 24 to 48 hours depending on design complexity." }
    ]
  },
  "graphic-designing": {
    slug: "graphic-designing",
    title: "Graphic Designing",
    tagline: "Consistent, professional graphics for a robust brand identity.",
    category: "Creative Branding & Graphic Design",
    description: "Everyday marketing graphics, social assets, custom brochures, and company stationary that looks elite.",
    overview: "Your graphic style is the silent ambassador of your business. Our Graphic Designing service provides growing businesses and corporate brands with beautiful everyday assets—including digital brochures, business cards, menu cards, and slide decks—crafted with a premium commercial finish.",
    benefits: [
      "Consistent visual identity across all online and offline platforms.",
      "High-contrast, clean modern aesthetics following custom brand rules.",
      "No generic templates—every asset is built from scratch.",
      "Premium level visual clarity for informational graphics."
    ],
    process: [
      { title: "Style Guideline Setup", description: "Analyzing or setting up your brand colors, fonts, and graphical rules." },
      { title: "Asset Draft", description: "Creating rapid design drafts of requested brochures or marketing kits." },
      { title: "Polish & Detail", description: "Adding custom elements, micro-shadows, and layout balancing." },
      { title: "Batch Exporting", description: "Formatting for various media needs, websites, and printing." }
    ],
    deliverables: [
      "Complete visual asset bundle styled as requested",
      "Vector layouts (SVG, EPS, PDF)",
      "Ready-to-use digital grids for social channels"
    ],
    technologies: ["Professional Vector Styling", "High-Contrast Layout Balancing", "Digital Asset Composition"],
    faqs: [
      { question: "Can you redesign our existing brochures?", answer: "Yes! We can take your legacy brochures or documents and redesign them into ultra-premium modern marketing handouts." },
      { question: "Do you design restaurant menu cards?", answer: "Yes, restaurant and cafe menu styling is one of our creative design specialties." }
    ]
  },
  "branding": {
    slug: "branding",
    title: "Branding & Brand Identity",
    tagline: "Unforgettable, premium brand assets that position you as the leader.",
    category: "Creative Branding & Graphic Design",
    description: "Premium logo design, color typography guides, and brand architecture that positions you above the competition.",
    overview: "Branding is not just a logo—it's the emotional connection your client has with your business. We design high-end, cohesive, and modern brand identities. From elite color psychology charts to elegant typography pairings, we ensure your brand commands authority and premium pricing.",
    benefits: [
      "Command higher prices by presenting a premium corporate brand.",
      "100% custom-crafted vector logos—no templates, no shortcuts.",
      "Full design systems containing rules for colors, fonts, and imagery.",
      "Slick, clean modern layouts designed to build long-term client trust."
    ],
    process: [
      { title: "Discovery & Vibe Board", description: "Pinpointing your brand essence, style preferences (minimal, bold, luxury), and audience values." },
      { title: "Logo Concepts", description: "Sketching and refining 3 unique, high-concept modern vector logos." },
      { title: "Typography & Color Pairing", description: "Selecting elite font structures and color codes built for visual accessibility." },
      { title: "Style Manual Creation", description: "Assembling a complete brand book containing all rules for future designers." }
    ],
    deliverables: [
      "Master vector logo files (AI, SVG, EPS, PDF, transparent PNG)",
      "High-contrast secondary icon variants and favicon formats",
      "Interactive Digital Brand Guidelines document (Brand Book)",
      "Curated professional typography set recommendations"
    ],
    technologies: ["Bespoke Logo Vector Design", "Color Psychology Engineering", "Corporate Design System Setup"],
    faqs: [
      { question: "Will I own the full copyrights to the logo?", answer: "Yes, upon final project payment, complete copyrights of the chosen logo and assets belong entirely to your business." },
      { question: "Do you design business stationery?", answer: "Yes! All branding bundles can be expanded to include premium business cards, letterheads, invoice templates, and envelopes." }
    ]
  },
  "social-media-management": {
    slug: "social-media-management",
    title: "Social Media Management",
    tagline: "Organic, aesthetic, and compounding social media growth.",
    category: "Digital Marketing & Strategy",
    description: "Take back your time. We script, design, and schedule beautiful social feeds that reflect elite brand authority.",
    overview: "An inactive social media profile makes a business look closed. Our Social Media Management handles your visual grid design, caption writing, and content scheduling, transforming your profiles into trustworthy digital storefronts that organically attract client inquiries.",
    benefits: [
      "Consistent, professional social feed aesthetics designed by top creatives.",
      "Engaging, valuable caption copywriting focused on your industry authority.",
      "Full content calendar management—no stress about what or when to post.",
      "Strategic keyword, hashtag, and bio optimizations."
    ],
    process: [
      { title: "Visual Theme Alignment", description: "Setting up a premium, unified aesthetic grid (colors, layout rules) for your feeds." },
      { title: "Monthly Content Calendar", description: "Brainstorming and writing 15 to 30 custom content concepts and carousel scripts." },
      { title: "Graphic Assets Creation", description: "Designing high-definition graphics, carousel frames, and social cover thumbnails." },
      { title: "Auto-Scheduling & Handover", description: "Scheduling posts at optimal times and delivering raw files for native story engagements." }
    ],
    deliverables: [
      "Curated grid visual guidelines layout map",
      "15 to 30 custom designed, high-definition carousel / static social posts",
      "Fully structured captions with researched hashtags",
      "Monthly organic performance progress report"
    ],
    technologies: ["Aesthetic Layout Composition", "Content Calendar Automation", "Targeted Social Copywriting"],
    faqs: [
      { question: "Do you reply to comments and direct messages?", answer: "Our standard packages focus purely on content strategy, copywriting, and design. However, custom team integrations for daily lead response can be requested." },
      { question: "Is there a minimum contract length?", answer: "We work on highly flexible month-to-month retainers, though a 3-month commitment is recommended to see strong organic community growth." }
    ]
  },
  "digital-marketing": {
    slug: "digital-marketing",
    title: "Digital Marketing",
    tagline: "ROI-driven digital marketing and on-page search visibility.",
    category: "Digital Marketing & Strategy",
    description: "Accelerate your client acquisitions through hyper-targeted search ads, organic visibility, and custom high-conversion landing pages.",
    overview: "Traffic without conversions is a waste of money. Our Digital Marketing service aligns paid search campaigns with highly structured conversion pages. We double down on local and technical search optimizations, making sure your brand ranks when prospective clients search for your services.",
    benefits: [
      "Highly optimized campaign setups that eliminate wasted advertising budgets.",
      "Focus on actual conversions (leads, sales, calls) instead of vain clicks.",
      "Elite landing page designs that load instantly and hold attention.",
      "In-depth monthly transparent performance reporting."
    ],
    process: [
      { title: "Competitor Analysis", description: "Auditing your direct competitors' ad scripts, search positions, and core offers." },
      { title: "Ad Campaign Design", description: "Writing high-relevance search copies and configuring advanced geo-demographic targeting." },
      { title: "Conversion Page Setup", description: "Building a custom, fast, modern landing page matching the ad campaign focus." },
      { title: "Optimization & Scaling", description: "A/B testing copies, checking device bid metrics, and scaling top performers." }
    ],
    deliverables: [
      "Active search and social advertising campaign configuration",
      "Ultra-fast custom conversion landing page",
      "Comprehensive digital marketing campaign strategy document",
      "Monthly KPI reporting dashboard link"
    ],
    technologies: ["Targeted Ads Optimization", "Search Visibility Auditing", "High-Conversion Copywriting"],
    faqs: [
      { question: "What is the recommended advertising budget?", answer: "We recommend starting with a minimum ad spend of ₹10,000 per month to gather enough market data, though we can optimize for smaller local budgets." },
      { question: "How long before we see search results?", answer: "While paid ads generate leads instantly, organic search rankings usually start seeing compounding positive movements within 60 to 90 days." }
    ]
  },
  "ai-automation": {
    slug: "ai-automation",
    title: "AI Automation Solutions",
    tagline: "Supercharge your business productivity with custom intelligent workflows.",
    category: "AI, WhatsApp & Business Automation",
    description: "Automate repetitive daily tasks, content generation, and email outreach using custom-engineered intelligent visual workflows.",
    overview: "Staff hours spent copy-pasting, drafting basic responses, and managing spreadsheets is lost capital. Our AI Automation services map your custom business workflows, connecting powerful AI engines and data structures to automate documents, classify leads, and trigger actions in real-time.",
    benefits: [
      "Save up to 80% of administrative staff hours on manual data sorting.",
      "Instant 24/7 lead grading, response drafting, and CRM entry.",
      "Custom workflows tailored exactly to your unique company processes.",
      "Easy maintenance with zero technical overhead after initial configuration."
    ],
    process: [
      { title: "Operational Audit", description: "Mapping out your team's repetitive tasks, sheet tracking, and document flows." },
      { title: "Workflow Architecture", description: "Designing secure visual pipelines connecting your daily apps (Slack, Gmail, Sheets) with AI connectors." },
      { title: "Custom Agent Setup", description: "Calibrating systems to ensure output is accurate, on-brand, and reliable." },
      { title: "Sandbox Testing & Launch", description: "Running safety logs, calibrating edge cases, and pushing the system live." }
    ],
    deliverables: [
      "Fully operational automated digital workflow system",
      "Interactive step-by-step video tutorial and workflow documentation",
      "1 month of post-launch optimization monitoring"
    ],
    technologies: ["Intelligent Digital Workflows", "Intelligent Prompt Tuning", "Automated Action Triggers"],
    faqs: [
      { question: "Will this replace my employees?", answer: "No, AI automations act as digital super-assistants, taking over boring, repetitive tasks so your core team can focus on creative growth and sales." },
      { question: "Do I need technical skills to manage this?", answer: "Not at all. We build workflows using clean, visual pipelines and hand over simple, clear user manuals for adjustments." }
    ]
  },
  "whatsapp-automation": {
    slug: "whatsapp-automation",
    title: "WhatsApp Automation",
    tagline: "Direct-to-mobile chat marketing and 24/7 client support.",
    category: "AI, WhatsApp & Business Automation",
    description: "Automate client support, send transaction updates, and launch promotional broadcasts on WhatsApp.",
    overview: "Email open rates hover around 15%, while WhatsApp messages enjoy an incredible 98% open rate. Our WhatsApp Automation service helps you build official API-powered conversational chatbots, automated delivery notifications, and marketing broadcasts that connect directly with your audience.",
    benefits: [
      "Instantly engage with potential leads while their buying intent is highest.",
      "Automated FAQ handlers, reducing customer support load by over 60%.",
      "Official business verification support.",
      "Secure, mass broadcast panels that prevent spam blocking."
    ],
    process: [
      { title: "API Configuration", description: "Guiding you through setting up your business communications and WhatsApp phone line." },
      { title: "Flowchart Design", description: "Mapping the exact conversation tree, questions, and automated answers." },
      { title: "Database & Webhook Hookup", description: "Connecting your bot to your catalog store, Google Sheets, or custom database." },
      { title: "Live Calibrations", description: "Testing user prompts, voice message handles, and pushing the chat service live." }
    ],
    deliverables: [
      "Official communications integration setup",
      "Complete visual chatbot conversation flow architecture",
      "Auto-sync script connecting customer chats directly with Google Sheets",
      "Custom messaging templates approved by official guidelines"
    ],
    technologies: ["Official Business API", "Visual Conversation Flows", "Data Sync Webhooks"],
    faqs: [
      { question: "Can we use our existing business phone number?", answer: "Yes, you can register your existing landline or mobile number for the official API, provided it is verified." },
      { question: "Are there extra message costs?", answer: "The official API has small per-conversation fees. We design flows to resolve queries within a single session to keep costs as low as possible." }
    ]
  },
  "business-automation": {
    slug: "business-automation",
    title: "Business Automation",
    tagline: "Unify your business systems, invoice models, and workflows.",
    category: "AI, WhatsApp & Business Automation",
    description: "Streamline customer onboarding, automate invoice routing, and sync sales pipelines into a single high-efficiency machine.",
    overview: "When your customer inquiries, invoicing, task tracking, and follow-ups are scattered, critical details get missed. Our Business Automation builds custom CRM pipelines, automates customer feedback loops, and routes transaction notifications instantly—helping you run a paperless, friction-free office.",
    benefits: [
      "Eliminate manual invoice emailing and payment tracking hours.",
      "Onboard new clients instantly with zero delay in document processing.",
      "Keep entire team updated via automated central notifications.",
      "Clean operational structure that scales seamlessly as sales grow."
    ],
    process: [
      { title: "Process Mapping", description: "Documenting every action from a customer's first inquiry to final project sign-off." },
      { title: "CRM Setup & Custom Fields", description: "Configuring user-friendly platforms for easy pipeline tracking." },
      { title: "Trigger Setup", description: "Setting up automated actions (e.g. 'When payment is verified, trigger custom thank-you notifications and create a shared digital workspace')." },
      { title: "Staff Training Session", description: "Providing a quick, screen-recorded video guide showing your team how simple the system is to use." }
    ],
    deliverables: [
      "Operational automated business CRM setup",
      "Custom invoice and contract automatic email triggers",
      "Interactive onboarding database structure",
      "Detailed visual pipeline documentation"
    ],
    technologies: ["Digital CRM Integration", "Automated Document Delivery", "Sales Pipeline Automation"],
    faqs: [
      { question: "Can we connect our payment processors?", answer: "Yes! We can set up secure webhooks that trigger actions as soon as your payment processor verifies transactions, providing real-time notification alerts." },
      { question: "What if our business model is highly unique?", answer: "We specialize in fully bespoke business flows. During the initial audit, we map out custom variables and logic triggers specific to your operational needs." }
    ]
  },
  "website-development": {
    slug: "website-development",
    title: "Website Development",
    tagline: "Ultra-fast custom business websites engineered to convert.",
    category: "Website & App Development",
    description: "Forget slow page loads or generic visual builders. We craft hand-coded, search-optimized, blazing-fast business websites.",
    overview: "Your website is your ultimate conversion funnel. If it loads slowly, you are losing up to 50% of your potential clients. We build blazing-fast, hand-coded Business Websites, Landing Pages, and E-commerce Websites engineered specifically for lead generation, rapid page loading, and long-term client trust.",
    benefits: [
      "Blazing loading speeds and responsive page performance.",
      "Clean, modern SaaS styling comparable to Stripe, Apple, and Linear.",
      "Fully responsive—perfect rendering on mobiles, tablets, and massive screens.",
      "Comprehensive on-page search visibility setup (clean metadata, structured schema, sitemaps)."
    ],
    process: [
      { title: "UX Layout Blueprinting", description: "Drafting high-conversion layouts prioritizing value proposition and CTAs." },
      { title: "UI Creative Mockups", description: "Designing gorgeous, premium, high-fidelity visual interfaces in Dark & Light modes." },
      { title: "Clean Frontend Coding", description: "Writing lightweight, clean, secure web blocks and components with beautiful motion effects." },
      { title: "Deployment & Optimization", description: "Optimizing image weights, asset loading, and hosting on robust digital edge servers." }
    ],
    deliverables: [
      "100% hand-coded responsive website source code",
      "Full cloud deploy pipeline configuration for automatic loading",
      "Integrated analytics tracker and premium contact forms",
      "Custom brand typography set and optimized svg illustrations"
    ],
    technologies: ["Professional Web Architectures", "High-Performance Edge Deployment", "Search Engine Optimization (SEO)"],
    faqs: [
      { question: "Do you use slow WordPress templates?", answer: "No. Every line of code is handwritten to match your unique brand requirements. This ensures maximum security, unbeatable speed, and complete design freedom." },
      { question: "Do you integrate contact forms?", answer: "Yes! We wire all contact forms to direct emails, WhatsApp notifications, or Google Forms so you never miss a client lead." }
    ]
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    tagline: "High-performance iOS and Android mobile applications.",
    category: "Website & App Development",
    description: "Bespoke Mobile Applications crafted with intuitive UI, offline sync, and native fluid speed.",
    overview: "A great mobile application is not just a responsive website in a wrapper—it requires smooth animations, optimized memory footprints, and instant touch feedback. We build lightweight cross-platform applications that deliver premium performance on both iOS and Android.",
    benefits: [
      "Single streamlined code engine for both Android and iOS, cutting costs in half.",
      "Fluid, responsive UI with touch targets optimized for all mobile screen ratios.",
      "Robust client-side caching and secure offline capabilities.",
      "Full App Store and Google Play console launch coordination."
    ],
    process: [
      { title: "User Journey Mapping", description: "Defining screen layouts, routing paths, and key touch points." },
      { title: "High-Fidelity App UI", description: "Creating stunning visual screens tailored to mobile thumb reach." },
      { title: "Robust App Coding", description: "Building responsive modules with state-of-the-art mobile frameworks." },
      { title: "Rigorous Sandbox Testing", description: "Debugging behaviors across simulator heights, foldables, and real devices." }
    ],
    deliverables: [
      "Production-ready mobile app source code repository",
      "Compiled Android APK / iOS build folder",
      "Secure digital database integration and documentation",
      "App Store & Play Store asset metadata pack"
    ],
    technologies: ["Cross-Platform Mobile Architectures", "Offline Data Sync Engines", "Mobile UI Layout Optimizations"],
    faqs: [
      { question: "Will my app work offline?", answer: "Yes, we implement secure local storage databases so users can read content and prepare data even without active internet connections." },
      { question: "Do you assist with publishing to stores?", answer: "Absolutely! We guide you step-by-step through setting up your developer accounts and handle the full submission process." }
    ]
  },
  "custom-software-development": {
    slug: "custom-software-development",
    title: "Custom Software Development",
    tagline: "Tailored business software built for performance and scale.",
    category: "Website & App Development",
    description: "Bespoke Business Software, advanced admin portals, and custom API integrations built from the ground up.",
    overview: "Sometimes, standard off-the-shelf software doesn't fit your operational scale or brand security. We design and build secure, bespoke web applications, central database panels, and backend APIs tailored exactly to your business rules, engineered using robust, custom-grade digital solutions.",
    benefits: [
      "100% customized to your exact requirements with complete feature freedom.",
      "Highly scalable systems designed to handle thousands of concurrent queries.",
      "Ultra-secure architectures protecting sensitive client transactions.",
      "Complete ownership of code with zero ongoing vendor dependencies."
    ],
    process: [
      { title: "Technical Blueprinting", description: "Writing a clear, exhaustive technical specifications document covering database logic and APIs." },
      { title: "Interactive UX Prototypes", description: "Mapping advanced layouts and visual state paths before writing code." },
      { title: "Modular Engine Development", description: "Building robust backend endpoints and database schemas." },
      { title: "Unit Testing & Cloud Rollout", description: "Deploying secure server setups and running stress testing to ensure reliable scaling." }
    ],
    deliverables: [
      "Clean, fully documented custom software codebase",
      "Full administrator control panel with secure role authorization",
      "Comprehensive digital API mapping documentation",
      "Automated database backup configurations and security logs"
    ],
    technologies: ["Custom Database Architectures", "Secure API Systems", "Cloud Container Deployment"],
    faqs: [
      { question: "Will we have full access to the code?", answer: "Yes, we hand over full repository ownership. The entire system is deployed directly onto your secure cloud servers." },
      { question: "Do you offer post-launch code maintenance?", answer: "Yes, we provide flexible monthly maintenance packages to monitor server loads, run database checks, and add new features as your business grows." }
    ]
  }
};
