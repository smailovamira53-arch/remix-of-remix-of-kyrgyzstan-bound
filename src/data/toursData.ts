import tourYurtCamp from '@/assets/tour-yurt-camp.jpg';
import tourHorseTrek from '@/assets/tour-horse-trek.jpg';
import tourSongKul from '@/assets/tour-song-kul.jpg';
import tourAlaArcha from '@/assets/tour-ala-archa.jpg';
import tourBurana from '@/assets/tour-burana.jpg';

export type TourCategory = 'package' | 'day' | 'multi-day';

export interface TourDay {
  day: number;
  title: string;
  description: string;
}

export interface TourData {
  slug: string;
  image: string;
  gallery?: string[];
  title: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  maxGroup: number;
  featured?: boolean;
  category: TourCategory;
  description: string;
  fullDescription: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: TourDay[];
}

export const toursData: TourData[] = [
  // ── TOUR PACKAGES (premium all-inclusive) ──
  {
    slug: 'issyk-kul-adventure',
    image: tourYurtCamp,
    title: '7-Day Issyk-Kul Lake & Mountain Adventure',
    location: 'Issyk-Kul Region',
    duration: '7 Days / 6 Nights',
    price: 890,
    rating: 4.9,
    reviewCount: 127,
    maxGroup: 12,
    featured: true,
    category: 'package',
    description: 'Explore pristine Issyk-Kul lake, mountains, yurts and nomadic life.',
    fullDescription: 'Embark on an unforgettable 7-day journey around Issyk-Kul, the second-largest alpine lake in the world. Experience the stunning beauty of the Tien Shan mountains, sleep in traditional yurts, and immerse yourself in the rich nomadic culture of Kyrgyzstan. This comprehensive tour covers the best highlights of the Issyk-Kul region, from red rock canyons to alpine valleys.',
    highlights: [
      'Swim in crystal-clear Issyk-Kul Lake',
      'Stay in traditional yurt camps',
      'Visit the famous Jeti-Oguz red rocks',
      'Explore Karakol and its Russian Orthodox church',
      'Horseback riding through alpine meadows',
      'Traditional Kyrgyz cuisine and kumis tasting',
    ],
    included: [
      'All accommodations (hotels & yurt camps)',
      'All meals (breakfast, lunch, dinner)',
      'Private transportation with driver',
      'English-speaking guide',
      'All entrance fees',
      'Horseback riding (1 day)',
      'Airport transfers',
    ],
    notIncluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Tips for guide and driver',
      'Alcoholic beverages',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Bishkek', description: 'Arrive at Manas International Airport. Transfer to hotel in Bishkek. Welcome dinner with traditional Kyrgyz dishes.' },
      { day: 2, title: 'Bishkek to Karakol', description: 'Drive along the northern shore of Issyk-Kul Lake. Stop at Cholpon-Ata petroglyphs. Continue to Karakol (380 km, 5-6 hours). Evening walk in the town.' },
      { day: 3, title: 'Jeti-Oguz Valley', description: 'Morning visit to Jeti-Oguz (Seven Bulls) red rock formations. Hike to the Broken Heart rock. Traditional lunch with local family. Return to Karakol.' },
      { day: 4, title: 'Altyn Arashan Hot Springs', description: 'Drive to Altyn Arashan valley. Trek through pristine mountain landscapes. Relax in natural hot springs. Overnight in yurt camp.' },
      { day: 5, title: 'Horseback Riding Day', description: 'Full day horseback riding through alpine meadows. Picnic lunch by a mountain stream. Experience traditional nomadic herding.' },
      { day: 6, title: 'Southern Shore & Skazka Canyon', description: 'Drive along the southern shore. Visit Skazka (Fairytale) Canyon with its surreal rock formations. Beach time at Issyk-Kul. Farewell dinner.' },
      { day: 7, title: 'Departure', description: 'Morning transfer to Bishkek (4 hours). Optional city tour. Transfer to airport for departure.' },
    ],
  },
  {
    slug: 'almaty-bishkek-adventure',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
    title: 'From Almaty to Bishkek',
    location: 'Kazakhstan - Kyrgyzstan',
    duration: '6 Days / 5 Nights',
    price: 990,
    rating: 4.8,
    reviewCount: 45,
    maxGroup: 10,
    featured: true,
    category: 'package',
    description: 'Cross-border adventure through stunning mountain passes and alpine lakes.',
    fullDescription: 'Experience the best of two Central Asian countries on this unique cross-border adventure. Starting in Almaty, Kazakhstan, travel through dramatic mountain landscapes, cross into Kyrgyzstan, and explore the highlights of both nations before ending in Bishkek.',
    highlights: [
      'Visit Big Almaty Lake in Kazakhstan',
      'Cross the stunning Karkara border',
      'Explore Karakol and Issyk-Kul',
      'Experience two different cultures',
      'Mountain passes over 3,000m',
      'Photography opportunities galore',
    ],
    included: [
      'All accommodations',
      'All meals',
      'Private transport in both countries',
      'English-speaking guides',
      'Border crossing assistance',
      'Entrance fees',
    ],
    notIncluded: [
      'Visa fees (if applicable)',
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Tips',
    ],
    itinerary: [
      { day: 1, title: 'Almaty City', description: 'Arrive in Almaty. City tour including Zenkov Cathedral, Green Bazaar, and Panfilov Park. Welcome dinner with Kazakh cuisine.' },
      { day: 2, title: 'Big Almaty Lake & Charyn Canyon', description: 'Morning trip to stunning Big Almaty Lake. Afternoon excursion to Charyn Canyon, the "Grand Canyon of Central Asia". Return to Almaty.' },
      { day: 3, title: 'Almaty to Karakol (Border Crossing)', description: 'Early departure via Karkara Valley. Cross into Kyrgyzstan at scenic border. Continue to Karakol. Evening exploration of the town.' },
      { day: 4, title: 'Jeti-Oguz Valley', description: 'Full day exploring Jeti-Oguz. Hike to viewpoints. Traditional yurt lunch. Optional horseback riding. Return to Karakol.' },
      { day: 5, title: 'Issyk-Kul to Bishkek', description: 'Drive along Issyk-Kul Lake. Stop at Cholpon-Ata petroglyphs. Continue through Boom Canyon. Arrive Bishkek. Farewell dinner.' },
      { day: 6, title: 'Departure from Bishkek', description: 'Optional morning city tour. Transfer to Manas Airport for departure.' },
    ],
  },
  {
    slug: 'silk-road-explorer',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    title: '10-Day Silk Road Explorer Package',
    location: 'Bishkek – Issyk-Kul – Son-Kul',
    duration: '10 Days / 9 Nights',
    price: 1490,
    rating: 5.0,
    reviewCount: 32,
    maxGroup: 10,
    featured: true,
    category: 'package',
    description: 'The ultimate all-inclusive Kyrgyzstan experience along ancient Silk Road routes.',
    fullDescription: 'Our flagship package covers everything: Bishkek, Son-Kul, Issyk-Kul, Karakol, yurt stays, horseback riding, eagle-hunting demo, and cultural workshops. Private guide, all meals, premium accommodation.',
    highlights: [
      'Private English-speaking guide throughout',
      'Eagle hunting demonstration',
      'Son-Kul & Issyk-Kul lakes',
      'Felt-making & cooking workshops',
      'Horseback riding & hot springs',
      'All-inclusive premium accommodation',
    ],
    included: ['All accommodation', 'All meals', 'Private guide & driver', 'All activities & entrance fees', 'Airport transfers', 'Horseback riding (2 days)'],
    notIncluded: ['International flights', 'Travel insurance', 'Personal expenses', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival in Bishkek', description: 'Airport pickup. City tour. Welcome dinner.' },
      { day: 2, title: 'Bishkek – Kochkor', description: 'Drive to Kochkor. Felt-making workshop.' },
      { day: 3, title: 'Kochkor – Son-Kul', description: 'Horse trek to Son-Kul Lake. Yurt camp.' },
      { day: 4, title: 'Son-Kul – Karakol', description: 'Scenic drive via mountain passes.' },
      { day: 5, title: 'Jeti-Oguz Valley', description: 'Full-day horseback exploration.' },
      { day: 6, title: 'Altyn Arashan', description: 'Trek to hot springs. Overnight yurt.' },
      { day: 7, title: 'Karakol – Cholpon-Ata', description: 'Drive along Issyk-Kul shore. Petroglyphs.' },
      { day: 8, title: 'Eagle Hunting & Culture', description: 'Eagle-hunting demo. Traditional games.' },
      { day: 9, title: 'Issyk-Kul Relaxation', description: 'Beach day. Skazka Canyon. Farewell dinner.' },
      { day: 10, title: 'Departure', description: 'Transfer to Bishkek. Airport drop-off.' },
    ],
  },

  // ── DAY EXCURSIONS (1 day, short) ──
  {
    slug: 'ala-archa-day-hike',
    image: tourAlaArcha,
    title: 'Ala-Archa National Park Day Hike',
    location: 'Bishkek',
    duration: '1 Day',
    price: 65,
    rating: 4.8,
    reviewCount: 203,
    maxGroup: 15,
    featured: false,
    category: 'day',
    description: 'Escape the city for a day hike in the stunning Ala-Archa gorge near Bishkek.',
    fullDescription: 'A perfect introduction to Kyrgyzstan\'s mountains. Just 40 minutes from Bishkek, Ala-Archa National Park offers dramatic mountain scenery, waterfalls, and well-maintained trails. Choose from easy valley walks to challenging glacier viewpoints.',
    highlights: [
      'Scenic mountain trails for all levels',
      'Ak-Sai Waterfall viewpoint',
      'Stunning Tien-Shan panoramas',
      'Picnic lunch in the mountains',
      'Great for photography',
      'Perfect half-day escape from Bishkek',
    ],
    included: ['Transport from/to Bishkek', 'Park entrance fee', 'English-speaking guide', 'Packed lunch & water'],
    notIncluded: ['Personal gear', 'Tips', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Ala-Archa Day Hike', description: 'Morning pickup from Bishkek. Drive to Ala-Archa (40 min). Hike to Ak-Sai waterfall viewpoint. Picnic lunch. Return to Bishkek by 5 PM.' },
    ],
  },
  {
    slug: 'burana-tower-excursion',
    image: tourBurana,
    title: 'Burana Tower & Petroglyphs Day Trip',
    location: 'Chuy Valley',
    duration: '1 Day',
    price: 75,
    rating: 4.7,
    reviewCount: 156,
    maxGroup: 15,
    featured: false,
    category: 'day',
    description: 'Visit the ancient Burana Tower minaret and open-air museum of Bal-Bals stone carvings.',
    fullDescription: 'Step back in time on this cultural day trip to the Burana Tower, an 11th-century minaret and UNESCO-nominated site. Explore the surrounding collection of ancient Turkic stone carvings (Bal-Bals) and learn about the Silk Road city of Balasagun.',
    highlights: [
      'Climb the 11th-century Burana Tower',
      'Ancient Turkic Bal-Bals stone sculptures',
      'Silk Road history & museum',
      'Traditional lunch in Tokmok',
      'Panoramic views of Chuy Valley',
      'Easy half-day trip from Bishkek',
    ],
    included: ['Transport from/to Bishkek', 'Entrance fees', 'English-speaking guide', 'Lunch'],
    notIncluded: ['Personal expenses', 'Tips', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Burana & Petroglyphs', description: 'Depart Bishkek 9 AM. Visit Burana Tower and museum. Explore Bal-Bals. Lunch in Tokmok. Optional stop at Cholpon-Ata petroglyphs. Return by 5 PM.' },
    ],
  },
  {
    slug: 'bishkek-city-food-tour',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    title: 'Bishkek City & Food Walking Tour',
    location: 'Bishkek',
    duration: '1 Day',
    price: 45,
    rating: 4.9,
    reviewCount: 89,
    maxGroup: 12,
    featured: false,
    category: 'day',
    description: 'Explore Bishkek\'s vibrant bazaars, Soviet architecture, and taste local cuisine.',
    fullDescription: 'Discover the capital of Kyrgyzstan on foot. Visit the Osh Bazaar, try beshbarmak, laghman, and samsa at local eateries, explore Soviet-era landmarks, and learn about Kyrgyz culture and history with a local guide.',
    highlights: [
      'Osh Bazaar food tasting',
      'Soviet-era architecture tour',
      'Panfilov Park & Oak Park',
      'Traditional Kyrgyz cuisine sampling',
      'Local craft beer tasting',
      'Hidden gems & street art',
    ],
    included: ['Walking guide', 'All food tastings (5+ stops)', 'Drinks', 'Local transport if needed'],
    notIncluded: ['Personal shopping', 'Tips', 'Hotel pickup'],
    itinerary: [
      { day: 1, title: 'Bishkek City & Food Tour', description: 'Meet at 10 AM at Ala-Too Square. Walk through Panfilov Park. Osh Bazaar food tasting. Lunch at traditional café. Afternoon architecture walk. Craft beer stop. End at 5 PM.' },
    ],
  },

  // ── MULTI-DAY TOURS (4+ days adventure) ──
  {
    slug: 'jeti-oguz-horse-trek',
    image: tourHorseTrek,
    title: 'Horse Trekking through Jeti-Oguz Valley',
    location: 'Karakol, Issyk-Kul',
    duration: '3 Days / 2 Nights',
    price: 450,
    rating: 4.8,
    reviewCount: 89,
    maxGroup: 8,
    featured: false,
    category: 'multi-day',
    description: 'Ride through stunning red canyons of Jeti-Oguz with traditional Kyrgyz lunch.',
    fullDescription: 'Experience the thrill of horseback riding through one of Kyrgyzstan\'s most spectacular landscapes. The Jeti-Oguz valley, named after its famous Seven Bulls red rock formations, offers dramatic scenery, alpine meadows, and a genuine taste of nomadic life. This tour is perfect for both beginners and experienced riders.',
    highlights: [
      'Ride Kyrgyz horses through alpine meadows',
      'See the famous Seven Bulls rock formation',
      'Visit the Broken Heart cliff',
      'Stay in authentic yurt camps',
      'Learn traditional horsemanship',
      'Enjoy panoramic mountain views',
    ],
    included: ['Horse and riding equipment', 'Experienced horse guide', 'Yurt accommodation (2 nights)', 'All meals during trek', 'English-speaking guide', 'Transport from/to Karakol'],
    notIncluded: ['Transport to Karakol', 'Travel insurance', 'Personal expenses', 'Tips'],
    itinerary: [
      { day: 1, title: 'Karakol to Jeti-Oguz', description: 'Meet in Karakol, transfer to Jeti-Oguz. Horse selection and briefing. Begin trek through the valley. Overnight in yurt camp near waterfalls.' },
      { day: 2, title: 'Full Day Riding', description: 'Ride through Kok-Jayik valley surrounded by snow-capped peaks. Picnic lunch at alpine lake. Afternoon ride to higher pastures. Evening around campfire.' },
      { day: 3, title: 'Return & Departure', description: 'Morning ride back through different route. Visit Seven Bulls viewpoint. Traditional lunch. Transfer back to Karakol by afternoon.' },
    ],
  },
  {
    slug: 'song-kol-karakol-weekly',
    image: tourSongKul,
    title: 'Weekly Trip to Song-Kol and Karakol',
    location: 'Song-Kol & Karakol',
    duration: '5 Days / 4 Nights',
    price: 450,
    rating: 4.9,
    reviewCount: 64,
    maxGroup: 10,
    featured: false,
    category: 'multi-day',
    description: 'Explore pristine alpine lakes and immerse yourself in Kyrgyz culture.',
    fullDescription: 'Join our most popular weekly departure tour combining the magical high-altitude Song-Kol Lake with the cultural hub of Karakol. This perfectly balanced itinerary offers stunning natural beauty, authentic nomadic experiences, and comfortable accommodations.',
    highlights: [
      'Camp at Song-Kol Lake (3,016m altitude)',
      'Witness spectacular sunrises and sunsets',
      'Experience authentic yurt life with nomads',
      'Explore Karakol town and surroundings',
      'Visit Dungan Mosque and Russian Orthodox Church',
      'Taste fermented mare\'s milk (kumis)',
    ],
    included: ['All accommodations', 'All meals', 'Private transport', 'English-speaking guide', 'Entrance fees', 'Bishkek airport transfers'],
    notIncluded: ['Flights', 'Travel insurance', 'Personal items', 'Tips', 'Alcoholic drinks'],
    itinerary: [
      { day: 1, title: 'Bishkek to Kochkor', description: 'Depart Bishkek, drive through Boom Canyon. Visit felt-making workshop in Kochkor. Continue to guesthouse.' },
      { day: 2, title: 'Song-Kol Lake', description: 'Drive over 3,500m pass to Song-Kol. Settle into yurt camp. Afternoon horseback riding optional. Watch sunset over the lake.' },
      { day: 3, title: 'Song-Kol to Karakol', description: 'Sunrise at the lake. Cross the mountains via Kalmak-Ashuu Pass. Arrive in Karakol evening.' },
      { day: 4, title: 'Karakol Exploration', description: 'Visit Dungan Mosque and Orthodox Church. Day trip to Jeti-Oguz valley. Optional hot springs.' },
      { day: 5, title: 'Return to Bishkek', description: 'Scenic drive along Issyk-Kul southern shore. Stop at Skazka Canyon. Arrive Bishkek afternoon.' },
    ],
  },
  {
    slug: 'horseback-song-kol-3day',
    image: tourHorseTrek,
    title: '3-Day Horseback Adventure to Song-Kol',
    location: 'Song-Kol Lake',
    duration: '3 Days / 2 Nights',
    price: 220,
    rating: 4.7,
    reviewCount: 38,
    maxGroup: 8,
    featured: false,
    category: 'multi-day',
    description: 'Experience traditional nomadic horseback riding to the alpine lake.',
    fullDescription: 'Follow ancient nomadic routes on horseback to the breathtaking Song-Kol Lake. This adventure offers an authentic experience of Kyrgyz nomadic life, riding through mountain passes and alpine meadows just as herders have done for centuries.',
    highlights: [
      'Ride on traditional Kyrgyz horses',
      'Cross mountain passes over 3,000m',
      'Camp in yurts at Song-Kol Lake',
      'Experience authentic nomadic lifestyle',
      'Stargazing at high altitude',
      'Traditional Kyrgyz food',
    ],
    included: ['Horses and equipment', 'Experienced horse guides', 'Yurt accommodation', 'All meals during trek', 'English-speaking guide'],
    notIncluded: ['Transport to/from Kochkor', 'Travel insurance', 'Personal items', 'Tips'],
    itinerary: [
      { day: 1, title: 'Kochkor to Jailoo Camp', description: 'Meet in Kochkor village. Horse briefing and assignment. Begin riding toward mountains. Camp at shepherd\'s jailoo.' },
      { day: 2, title: 'Song-Kol Lake', description: 'Ride over the pass (3,500m). Descend to Song-Kol Lake. Afternoon free. Watch sunset. Traditional dinner in yurt.' },
      { day: 3, title: 'Return to Kochkor', description: 'Morning ride around lake shore. Begin descent via different route. Arrive Kochkor by late afternoon.' },
    ],
  },
  {
    slug: 'arslanbob-walnut-forest',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop',
    title: '4-Day Arslanbob Walnut Forest Trek',
    location: 'Jalal-Abad Region',
    duration: '4 Days / 3 Nights',
    price: 380,
    rating: 4.8,
    reviewCount: 41,
    maxGroup: 10,
    featured: false,
    category: 'multi-day',
    description: 'Trek through the world\'s largest walnut forest and visit stunning waterfalls.',
    fullDescription: 'Discover Arslanbob — home to the largest natural walnut forest on Earth. Trek through lush valleys, visit sacred waterfalls, and stay with Uzbek families in this unique cultural melting pot of southern Kyrgyzstan.',
    highlights: [
      'World\'s largest natural walnut forest',
      'Two stunning waterfalls',
      'Homestay with local Uzbek family',
      'Mountain trekking through lush valleys',
      'Cultural immersion in southern Kyrgyzstan',
      'Traditional bread-baking workshop',
    ],
    included: ['Homestay accommodation', 'All meals', 'English-speaking guide', 'Transport from Bishkek', 'Trekking guide'],
    notIncluded: ['Personal gear', 'Travel insurance', 'Tips', 'Snacks'],
    itinerary: [
      { day: 1, title: 'Bishkek to Arslanbob', description: 'Domestic flight to Jalal-Abad. Drive to Arslanbob village. Homestay check-in. Evening village walk.' },
      { day: 2, title: 'Small Waterfall & Forest', description: 'Trek to the small waterfall. Walk through ancient walnut groves. Bread-baking workshop. Evening storytelling.' },
      { day: 3, title: 'Big Waterfall Trek', description: 'Full-day trek to the big waterfall (80m). Panoramic viewpoints. Picnic lunch in the forest. Return to homestay.' },
      { day: 4, title: 'Return to Bishkek', description: 'Morning in the village. Transfer to Jalal-Abad. Flight back to Bishkek.' },
    ],
  },
];

export const getTourBySlug = (slug: string): TourData | undefined => {
  return toursData.find((tour) => tour.slug === slug);
};
