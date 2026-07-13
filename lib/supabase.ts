import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Seed Default Testimonials for out-of-the-box preview beauty
const DEFAULT_TESTIMONIALS = [
  {
    id: "default-1",
    name: "Shilpa Palli",
    business_name: "Nutrition & Wellness Consultant",
    rating: 5,
    review: "Sai Dheeraj created an incredibly professional Nutrition & Wellness Introduction Video for my practice. His ability to translate complex health concepts into engaging visual content is exceptional. The response from my clients has been outstanding, and the video has greatly enhanced my professional brand!",
    avatar_url: "gradient-0",
    photo_url: null,
    status: "approved",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "default-2",
    name: "Santhosh Juluri",
    business_name: "Legacy Tribute Client",
    rating: 5,
    review: "We commissioned NSD Creations for a custom AI Memorial Tribute Video to honor our family's heritage. Sai Dheeraj was exceptionally respectful, meticulously restored physical photographs from the 1970s, and edited an emotional storyline that brought tears to everyone who watched.",
    avatar_url: "gradient-1",
    photo_url: null,
    status: "approved",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "default-3",
    name: "Alexander Mercer",
    business_name: "Vanguard Tech Ventures",
    rating: 5,
    review: "The design precision and development speed NSD Creations brought to our SaaS product was game-changing. The interaction details, elegant typography, and absolute responsiveness set a new standard for our enterprise dashboard.",
    avatar_url: "gradient-2",
    photo_url: null,
    status: "approved",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

class MockSupabaseQueryBuilder {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getItems(): any[] {
    if (typeof window === "undefined") return [];
    const key = `mock_supabase_${this.tableName}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      if (this.tableName === "testimonials") {
        localStorage.setItem(key, JSON.stringify(DEFAULT_TESTIMONIALS));
        return DEFAULT_TESTIMONIALS;
      }
      return [];
    }
    return JSON.parse(stored);
  }

  private saveItems(items: any[]) {
    if (typeof window === "undefined") return;
    const key = `mock_supabase_${this.tableName}`;
    localStorage.setItem(key, JSON.stringify(items));

    // Broadcast change to other tabs/frames to simulate realtime updates
    try {
      const channel = new BroadcastChannel("supabase_mock_realtime_testimonials");
      channel.postMessage({ table: this.tableName, type: "change" });
    } catch (e) {
      // Fallback if BroadcastChannel is blocked/unsupported
    }
  }

  select(columns: string = "*") {
    let items = this.getItems();
    const builder = {
      eq: (col: string, val: any) => {
        items = items.filter((item) => item[col] === val);
        return builder;
      },
      order: (col: string, { ascending } = { ascending: true }) => {
        items = [...items].sort((a, b) => {
          if (a[col] < b[col]) return ascending ? -1 : 1;
          if (a[col] > b[col]) return ascending ? 1 : -1;
          return 0;
        });
        return builder;
      },
      then: (resolve: any) => {
        resolve({ data: items, error: null });
        return Promise.resolve({ data: items, error: null });
      }
    };
    return builder;
  }

  insert(values: any[]) {
    const items = this.getItems();
    const newItems = values.map((val) => ({
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      status: "pending",
      ...val
    }));
    const updated = [...items, ...newItems];
    this.saveItems(updated);

    return {
      then: (resolve: any) => {
        resolve({ data: newItems, error: null });
        return Promise.resolve({ data: newItems, error: null });
      }
    };
  }

  update(values: any) {
    let items = this.getItems();
    let updatedRows: any[] = [];
    const builder = {
      eq: (col: string, val: any) => {
        items = items.map((item) => {
          if (item[col] === val) {
            const updated = { ...item, ...values };
            updatedRows.push(updated);
            return updated;
          }
          return item;
        });
        this.saveItems(items);
        return builder;
      },
      then: (resolve: any) => {
        resolve({ data: updatedRows, error: null });
        return Promise.resolve({ data: updatedRows, error: null });
      }
    };
    return builder;
  }

  delete() {
    let items = this.getItems();
    let deletedRows: any[] = [];
    const builder = {
      eq: (col: string, val: any) => {
        deletedRows = items.filter((item) => item[col] === val);
        items = items.filter((item) => item[col] !== val);
        this.saveItems(items);
        return builder;
      },
      then: (resolve: any) => {
        resolve({ data: deletedRows, error: null });
        return Promise.resolve({ data: deletedRows, error: null });
      }
    };
    return builder;
  }
}

class MockSupabaseClient {
  from(tableName: string) {
    return new MockSupabaseQueryBuilder(tableName);
  }

  channel(channelName: string) {
    const channel = {
      on: (type: string, filter: any, callback: any) => {
        if (typeof window !== "undefined") {
          const bc = new BroadcastChannel("supabase_mock_realtime_testimonials");
          bc.onmessage = (event) => {
            if (event.data.table === "testimonials") {
              const builder = new MockSupabaseQueryBuilder("testimonials");
              builder.select("*").eq("status", "approved").order("created_at", { ascending: false }).then(({ data }: any) => {
                callback({
                  eventType: "UPDATE",
                  new: data,
                });
              });
            }
          };
        }
        return channel;
      },
      subscribe: (callback?: any) => {
        if (callback) callback("SUBSCRIBED");
        return channel;
      },
      unsubscribe: () => {
        // Mock unsubscribe handler
      }
    };
    return channel;
  }

  removeChannel(channel: any) {
    if (channel && typeof channel.unsubscribe === "function") {
      channel.unsubscribe();
    }
  }
}

// Export the active client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);

// Export status
export const SUPABASE_CONFIG_STATUS = {
  isConfigured: !!isSupabaseConfigured,
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
};

// SQL script to copy-paste for Supabase Table Setup
export const SUPABASE_SETUP_SQL = `-- CREATE TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  avatar_url TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES
-- 1. Allow anyone to read approved testimonials
CREATE POLICY "Allow public read access to approved testimonials" 
ON public.testimonials
FOR SELECT 
USING (status = 'approved');

-- 2. Allow anyone to submit a review (insert new testimonial)
CREATE POLICY "Allow public inserts" 
ON public.testimonials
FOR INSERT 
WITH CHECK (status = 'pending');

-- 3. Allow admins to manage all testimonials (assuming email or service role, or full access for development)
CREATE POLICY "Allow admin operations" 
ON public.testimonials
FOR ALL 
USING (true)
WITH CHECK (true);

-- ENABLE REALTIME
alter publication supabase_realtime add table testimonials;
`;
