export type AccommodationType = 'hotel' | 'yurt' | 'guesthouse' | 'resort' | 'eco-lodge';

export interface AccommodationData {
  slug: string;
  image: string;
  gallery?: string[];
  title: string;
  location: string;
  region: string;
  type: AccommodationType;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  shortDescription: string;
  fullDescription: string;
  reviews?: { name: string; rating: number; text: string; date: string }[];
}

export const accommodationsData: AccommodationData[] = [
  {
    slug: 'issyk-kul-beach-resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
    ],
    title: 'Issyk-Kul Beach Resort',
    location: 'Cholpon-Ata, Issyk-Kul',
    region: 'Issyk-Kul',
    type: 'resort',
    pricePerNight: 80,
    rating: 4.8,
    reviewCount: 214,
    amenities: ['Beach Access', 'Pool', 'WiFi', 'Breakfast', 'Lake View', 'Spa'],
    shortDescription: 'Premium lakeside resort with private beach, pool, and mountain views on the northern shore of Issyk-Kul.',
    fullDescription: 'Nestled on the golden northern shore of Lake Issyk-Kul, this premium resort offers a perfect blend of comfort and nature. Wake up to panoramic views of snow-capped mountains reflected in the crystal-clear lake. The resort features a private beach, outdoor pool, full-service spa, and a restaurant serving both Kyrgyz and international cuisine. Ideal for families, couples, and groups looking for a relaxing base to explore the Issyk-Kul region.',
    reviews: [
      { name: 'Anna K.', rating: 5, text: 'Incredible views and very clean rooms. The beach is right there! Staff was super friendly.', date: '2025-08-14' },
      { name: 'Marco B.', rating: 5, text: 'Best hotel experience in Kyrgyzstan. The breakfast buffet was amazing. Will return!', date: '2025-07-22' },
      { name: 'Yuki T.', rating: 4, text: 'Beautiful location. WiFi was a bit slow but everything else was perfect.', date: '2025-06-30' },
    ],
  },
  {
    slug: 'song-kol-yurt-camp',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop',
    ],
    title: 'Song-Kol Traditional Yurt Camp',
    location: 'Song-Kol Lake, Naryn',
    region: 'Naryn',
    type: 'yurt',
    pricePerNight: 50,
    rating: 5.0,
    reviewCount: 87,
    amenities: ['Meals Included', 'Horseback Riding', 'Mountain View', 'Campfire', 'Stargazing'],
    shortDescription: 'Authentic nomadic yurt experience at 3,000m altitude on the shores of pristine Song-Kol Lake.',
    fullDescription: 'Experience life as Kyrgyz nomads have for centuries. Our traditional yurt camp sits at 3,016 meters on the shores of Song-Kol, one of the most beautiful alpine lakes in Central Asia. Each yurt is furnished with warm carpets, blankets, and traditional felt decorations. All meals are home-cooked by local families using fresh ingredients. Optional horseback riding, guided hikes, and unforgettable stargazing nights.',
    reviews: [
      { name: 'Sarah M.', rating: 5, text: 'Life-changing experience! The sunset was the most beautiful thing I have ever seen.', date: '2025-08-02' },
      { name: 'Thomas B.', rating: 5, text: 'Authentic and unforgettable. The family running the camp was so welcoming.', date: '2025-07-18' },
    ],
  },
  {
    slug: 'bishkek-boutique-hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d3c12b0c2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop',
    ],
    title: 'Bishkek City Boutique Hotel',
    location: 'City Center, Bishkek',
    region: 'Bishkek',
    type: 'hotel',
    pricePerNight: 70,
    rating: 4.7,
    reviewCount: 156,
    amenities: ['WiFi', 'Breakfast', 'City Center', 'AC', 'Airport Transfer', '24h Reception'],
    shortDescription: 'Stylish boutique hotel in the heart of Bishkek, walking distance to Ala-Too Square and Osh Bazaar.',
    fullDescription: 'Located in the vibrant center of Bishkek, this boutique hotel combines modern comfort with Central Asian design touches. Rooms feature premium bedding, fast WiFi, air conditioning, and city views. A gourmet breakfast featuring local and European dishes is included. The hotel is a 5-minute walk from Ala-Too Square, 10 minutes from Osh Bazaar, and offers complimentary airport transfers for guests booking 3+ nights.',
    reviews: [
      { name: 'David L.', rating: 5, text: 'Perfect location and beautiful design. Breakfast was outstanding.', date: '2025-09-05' },
      { name: 'Elena R.', rating: 4, text: 'Clean, modern, and friendly staff. Great base for exploring Bishkek.', date: '2025-08-20' },
    ],
  },
  {
    slug: 'karakol-eco-lodge',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
    title: 'Karakol Mountain Eco Lodge',
    location: 'Karakol, Issyk-Kul',
    region: 'Issyk-Kul',
    type: 'eco-lodge',
    pricePerNight: 65,
    rating: 4.9,
    reviewCount: 92,
    amenities: ['Mountain View', 'Breakfast', 'WiFi', 'Garden', 'Eco-Friendly', 'Hiking Trails'],
    shortDescription: 'Sustainable mountain lodge with stunning Tien-Shan views, organic breakfast, and easy access to Jeti-Oguz.',
    fullDescription: 'A cozy eco-friendly lodge nestled in the foothills above Karakol town. Built with local materials and powered by solar energy. Enjoy organic breakfast from the lodge garden, panoramic mountain views from every room, and direct access to hiking trails leading to Jeti-Oguz and Altyn-Arashan valleys.',
  },
  {
    slug: 'jeti-oguz-health-resort',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
    title: 'Jeti-Oguz Health Resort',
    location: 'Jeti-Oguz Valley, Issyk-Kul',
    region: 'Issyk-Kul',
    type: 'resort',
    pricePerNight: 55,
    rating: 4.6,
    reviewCount: 78,
    amenities: ['Hot Springs', 'Medical Spa', 'Meals Included', 'Mountain View', 'Hiking'],
    shortDescription: 'Historic sanatorium in the famous red-rock Jeti-Oguz valley with natural hot springs and therapeutic treatments.',
    fullDescription: 'The legendary Jeti-Oguz sanatorium sits among the dramatic Seven Bulls red rock formations. Known for its natural radon hot springs and therapeutic mud baths, the resort has been a wellness destination since Soviet times. Now renovated with modern amenities while preserving its unique character. All meals included, plus optional medical consultations and spa treatments.',
  },
  {
    slug: 'ala-archa-guesthouse',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop',
    title: 'Ala-Archa Mountain Guesthouse',
    location: 'Ala-Archa, Bishkek',
    region: 'Bishkek',
    type: 'guesthouse',
    pricePerNight: 40,
    rating: 4.8,
    reviewCount: 63,
    amenities: ['Breakfast', 'Mountain View', 'Parking', 'Garden', 'Fireplace'],
    shortDescription: 'Cozy family-run guesthouse at the entrance to Ala-Archa National Park, perfect base for day hikes.',
    fullDescription: 'A warm, family-run guesthouse just 5 minutes from the Ala-Archa National Park entrance. The hosts offer home-cooked Kyrgyz meals, local hiking tips, and a welcoming atmosphere. Rooms are simple but comfortable, with mountain views and a shared garden with a fire pit for evening relaxation.',
  },
  {
    slug: 'arslanbob-community-homestay',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop',
    title: 'Arslanbob Community Homestay',
    location: 'Arslanbob, Jalal-Abad',
    region: 'Jalal-Abad',
    type: 'guesthouse',
    pricePerNight: 35,
    rating: 4.9,
    reviewCount: 45,
    amenities: ['Meals Included', 'Cultural Experience', 'Garden', 'Walnut Forest Access'],
    shortDescription: 'Authentic Uzbek family homestay in the heart of the world\'s largest walnut forest.',
    fullDescription: 'Stay with a welcoming Uzbek family in the village of Arslanbob, surrounded by the world\'s largest natural walnut forest. Experience daily life in southern Kyrgyzstan — help bake traditional bread, learn local crafts, and enjoy home-cooked meals. The homestay offers clean rooms, a beautiful courtyard garden, and easy access to waterfalls and forest trails.',
  },
  {
    slug: 'son-kul-luxury-glamping',
    image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&h=600&fit=crop',
    title: 'Son-Kul Luxury Glamping',
    location: 'Son-Kul Plateau, Naryn',
    region: 'Naryn',
    type: 'yurt',
    pricePerNight: 120,
    rating: 4.9,
    reviewCount: 31,
    amenities: ['Heated Yurts', 'Gourmet Meals', 'Hot Shower', 'Stargazing', 'Horse Riding'],
    shortDescription: 'Premium glamping experience with heated yurts, gourmet meals, and hot showers at 3,000m altitude.',
    fullDescription: 'Our luxury glamping camp elevates the traditional yurt experience. Each spacious yurt features real beds with premium bedding, solar-powered lighting, and handcrafted furnishings. The camp has hot showers, a dining yurt with gourmet meals prepared by a professional chef, and optional activities including horseback riding, guided hikes, and private stargazing sessions with a telescope.',
  },
];

export const getAccommodationBySlug = (slug: string): AccommodationData | undefined => {
  return accommodationsData.find(a => a.slug === slug);
};
