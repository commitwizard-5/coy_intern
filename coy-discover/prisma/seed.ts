import { PrismaClient, type Profile } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────
// 📸 WHERE DO PHOTOS COME FROM?
// ─────────────────────────────────────────────────
// Using https://randomuser.me/api/portraits/ — free, no API key needed.
// These are realistic-looking AI-generated faces.
// Format: /portraits/women/{1-99}.jpg or /portraits/men/{1-99}.jpg
//
// Alternatives you can swap in:
//   • https://i.pravatar.cc/300?img={1-70}
//   • https://picsum.photos/seed/{name}/300/400
//   • https://ui-avatars.com/api/?name=Priya+Sharma&size=300&background=random
// ─────────────────────────────────────────────────

const profiles = [
  // ── Profiles that have ALREADY LIKED the current user (for instant matches) ──
  // The first seven profiles receive pre-seeded "LIKE" swipes toward the current user.
  {
    name: "Ananya Sharma",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    bio: "Chai over coffee, always. Film photography and old Bollywood songs 🎵",
    city: "Delhi",
    college: "Delhi University",
    interests: "photography,bollywood,chai,reading",
  },
  {
    name: "Riya Patel",
    age: 22,
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "MBA aspirant by day, stand-up comedy fan by night",
    city: "Mumbai",
    college: "NMIMS Mumbai",
    interests: "comedy,business,travel,food",
  },
  {
    name: "Meera Krishnan",
    age: 20,
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
    bio: "Bharatanatyam dancer | Coding my way through college 💻",
    city: "Chennai",
    college: "IIT Madras",
    interests: "dance,coding,classical-music,yoga",
  },
  {
    name: "Ishaan Malhotra",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Building startups and breaking PRs at the gym 🏋️",
    city: "Bangalore",
    college: "BITS Pilani",
    interests: "startups,fitness,tech,cricket",
  },
  {
    name: "Kavya Reddy",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Watercolor artist who also debugs React errors",
    city: "Hyderabad",
    college: "IIIT Hyderabad",
    interests: "art,react,painting,hiking",
  },
  {
    name: "Arjun Nair",
    age: 22,
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
    bio: "Backpacked 12 states. Next stop: your heart? 😄",
    city: "Kochi",
    college: "NIT Calicut",
    interests: "travel,backpacking,music,photography",
  },
  {
    name: "Simran Kaur",
    age: 20,
    photo: "https://randomuser.me/api/portraits/women/5.jpg",
    bio: "Punjabi food enthusiast & part-time meme curator",
    city: "Chandigarh",
    college: "PEC Chandigarh",
    interests: "food,memes,punjabi-music,netflix",
  },

  // ── Regular profiles (no pre-existing likes) ──
  {
    name: "Aditya Verma",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Mechanical engineer who writes poetry on weekends ✍️",
    city: "Pune",
    college: "COEP Pune",
    interests: "poetry,engineering,cricket,music",
  },
  {
    name: "Neha Gupta",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Cat mom × 3 | Data science intern | Overthinking champion",
    city: "Noida",
    college: "Amity University",
    interests: "cats,data-science,anime,cooking",
  },
  {
    name: "Rohit Desai",
    age: 24,
    photo: "https://randomuser.me/api/portraits/men/4.jpg",
    bio: "Guitar, good coffee, and long drives on empty highways 🎸",
    city: "Ahmedabad",
    college: "IIM Ahmedabad",
    interests: "guitar,coffee,driving,finance",
  },
  {
    name: "Tanya Singh",
    age: 22,
    photo: "https://randomuser.me/api/portraits/women/7.jpg",
    bio: "Law student who binge-watches crime docs for 'research'",
    city: "Lucknow",
    college: "NLSIU Bangalore",
    interests: "law,true-crime,debate,reading",
  },
  {
    name: "Vikram Joshi",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Frontend dev who thinks CSS is an art form",
    city: "Bangalore",
    college: "RV College",
    interests: "css,design,gaming,basketball",
  },
  {
    name: "Priya Menon",
    age: 20,
    photo: "https://randomuser.me/api/portraits/women/8.jpg",
    bio: "Marine biology nerd 🐠 Will talk about octopuses for hours",
    city: "Mangalore",
    college: "Manipal University",
    interests: "marine-biology,scuba,nature,documentaries",
  },
  {
    name: "Kabir Saxena",
    age: 22,
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
    bio: "Amateur astronomer | Will show you Saturn through my telescope",
    city: "Jaipur",
    college: "MNIT Jaipur",
    interests: "astronomy,physics,trekking,chess",
  },
  {
    name: "Diya Iyer",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/9.jpg",
    bio: "Carnatic singer turned EDM producer. Yes, it works 🎧",
    city: "Chennai",
    college: "SRM University",
    interests: "music-production,carnatic,edm,coffee",
  },
  {
    name: "Siddharth Rao",
    age: 24,
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
    bio: "PhD dropout, startup founder, still figuring it out",
    city: "Bangalore",
    college: "IISc Bangalore",
    interests: "startups,research,philosophy,running",
  },
  {
    name: "Aisha Khan",
    age: 22,
    photo: "https://randomuser.me/api/portraits/women/10.jpg",
    bio: "Fashion design student | Thrift shopping is my therapy 🛍️",
    city: "Mumbai",
    college: "NIFT Mumbai",
    interests: "fashion,thrifting,sketching,bollywood",
  },
  {
    name: "Karan Mehta",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/8.jpg",
    bio: "CA final cleared 📊 Now I have time for a life (finally)",
    city: "Surat",
    college: null,
    interests: "finance,cricket,cooking,travel",
  },
  {
    name: "Zara Sheikh",
    age: 20,
    photo: "https://randomuser.me/api/portraits/women/11.jpg",
    bio: "Bookstagram creator with 10k followers and zero chill 📚",
    city: "Delhi",
    college: "Lady Shri Ram College",
    interests: "books,writing,instagram,coffee",
  },
  {
    name: "Nikhil Banerjee",
    age: 22,
    photo: "https://randomuser.me/api/portraits/men/9.jpg",
    bio: "Tabla player × full-stack dev. I keep rhythm in code too 🥁",
    city: "Kolkata",
    college: "Jadavpur University",
    interests: "tabla,fullstack,bengali-food,football",
  },
  {
    name: "Pooja Thakur",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    bio: "Mountain girl stuck in a metro city. Trekking every weekend 🏔️",
    city: "Delhi",
    college: "DTU Delhi",
    interests: "trekking,mountains,photography,yoga",
  },
  {
    name: "Rahul Kapoor",
    age: 24,
    photo: "https://randomuser.me/api/portraits/men/10.jpg",
    bio: "Filmmaker | My short film got into 3 festivals this year 🎬",
    city: "Mumbai",
    college: "FTII Pune",
    interests: "filmmaking,cinema,writing,street-food",
  },
  {
    name: "Shreya Das",
    age: 22,
    photo: "https://randomuser.me/api/portraits/women/13.jpg",
    bio: "Biotech researcher by day, contemporary dancer by night 💃",
    city: "Pune",
    college: "Fergusson College",
    interests: "biotech,dance,science,art",
  },
  {
    name: "Arnav Sinha",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    bio: "Open-source contributor | 500+ GitHub commits this year 🟩",
    city: "Bangalore",
    college: "PES University",
    interests: "opensource,golang,linux,cycling",
  },
  {
    name: "Lavanya Pillai",
    age: 20,
    photo: "https://randomuser.me/api/portraits/women/14.jpg",
    bio: "Sustainable fashion advocate ♻️ Making eco look good",
    city: "Kochi",
    college: "CUSAT Kochi",
    interests: "sustainability,fashion,volunteering,yoga",
  },
  {
    name: "Dev Chauhan",
    age: 22,
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
    bio: "State-level swimmer 🏊 Also makes really good maggi",
    city: "Bhopal",
    college: "IIT Indore",
    interests: "swimming,cooking,fitness,anime",
  },
  {
    name: "Nandini Kulkarni",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/15.jpg",
    bio: "Astronomy club president | Let's stargaze on the first date ✨",
    city: "Pune",
    college: "IISER Pune",
    interests: "astronomy,physics,stargazing,coffee",
  },
  {
    name: "Harsh Agarwal",
    age: 23,
    photo: "https://randomuser.me/api/portraits/men/13.jpg",
    bio: "Competitive programmer | Codeforces Expert | Will solve your bugs",
    city: "Kanpur",
    college: "IIT Kanpur",
    interests: "competitive-programming,algorithms,chess,badminton",
  },
  {
    name: "Radhika Nair",
    age: 22,
    photo: "https://randomuser.me/api/portraits/women/16.jpg",
    bio: "Kathakali to K-pop — my playlist has zero coherence 🎶",
    city: "Trivandrum",
    college: "CET Trivandrum",
    interests: "kpop,classical-dance,music,travel",
  },
  {
    name: "Manav Tiwari",
    age: 24,
    photo: "https://randomuser.me/api/portraits/men/14.jpg",
    bio: "Product manager who secretly wants to be a chef 👨‍🍳",
    city: "Gurgaon",
    college: "IIT Delhi",
    interests: "product-management,cooking,ux-design,podcasts",
  },
  {
    name: "Sana Mirza",
    age: 21,
    photo: "https://randomuser.me/api/portraits/women/17.jpg",
    bio: "Urdu poetry × Python code. Both are beautiful to me 🌹",
    city: "Hyderabad",
    college: "BITS Hyderabad",
    interests: "poetry,python,urdu,calligraphy",
  },
  {
    name: "Yash Pandey",
    age: 22,
    photo: "https://randomuser.me/api/portraits/men/15.jpg",
    bio: "Campus radio host | My voice is better than my face, trust me 🎙️",
    city: "Varanasi",
    college: "BHU Varanasi",
    interests: "radio,music,storytelling,cricket",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  const { currentUser, createdProfiles, profilesWhoLikedYou } =
    await prisma.$transaction(async (tx) => {
      await tx.match.deleteMany();
      await tx.swipe.deleteMany();
      await tx.profile.deleteMany();

      const currentUser = await tx.profile.create({
        data: {
          name: "You",
          age: 22,
          photo:
            "https://ui-avatars.com/api/?name=You&size=300&background=6366f1&color=fff",
          bio: "This is you!",
          city: "Mumbai",
          college: "Your College",
          interests: "tech,music,travel",
          isCurrentUser: true,
        },
      });

      const createdProfiles: Pick<Profile, "id" | "name">[] = [];
      for (const profile of profiles) {
        const created = await tx.profile.create({ data: profile });
        createdProfiles.push(created);
      }

      const profilesWhoLikedYou = createdProfiles.slice(0, 7);
      for (const profile of profilesWhoLikedYou) {
        await tx.swipe.create({
          data: {
            swiperId: profile.id,
            swipedId: currentUser.id,
            action: "LIKE",
          },
        });
      }

      return { currentUser, createdProfiles, profilesWhoLikedYou };
    });

  console.log(
    `✅ Created current user: ${currentUser.name} (ID: ${currentUser.id})`
  );
  console.log(`✅ Created ${createdProfiles.length} profiles`);
  console.log(
    `✅ Pre-seeded ${profilesWhoLikedYou.length} likes toward current user`
  );
  console.log(
    `   (${profilesWhoLikedYou.map((profile) => profile.name).join(", ")})`
  );

  console.log("\n🎉 Seeding complete!");
  console.log(`   Total profiles: ${createdProfiles.length + 1}`);
  console.log(`   Profiles who liked you: ${profilesWhoLikedYou.length}`);
  console.log(`   Swipe right on them for instant matches!\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
