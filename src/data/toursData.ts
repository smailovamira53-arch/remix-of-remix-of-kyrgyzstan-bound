import tourYurtCamp from '@/assets/tour-yurt-camp.jpg';
import tourHorseTrek from '@/assets/tour-horse-trek.jpg';
import tourSongKul from '@/assets/tour-song-kul.jpg';

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
  description: string;
  fullDescription: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: TourDay[];
}

export const toursData: TourData[] = [
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
      {
        day: 1,
        title: 'Arrival in Bishkek',
        description: 'Arrive at Manas International Airport. Transfer to hotel in Bishkek. Welcome dinner with traditional Kyrgyz dishes.',
      },
      {
        day: 2,
        title: 'Bishkek to Karakol',
        description: 'Drive along the northern shore of Issyk-Kul Lake. Stop at Cholpon-Ata petroglyphs. Continue to Karakol (380 km, 5-6 hours). Evening walk in the town.',
      },
      {
        day: 3,
        title: 'Jeti-Oguz Valley',
        description: 'Morning visit to Jeti-Oguz (Seven Bulls) red rock formations. Hike to the Broken Heart rock. Traditional lunch with local family. Return to Karakol.',
      },
      {
        day: 4,
        title: 'Altyn Arashan Hot Springs',
        description: 'Drive to Altyn Arashan valley. Trek through pristine mountain landscapes. Relax in natural hot springs. Overnight in yurt camp.',
      },
      {
        day: 5,
        title: 'Horseback Riding Day',
        description: 'Full day horseback riding through alpine meadows. Picnic lunch by a mountain stream. Experience traditional nomadic herding.',
      },
      {
        day: 6,
        title: 'Southern Shore & Skazka Canyon',
        description: 'Drive along the southern shore. Visit Skazka (Fairytale) Canyon with its surreal rock formations. Beach time at Issyk-Kul. Farewell dinner.',
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Morning transfer to Bishkek (4 hours). Optional city tour. Transfer to airport for departure.',
      },
    ],
  },
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
    included: [
      'Horse and riding equipment',
      'Experienced horse guide',
      'Yurt accommodation (2 nights)',
      'All meals during trek',
      'English-speaking guide',
      'Transport from/to Karakol',
    ],
    notIncluded: [
      'Transport to Karakol',
      'Travel insurance',
      'Personal expenses',
      'Tips',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Karakol to Jeti-Oguz',
        description: 'Meet in Karakol, transfer to Jeti-Oguz. Horse selection and briefing. Begin trek through the valley. Overnight in yurt camp near waterfalls.',
      },
      {
        day: 2,
        title: 'Full Day Riding',
        description: 'Ride through Kok-Jayik valley surrounded by snow-capped peaks. Picnic lunch at alpine lake. Afternoon ride to higher pastures. Evening around campfire.',
      },
      {
        day: 3,
        title: 'Return & Departure',
        description: 'Morning ride back through different route. Visit Seven Bulls viewpoint. Traditional lunch. Transfer back to Karakol by afternoon.',
      },
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
    included: [
      'All accommodations',
      'All meals',
      'Private transport',
      'English-speaking guide',
      'Entrance fees',
      'Bishkek airport transfers',
    ],
    notIncluded: [
      'Flights',
      'Travel insurance',
      'Personal items',
      'Tips',
      'Alcoholic drinks',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bishkek to Kochkor',
        description: 'Depart Bishkek, drive through Boom Canyon. Visit felt-making workshop in Kochkor. Continue to guesthouse. Introduction to Kyrgyz crafts.',
      },
      {
        day: 2,
        title: 'Song-Kol Lake',
        description: 'Drive over 3,500m pass to Song-Kol. Settle into yurt camp. Afternoon horseback riding optional. Watch sunset over the lake. Traditional dinner.',
      },
      {
        day: 3,
        title: 'Song-Kol to Karakol',
        description: 'Sunrise at the lake. Breakfast with nomads. Cross the mountains via Kalmak-Ashuu Pass. Arrive in Karakol evening. Hotel check-in.',
      },
      {
        day: 4,
        title: 'Karakol Exploration',
        description: 'Visit Dungan Mosque and Orthodox Church. Day trip to Jeti-Oguz valley. Optional hot springs visit. Farewell dinner in town.',
      },
      {
        day: 5,
        title: 'Return to Bishkek',
        description: 'Scenic drive along Issyk-Kul southern shore. Stop at Skazka Canyon. Arrive Bishkek afternoon. Transfer to airport or hotel.',
      },
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
      {
        day: 1,
        title: 'Almaty City',
        description: 'Arrive in Almaty. City tour including Zenkov Cathedral, Green Bazaar, and Panfilov Park. Welcome dinner with Kazakh cuisine.',
      },
      {
        day: 2,
        title: 'Big Almaty Lake & Charyn Canyon',
        description: 'Morning trip to stunning Big Almaty Lake. Afternoon excursion to Charyn Canyon, the \"Grand Canyon of Central Asia\". Return to Almaty.',
      },
      {
        day: 3,
        title: 'Almaty to Karakol (Border Crossing)',
        description: 'Early departure via Karkara Valley. Cross into Kyrgyzstan at scenic border. Continue to Karakol. Evening exploration of the town.',
      },
      {
        day: 4,
        title: 'Jeti-Oguz Valley',
        description: 'Full day exploring Jeti-Oguz. Hike to viewpoints. Traditional yurt lunch. Optional horseback riding. Return to Karakol.',
      },
      {
        day: 5,
        title: 'Issyk-Kul to Bishkek',
        description: 'Drive along Issyk-Kul Lake. Stop at Cholpon-Ata petroglyphs. Continue through Boom Canyon. Arrive Bishkek. Farewell dinner.',
      },
      {
        day: 6,
        title: 'Departure from Bishkek',
        description: 'Optional morning city tour. Transfer to Manas Airport for departure.',
      },
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
    included: [
      'Horses and equipment',
      'Experienced horse guides',
      'Yurt accommodation',
      'All meals during trek',
      'English-speaking guide',
    ],
    notIncluded: [
      'Transport to/from Kochkor',
      'Travel insurance',
      'Personal items',
      'Tips',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kochkor to Jailoo Camp',
        description: 'Meet in Kochkor village. Horse briefing and assignment. Begin riding toward mountains. Lunch en route. Camp at shepherd\'s jailoo (summer pasture).',
      },
      {
        day: 2,
        title: 'Song-Kol Lake',
        description: 'Ride over the pass (3,500m). Descend to Song-Kol Lake. Afternoon free to explore or rest. Watch sunset over the lake. Traditional dinner in yurt.',
      },
      {
        day: 3,
        title: 'Return to Kochkor',
        description: 'Morning ride around lake shore. Begin descent via different route. Arrive Kochkor by late afternoon. End of tour.',
      },
    ],
  },
];

export const getTourBySlug = (slug: string): TourData | undefined => {
  return toursData.find((tour) => tour.slug === slug);
};
