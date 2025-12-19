export type TeamGroup =
  | "Shareholders"
  | "Leadership"
  | "Marketing & Client Relations"
  | "HR & Recruitment"
  | "Technology"
  | "Administration"
  | "IT & Support"
  | "Recruitment"
  | "Client Teams"
  | "Pet Family";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  image?: string; // Optional headshot URL (allowed domains configured in next.config.ts)
  // Optional CSS classes to control how the image is fitted/positioned per member
  // Examples: "object-cover", "object-contain", "object-top object-cover"
  imageClass?: string;
  summary?: string;
  bullets: string[];
}

// Tip: Add or edit people here. If no image is available, simply omit the image field
// and the UI will render an avatar with initials automatically.
export const teamMembers: TeamMember[] = [
  {
    id: "miguel-angel-rendon",
    name: "Miguel A. Rendon",
    role: "Founder",
    group: "Leadership",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/miguel_rendon_resolution.jpg",
    summary: "Business Administrator",
    bullets: [
      "Proudly served in the U.S. Navy for 22 years, building a distinguished career marked by discipline, leadership, and a deep commitment to service.",
      "Dad to one awesome kid and one loyal dog.",
      "Deep passion for fitness, animals, the natural world, salsa dancing, and playing instruments.",
      "In his free time, Miguel is often found hiking mountains and exploring volcanoes, lakes, and rivers.",
    ],
    imageClass: "object-cover",
  },
  // Technology
  {
    id: "ruben-dario-romero",
    name: "Ruben D. Romero",
    role: "Chief Technology Officer",
    group: "Technology",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/ruben_romero.jpg",
    summary: "Computer Engineer",
    bullets: [
      "Leads technology strategy, digital transformation, innovation, and agile practices.",
      "Extensive experience in tech project management and agile roles: Agile Project Manager, Scrum Master, Agile Coach, Agile Delivery Manager.",
      "Certified in Scrum Master, Agile Coach, Kanban, Product Owner, OKR, and Management 3.0.",
      "Adaptive leadership, high-performance teams, and result‑driven solutions.",
      "Purpose: connect technology with people to create sustainable value.",
      "Hobbies: traveling, virtual aviation, beach, and movies.",
    ],
    imageClass: "object-cover",
  },
  {
    id: "nicole-chica",
    name: "Nicole Chica",
    role: " Director, Marketing and Client Relations",
    group: "Marketing & Client Relations",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/Nicole.jpg",
    summary: "Business Administrator",
    bullets: [
      "Has worked in sales, research interviewing, banking, U.S. Diplomacy, and marketing, a dynamic career shaped by adaptability and global perspective as a military spouse.",
      "Mom of a teenager boy and Brownie (forever in her heart). Recently adopted furry daughter, now Barketing Assitant",
      "Committed to improving her physical and emotional well-being; enjoys exploring new places, dancing, spending time with loved ones, and being close to animals, plants, and the beach.",
    ],
    imageClass: "object-cover",
  },
  {
    id: "laura-chica",
    name: "Laura A. Chica",
    role: "Manager, HR and Recruitment",
    group: "HR & Recruitment",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/laura_empresaria.jpg",
    summary: "Psychologist",
    bullets: [
      "Mom of two cats, Casper and Bagheera, Directors of Purr-sonal Affairs and soon welcoming a puppy.",
      "Passionate about supporting team well-being and building strong connections.",
      "Loves learning new things; often takes courses on a variety of topics and enjoys pondering the idea that we might all be living in the Matrix.",
    ],
    // Crop from the bottom by anchoring to the top and slightly zooming in to hide the bottom star
    imageClass: "object-cover image-position-top image-zoom-top",
  },
  // Administration
  {
    id: "violeta-quintero",
    name: "Violeta A. Quintero",
    role: "Administrative Coordinator",
    group: "Administration",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/alejandra.png",
    summary: "Business Administrator",
    bullets: [
      "The heart behind our operations at Andes.",
      "Career through management, customer service, and community service—always people- and purpose‑focused.",
      "Originally from Colombia, now living in Paris with her husband, two boys, and two fabulous cats (our Feline Fun Facilitators).",
      "Loves dancing, cooking, traveling, and making the most of family time.",
    ],
    imageClass: "object-cover image-position-top",
  },
  {
    id: "maria-alejandra-vargas",
    name: "Maria A. Vargas",
    role: "Assistant Administrative Coordinator",
    group: "Administration",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/maria_alejandra_arias.jpg",
    summary: "Business Administrator, specialized in Service Management",
    bullets: [
      "Extensive background in commercial and administrative roles; known for organization, commitment, and a service‑oriented mindset.",
      "Speaks Spanish, English, and French.",
      "Lived in France, strengthening her French and embracing multicultural experiences.",
      "Lives with her beloved dog, our Fur‑st Impressions Coordinator.",
      "Loves traveling, baking delicious desserts, and spending quality time with her family.",
    ],
    imageClass: "object-cover",
  },
  // IT & Support
  {
    id: "mateo-castro",
    name: "Mateo Castro",
    role: "IT Support Analyst",
    group: "IT & Support",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/mateo_castro.jpg",
    summary: "Software Development Technology in progress",
    bullets: [
      "Experience in hardware and software maintenance, system assembly, and remote support.",
      "Shares his home with three curious cats who keep him company while he works and games—our Meowketing Assistants.",
      "When he's not solving tech issues, you’ll find him skateboarding through the city or diving into his favorite video games.",
    ],
    imageClass: "object-cover",
  },
  // Recruitment
  {
    id: "daniela-ramirez",
    name: "Daniela Ramirez",
    role: "Assistant Recruitment Manager",
    group: "Recruitment",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/daniela-ramirez.jpg",
    summary: "",
    bullets: [
      "Industrial Engineer with a Master’s in Quality and Integrated Management Systems, bringing experience in HR recruiting, customer service, and legal support.",
      "Proud mom to one dog and four cats, all happily rescued.",
      "Passionate about helping people, optimizing processes, and creating work environments that feel more human.",
      "Loves staying active, enjoying weekend hikes with her dog, and relaxing at home with a great movie.",
      "Values quality time with family and believes that balance is the key to doing exceptional work.",
    ],
    imageClass: "object-cover",
  },
  // Client Teams
  // {
  //   id: "carlos-soto",
  //   name: "Carlos Soto",
  //   role: "VA Process Team Lead at Tabak Law",
  //   group: "Client Teams",
  //   image:
  //     "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/carlos_soto.jpg",
  //   summary: "Industrial Engineer",
  //   bullets: [
  //     "Experienced Project Management and Planning Analyst, recognized for his strong leadership and ability to bring teams together",
  //     "Carlos has spent the past few years working with law firms, developing deep expertise in Veteran Affairs and streamlining processes for greater efficiency",
  //     "Enjoys cooking desserts, singing, and gaming.",
  //     "Lives with his playful puppy and recently moved to Panama with his wife, embracing a new adventure together",
  //   ],
  // },
  // Pet Family
  {
    id: "brownie",
    name: "Brownie",
    role: "Former Chief Treat Officer (Oct 23, 2015 – Sept 03, 2025)",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/brownie.jpg",
    bullets: [
      "Brought endless joy and love to our team—especially when snacks were involved!",
      "His cheerful spirit made every day brighter; his legacy lives on in our hearts and workspace.",
    ],
  },
  {
    id: "simona",
    name: "Simona",
    role: "Barketing Assistant",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/simona.jpg",
    bullets: [
      "Specializes in tail‑wagging team morale.",
      "Oversees snack inventory and nap scheduling.",
      "Expert in client greetings and paw‑sitive vibes.",
    ],
  },
  {
    id: "casper",
    name: "Casper",
    role: "Director of Purr‑sonal Affairs",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/casper.jpg",
    bullets: [
      "Master of emotional support and spontaneous cuddle sessions.",
      "Expert in stress relief via purring and lap occupation.",
      "Responsible for daily office patrols and sunbeam lounging.",
    ],
  },
  {
    id: "bagheera",
    name: "Bagheera",
    role: "Director of Purr‑sonal Affairs",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/bagheera.jpg",
    bullets: [
      "Master of emotional support and spontaneous cuddle sessions.",
      "Expert in stress relief via purring and lap occupation.",
      "Responsible for daily office patrols and sunbeam lounging.",
    ],
  },
  {
    id: "alaska",
    name: "Alaska",
    role: "Feline Fun Facilitator",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/alaska.jpg",
    bullets: [
      "Junior joy specialist—only 3 months old and already mastering playful chaos and zoomies.",
    ],
  },
  {
    id: "queen",
    name: "Queen",
    role: "Feline Fun Facilitator",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/queen.jpg",
    bullets: [
      "Senior nap executive; majestic fluff with grumpy charm and zero tolerance for nonsense.",
    ],
  },
  {
    id: "toby",
    name: "Toby",
    role: "Junior Meowketing Specialist",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/toby.jpg",
    bullets: [
      "Youngest team member with the biggest paws and the biggest heart.",
      "Large, lovable, and always ready to play.",
      "Passionate about chasing imaginary bugs and supervising from high places.",
    ],
  },
  {
    id: "emilia",
    name: "Emilia",
    role: "Executive Cuddle Consultant",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/emilia.jpg",
    bullets: [
      "Provides daily inspiration through unexpected Zoom appearances.",
      "The tiniest diva with the loudest demands.",
      "Delivers daily doses of sass and sweetness.",
    ],
  },
  {
    id: "kira",
    name: "Kira",
    role: "Senior Nap Strategist",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/kira.jpg",
    bullets: [
      "The wise veteran with a majestic fluff and a love for lounging.",
      "Supervises from comfy spots with minimal movement.",
      "Proudly plus-size, deeply experienced, and always snack-ready.",
    ],
  },
  {
    id: "alana",
    name: "Alana",
    role: "Fur‑st Impressions Coordinator",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/alana.jpg",
    bullets: [
      "Greets everyone with tail wags and instant charm.",
      "Ensures all visitors feel welcome (and slightly covered in fur).",
      "Expert in sniff‑based background checks and belly‑rub negotiations.",
    ],
  },
  {
    id: "ozzy",
    name: "Ozzy",
    role: "Junior Pawblic Relations Intern",
    group: "Pet Family",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/team/ozzy.jpg",
    bullets: [
      "Mastering the art of chew‑toy diplomacy.",
      "Brings boundless energy and puppy‑eyed charm to every meeting.",
      "Still learning the ropes but already a pro at stealing hearts.",
    ],
  },
];
