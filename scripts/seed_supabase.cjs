const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEFAULT_TESTIMONIALS = [
  {
    name: "Shilpa Palli",
    business_name: "Nutrition & Wellness Consultant",
    rating: 5,
    review: "Sai Dheeraj created an incredibly professional Nutrition & Wellness Introduction Video for my practice. His ability to translate complex health concepts into engaging visual content is exceptional. The response from my clients has been outstanding, and the video has greatly enhanced my professional brand!",
    avatar_url: "gradient-0",
    status: "approved",
    context_slug: null
  },
  {
    name: "Santhosh Juluri",
    business_name: "Legacy Tribute Client",
    rating: 5,
    review: "We commissioned NSD Creations for a custom AI Memorial Tribute Video to honor our family's heritage. Sai Dheeraj was exceptionally respectful, meticulously restored physical photographs from the 1970s, and edited an emotional storyline that brought tears to everyone who watched.",
    avatar_url: "gradient-1",
    status: "approved",
    context_slug: null
  }
];

async function seed() {
  console.log("Seeding testimonials to Supabase...");
  const { data, error } = await supabase.from('testimonials').insert(DEFAULT_TESTIMONIALS).select();
  
  if (error) {
    console.error("Error inserting data. Please ensure you have created the 'testimonials' table using the SQL script first.");
    console.error(error);
  } else {
    console.log("Success! Testimonials seeded:", data.length);
  }
}

seed();
