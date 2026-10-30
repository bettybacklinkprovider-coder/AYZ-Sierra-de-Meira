/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  MapPin,
  Phone,
  Clock,
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  Navigation,
  Bookmark,
  Compass,
  Share2,
  Camera,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit3,
  PlusCircle,
  Globe,
  ShieldCheck,
  Users,
  Building2,
  X,
  KeyRound,
  QrCode,
  MessageCircle,
  CheckCircle2,
  Quote,
  HelpCircle,
  AlertCircle,
  Copy,
  Settings2,
} from 'lucide-react';

import imgExterior from './assets/images/madrid_hotel_exterior_street_1793350187690.jpg';
import imgRoom from './assets/images/madrid_compact_studio_room_1793350188722.jpg';
import imgBathroom from './assets/images/madrid_hotel_bathroom_modern_1793350190286.jpg';
import imgLobby from './assets/images/madrid_auto_checkin_lobby_1793350190068.jpg';

import imgAmenityWifi from './assets/images/hotel_detail_free_wifi_1793354333665.jpg';
import imgAmenityPool from './assets/images/hotel_detail_pool_terrace_1793354334746.jpg';
import imgAmenityRestaurant from './assets/images/hotel_detail_restaurant_cafe_1793354335306.jpg';
import imgAmenityFitness from './assets/images/hotel_detail_fitness_center_1793354335308.jpg';

import imgAvatarElena from './assets/images/avatar_client_elena_1793353763725.jpg';
import imgAvatarDavid from './assets/images/avatar_client_david_1793353764688.jpg';
import imgAvatarSofia from './assets/images/avatar_client_sofia_1793353765074.jpg';

type ActiveTab = 'overview' | 'prices' | 'reviews' | 'about' | 'photos';

interface PriceOffer {
  id: string;
  provider: string;
  badge?: string;
  roomType: string;
  basePkrPerNight: number;
  freeCancellation: boolean;
  freeWifi: boolean;
  perks: string;
  isOfficial?: boolean;
}

interface GuestReview {
  id: string;
  source: string;
  author: string;
  dateLabel: string;
  rating: number;
  maxRating: number;
  comment: string;
  roomStayed?: string;
}

interface PhotoItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Rooms' | 'Bathroom' | 'Auto Check-in' | 'Hotel Details';
  url: string;
  contributor: string;
}

interface HotelDetailAmenity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  iconName: 'wifi' | 'pool' | 'restaurant' | 'fitness';
}

interface HotelPackageOffer {
  id: string;
  categoryCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  packageType: string;
  title: string;
  description: string;
  imageUrl: string;
  priceLabel: string;
  originalPriceLabel?: string;
  discountBadge?: string;
  isPlaceholderRate: boolean;
  minStayNights: number;
  occupancyLimit: string;
  validityPeriod: string;
  bookingConditions: string;
  includedBenefits: string[];
  ctaLabel: string;
  status: 'available' | 'seasonal' | 'expired';
}

interface AgencyTestimonial {
  id: string;
  serviceCategory: string;
  clientName: string;
  jobTitle: string;
  companyName: string;
  avatarUrl: string;
  rating: number;
  reviewText: string;
  isDemoSample: boolean;
}

const HOTEL_DETAILS_AMENITIES: HotelDetailAmenity[] = [
  {
    id: 'detail-wifi',
    title: 'Free Wi-Fi',
    subtitle: 'Included in all rooms',
    description:
      'High-speed fiber Wi-Fi available throughout all rooms and the automated check-in lobby with zero device limits.',
    imageUrl: imgAmenityWifi,
    iconName: 'wifi',
  },
  {
    id: 'detail-pool',
    title: 'Pool',
    subtitle: 'Not on premises',
    description:
      'Seasonal aquatic lounge & municipal swimming complex access in Puente de Vallecas nearby.',
    imageUrl: imgAmenityPool,
    iconName: 'pool',
  },
  {
    id: 'detail-restaurant',
    title: 'Restaurant',
    subtitle: 'Local cafes 100m away',
    description:
      'Authentic Madrid espresso bars, bakeries, and tapas dining located within 100 meters on Calle de la Sierra de Meira.',
    imageUrl: imgAmenityRestaurant,
    iconName: 'restaurant',
  },
  {
    id: 'detail-fitness',
    title: 'Fitness center',
    subtitle: 'Partner gym nearby',
    description:
      'Day-pass access available at partner fitness & strength training facilities within a 5-minute walk.',
    imageUrl: imgAmenityFitness,
    iconName: 'fitness',
  },
];

const INITIAL_OFFERS: PriceOffer[] = [
  {
    id: 'offer-official',
    provider: 'AyZ Sierra de Meira',
    badge: 'Official site',
    roomType: 'Compact Single / Double Auto Check-in Room',
    basePkrPerNight: 10346,
    freeCancellation: true,
    freeWifi: true,
    perks: 'Free Wi-Fi · Instant digital keycode check-in',
    isOfficial: true,
  },
  {
    id: 'offer-booking',
    provider: 'Booking.com',
    roomType: 'Standard Double Room (Compact)',
    basePkrPerNight: 12537,
    freeCancellation: true,
    freeWifi: true,
    perks: 'Free Wi-Fi · Free cancellation before Nov 1',
  },
  {
    id: 'offer-trip',
    provider: 'Trip.com',
    roomType: 'Economy Double Room',
    basePkrPerNight: 11988,
    freeCancellation: false,
    freeWifi: true,
    perks: 'Free Wi-Fi · Express kiosk check-in',
  },
  {
    id: 'offer-expedia',
    provider: 'Expedia',
    roomType: 'Standard Studio Room',
    basePkrPerNight: 12210,
    freeCancellation: true,
    freeWifi: true,
    perks: 'Free Wi-Fi · Free cancellation',
  },
  {
    id: 'offer-agoda',
    provider: 'Agoda',
    roomType: 'Compact Queen Room',
    basePkrPerNight: 12090,
    freeCancellation: false,
    freeWifi: true,
    perks: 'Free Wi-Fi · Non-refundable saver rate',
  },
];

const INITIAL_REVIEWS: GuestReview[] = [
  {
    id: 'rev-trip-featured',
    source: 'Trip.com',
    author: 'Trip.com Member',
    dateLabel: '4 months ago',
    rating: 3.1,
    maxRating: 5,
    comment:
      'The small size but clean ..orinary better for one person no for two persons',
    roomStayed: 'Compact Double Room',
  },
  {
    id: 'rev-google-1',
    source: 'Google',
    author: 'Javier M.',
    dateLabel: '2 months ago',
    rating: 3.0,
    maxRating: 5,
    comment:
      'Auto check-in with the digital code worked smoothly at 9 PM. Room is very compact as advertised, clean bathroom and good air conditioning near Nueva Numancia metro.',
    roomStayed: 'Single Auto Check-in Room',
  },
  {
    id: 'rev-google-2',
    source: 'Google',
    author: 'Lucía Fernández',
    dateLabel: '3 months ago',
    rating: 2.0,
    maxRating: 5,
    comment:
      'Clean sheets and modern shower, but the space around the bed is tight if you bring two large suitcases. Good for a short 1-night stopover in Madrid.',
    roomStayed: 'Standard Double Room',
  },
  {
    id: 'rev-google-3',
    source: 'Google',
    author: 'Marco Rossi',
    dateLabel: '5 months ago',
    rating: 1.0,
    maxRating: 5,
    comment:
      'No staff on site since it is a 100% automated property. Make sure you complete the online registration link before arriving at the door.',
    roomStayed: 'Compact Room',
  },
];

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    title: 'C. de la Sierra de Meira Building Facade',
    category: 'Exterior',
    url: imgExterior,
    contributor: 'Property Management',
  },
  {
    id: 'photo-2',
    title: 'Compact Double Room with Natural Daylight',
    category: 'Rooms',
    url: imgRoom,
    contributor: 'Property Management',
  },
  {
    id: 'photo-3',
    title: 'En-Suite Walk-in Glass Shower & Bathroom',
    category: 'Bathroom',
    url: imgBathroom,
    contributor: 'Verified Guest',
  },
  {
    id: 'photo-4',
    title: 'Automated Self Check-In Kiosk & Keypad Entrance',
    category: 'Auto Check-in',
    url: imgLobby,
    contributor: 'Property Management',
  },
  {
    id: 'photo-5',
    title: 'Free Wi-Fi & In-Room Work Desk',
    category: 'Hotel Details',
    url: imgAmenityWifi,
    contributor: 'Property Management',
  },
  {
    id: 'photo-6',
    title: 'Pool & Sunlit Courtyard Terrace',
    category: 'Hotel Details',
    url: imgAmenityPool,
    contributor: 'Partner Facility',
  },
  {
    id: 'photo-7',
    title: 'Local Madrid Cafe & Restaurant Dining (100m away)',
    category: 'Hotel Details',
    url: imgAmenityRestaurant,
    contributor: 'Neighborhood Guide',
  },
  {
    id: 'photo-8',
    title: 'Partner Fitness Center & Gym Nearby',
    category: 'Hotel Details',
    url: imgAmenityFitness,
    contributor: 'Partner Facility',
  },
];

const INITIAL_PACKAGES: HotelPackageOffer[] = [
  {
    id: 'pkg-weekend',
    categoryCode: 'A',
    packageType: 'Weekend Getaway',
    title: 'Madrid Weekend Auto-Check-In Stay',
    description:
      'A streamlined Friday-to-Sunday Madrid base in Puente de Vallecas with 24/7 digital keycode entry and direct Line 1 Metro access to Puerta del Sol.',
    imageUrl: imgRoom,
    priceLabel: 'PKR 10,346 / night (Official Site Base)',
    isPlaceholderRate: false,
    minStayNights: 2,
    occupancyLimit: '1–2 Guests (Ideal for solo or light-luggage duo)',
    validityPeriod: 'Valid Fridays – Sundays · Year-round subject to availability',
    bookingConditions: 'Check-in from 3:00 PM · Check-out by 12:00 PM · Online ID pre-check required',
    includedBenefits: [
      'Free high-speed Wi-Fi across room & lobby',
      'Instant 24/7 digital PIN & kiosk check-in',
      'Private en-suite glass walk-in shower',
      'Free cancellation on official direct rate',
    ],
    ctaLabel: 'Explore Offer',
    status: 'available',
  },
  {
    id: 'pkg-extended',
    categoryCode: 'B',
    packageType: 'Extended Stay Package',
    title: 'Multi-Night Madrid Explorer Plan (3+ Nights)',
    description:
      'Designed for guests staying 3 or more consecutive nights who want a clean, private lock-and-leave room near Atocha and Nueva Numancia station.',
    imageUrl: imgExterior,
    priceLabel: 'PKR 10,346 / night · [Custom Multi-Night Rate Placeholder]',
    isPlaceholderRate: true,
    minStayNights: 3,
    occupancyLimit: 'Up to 2 Guests per compact room',
    validityPeriod: 'Valid on consecutive stays of 3+ nights',
    bookingConditions: 'Minimum 3-night stay · Scheduled towel & linen refresh included',
    includedBenefits: [
      'Free Wi-Fi for remote work & streaming',
      'Uninterrupted digital keycode access throughout stay',
      'Climate-controlled heating & air conditioning',
      'Flexible self-service check-in at any hour after 3:00 PM',
    ],
    ctaLabel: 'View Package',
    status: 'available',
  },
  {
    id: 'pkg-romantic',
    categoryCode: 'C',
    packageType: 'Romantic Stay Package',
    title: 'Couples Compact Madrid Escape',
    description:
      'Cozy double room stay for couples exploring Madrid’s historic center and nearby Cerro del Tío Pío sunset park.',
    imageUrl: imgAmenityRestaurant,
    priceLabel: 'PKR 10,346 / night · [Optional Add-On Rate Placeholder]',
    isPlaceholderRate: true,
    minStayNights: 1,
    occupancyLimit: '2 Adults (Compact double bed layout)',
    validityPeriod: 'Subject to double room availability',
    bookingConditions: 'Standard 3:00 PM check-in / 12:00 PM check-out · Contact host via WhatsApp for special requests',
    includedBenefits: [
      'Private double room with crisp white linens',
      'En-suite modern rain shower bathroom',
      'Free Wi-Fi & curated neighborhood dining guide',
      'Contactless private arrival via keypad',
    ],
    ctaLabel: 'Discover Package',
    status: 'available',
  },
  {
    id: 'pkg-family',
    categoryCode: 'D',
    packageType: 'Family Stay Package',
    title: 'Adjacent Rooms Booking for Small Groups',
    description:
      'Because individual rooms are compact and tailored for 1–2 guests, families or companions can request two adjacent auto check-in rooms on the same floor.',
    imageUrl: imgBathroom,
    priceLabel: 'From PKR 20,692 / night (2 Compact Rooms)',
    isPlaceholderRate: true,
    minStayNights: 1,
    occupancyLimit: 'Max 2 guests per individual room (Up to 4 across 2 rooms)',
    validityPeriod: 'Available when 2+ rooms are open on the same floor',
    bookingConditions: 'Requires booking 2 separate compact rooms · Direct WhatsApp confirmation recommended',
    includedBenefits: [
      'Coordinated digital access codes for both rooms',
      'Free Wi-Fi for all connected devices',
      'Each room includes a private en-suite bathroom',
      '4-minute walk to Line 1 Metro for family city tours',
    ],
    ctaLabel: 'Explore Family Offer',
    status: 'available',
  },
  {
    id: 'pkg-business',
    categoryCode: 'E',
    packageType: 'Business Stay Package',
    title: 'Solo Business & Transit Stopover',
    description:
      'Highly rated by solo travellers needing fast automated check-in, a clean quiet room, reliable Free Wi-Fi, and quick transit to Atocha AVE rail station.',
    imageUrl: imgAmenityWifi,
    priceLabel: 'PKR 10,346 / night (Official Direct Rate)',
    isPlaceholderRate: false,
    minStayNights: 1,
    occupancyLimit: '1 Business Traveller (Recommended for optimal space)',
    validityPeriod: 'Valid Monday – Sunday',
    bookingConditions: 'Instant automated VAT/booking receipt available upon request',
    includedBenefits: [
      'High-speed Free Wi-Fi & in-room compact work desk',
      'Zero front-desk queues with 24/7 digital check-in',
      '11 minutes by Metro Line 1 to Madrid Atocha Station',
      'Direct official site pricing',
    ],
    ctaLabel: 'Book Business Stay',
    status: 'available',
  },
  {
    id: 'pkg-seasonal',
    categoryCode: 'F',
    packageType: 'Seasonal Special Offers',
    title: 'Autumn & Winter Madrid Direct Booking Window',
    description:
      'Compare direct official site rates (PKR 10,346) against OTA rates (Booking.com PKR 12,537 / Trip.com PKR 11,988) for November–December stays.',
    imageUrl: imgLobby,
    priceLabel: 'PKR 10,346 / night',
    originalPriceLabel: 'PKR 12,537 (OTA Comparison Rate)',
    discountBadge: 'Save ~17% Direct vs OTA',
    isPlaceholderRate: false,
    minStayNights: 1,
    occupancyLimit: '1–2 Guests',
    validityPeriod: 'Valid for stays Nov 2 – Dec 20, 2026',
    bookingConditions: 'Direct official site rate · Free cancellation option available',
    includedBenefits: [
      'Lowest verified nightly rate on Official Site (PKR 10,346)',
      'Free Wi-Fi included',
      'Automated check-in from 3:00 PM',
      'Direct WhatsApp guest support (+58 412-4088214)',
    ],
    ctaLabel: 'Explore Offer',
    status: 'seasonal',
  },
];

const AGENCY_TESTIMONIALS: AgencyTestimonial[] = [
  {
    id: 'test-web-design',
    serviceCategory: 'Professional Website Design & Development',
    clientName: 'Elena Vance',
    jobTitle: 'Director of Hospitality Operations',
    companyName: 'Vance Urban Stays (Demo Sample)',
    avatarUrl: imgAvatarElena,
    rating: 5,
    reviewText:
      'The new booking interface and responsive room showcase transformed how guests interact with our property online. Page navigation is intuitive, mobile check-in instructions are crystal clear, and direct inquiries increased noticeably.',
    isDemoSample: true,
  },
  {
    id: 'test-wordpress',
    serviceCategory: 'WordPress Website Redesign & Speed Optimization',
    clientName: 'David Lindqvist',
    jobTitle: 'Founder & Managing Partner',
    companyName: 'Nordic Travel Group (Demo Sample)',
    avatarUrl: imgAvatarDavid,
    rating: 5,
    reviewText:
      'Our legacy site suffered from slow image loading and high mobile bounce rates. After the complete redesign and Core Web Vitals speed optimization, pages load in under a second and our mobile conversion rate improved immediately.',
    isDemoSample: true,
  },
  {
    id: 'test-react-custom',
    serviceCategory: 'React Development & Custom-Coded Websites',
    clientName: 'Sofia Mendoza',
    jobTitle: 'Chief Digital Officer',
    companyName: 'Meridian Retail Collective (Demo Sample)',
    avatarUrl: imgAvatarSofia,
    rating: 5,
    reviewText:
      'Building our custom React price comparison and live availability portal was seamless. The engineering quality, clean component architecture, and attention to responsive detail exceeded our expectations.',
    isDemoSample: true,
  },
  {
    id: 'test-logo-brand',
    serviceCategory: 'Logo Design & Brand Identity',
    clientName: 'Mateo Alarcón',
    jobTitle: 'Creative Director',
    companyName: 'Atelier Madrid Studio (Demo Sample)',
    avatarUrl: imgAvatarDavid,
    rating: 5,
    reviewText:
      'They crafted a timeless visual identity, typography system, and brand guidelines book that immediately elevated our market positioning across both print signage and digital touchpoints.',
    isDemoSample: true,
  },
  {
    id: 'test-ecommerce',
    serviceCategory: 'E-Commerce & WooCommerce Store Development',
    clientName: 'Clara Morales',
    jobTitle: 'Head of Direct-to-Consumer',
    companyName: 'Botanica Iberica (Demo Sample)',
    avatarUrl: imgAvatarElena,
    rating: 5,
    reviewText:
      'Our WooCommerce storefront checkout flow and multi-currency catalog were rebuilt from the ground up. Cart abandonment dropped significantly and managing seasonal promotions is now effortless.',
    isDemoSample: true,
  },
  {
    id: 'test-seo-marketing',
    serviceCategory: 'SEO & Digital Marketing Services',
    clientName: 'Henrik Solberg',
    jobTitle: 'VP of Growth',
    companyName: 'Apex Mobility Solutions (Demo Sample)',
    avatarUrl: imgAvatarDavid,
    rating: 5,
    reviewText:
      'Structured technical SEO, local search optimization, and data-driven campaign management brought consistent organic traffic growth and high-intent customer inquiries within the first quarter.',
    isDemoSample: true,
  },
  {
    id: 'test-social-video',
    serviceCategory: 'Social Media Content Creation & Video Editing',
    clientName: 'Nadia Karim',
    jobTitle: 'Brand Communications Lead',
    companyName: 'Lumina Lifestyle Brands (Demo Sample)',
    avatarUrl: imgAvatarSofia,
    rating: 5,
    reviewText:
      'Their short-form video editing and cohesive social media visual storytelling gave our brand a polished, recognizable voice that resonates strongly with our audience.',
    isDemoSample: true,
  },
];

const PACKAGE_FAQS = [
  {
    question: 'How does the auto check-in process work for package bookings?',
    answer:
      'AYZ Sierra de Meira is a 100% automated self-check-in property. Once your reservation is confirmed and online guest ID registration is completed, you receive a digital entrance & room keycode valid from 3:00 PM on your check-in date.',
  },
  {
    question: 'Are the package prices and discounts verified?',
    answer:
      'The base nightly rate of PKR 10,346 reflects the official property rate (compared with PKR 11,988 on Trip.com and PKR 12,537 on Booking.com). Custom multi-night or add-on packages are clearly marked with editable rate placeholders so management can update seasonal tariffs directly.',
  },
  {
    question: 'What is the cancellation policy on Special Offers?',
    answer:
      'Official direct rates and eligible Booking.com rates include free cancellation prior to the check-in window. Non-refundable saver rates on partner portals are clearly labelled before booking.',
  },
  {
    question: 'Which amenities are included on-site vs. nearby?',
    answer:
      'All rooms include Free high-speed Wi-Fi, a private en-suite bathroom, climate control, and digital kiosk/keypad check-in. Please note that the rooms are compact (best suited for 1 guest or light-luggage couples), and dining cafés or fitness facilities are located in the surrounding Puente de Vallecas neighborhood.',
  },
];

const STAR_DISTRIBUTION = [
  { stars: 5, count: 4, percent: 12 },
  { stars: 4, count: 5, percent: 15 },
  { stars: 3, count: 6, percent: 18 },
  { stars: 2, count: 5, percent: 15 },
  { stars: 1, count: 14, percent: 40 },
];

const NEARBY_PLACES = [
  {
    name: 'Nueva Numancia Metro Station (Line 1)',
    distance: '350 m · 4 min walk',
    detail: 'Direct line to Atocha Railway Station & Puerta del Sol',
  },
  {
    name: 'Puente de Vallecas Transit Hub (M-30)',
    distance: '600 m · 7 min walk',
    detail: 'Bus connections and local commercial avenue',
  },
  {
    name: 'Parque del Cerro del Tío Pío',
    distance: '1.2 km · 15 min walk',
    detail: 'Panoramic sunset viewpoint overlooking Madrid skyline',
  },
  {
    name: 'Madrid Atocha High-Speed Terminal',
    distance: '3.4 km · 11 min metro',
    detail: 'AVE high-speed trains and Cercanías commuter rail',
  },
];

function ResilientImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 text-slate-600 p-6 text-center ${
          className || ''
        }`}
      >
        <Building2 className="w-8 h-8 mb-2 text-slate-500 stroke-[1.5]" />
        <span className="text-xs font-medium text-slate-700">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function AmenityIcon({
  name,
  className,
}: {
  name: HotelDetailAmenity['iconName'];
  className?: string;
}) {
  if (name === 'wifi') return <Wifi className={className} />;
  if (name === 'pool') return <Waves className={className} />;
  if (name === 'restaurant') return <Utensils className={className} />;
  return <Dumbbell className={className} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Booking & Price Comparison state
  const [checkInDate, setCheckInDate] = useState<string>('2026-11-02');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-11-03');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [freeCancellationOnly, setFreeCancellationOnly] =
    useState<boolean>(false);
  const [showMorePrices, setShowMorePrices] = useState<boolean>(false);
  const [selectedOfferForRoomModal, setSelectedOfferForRoomModal] =
    useState<PriceOffer | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(
    null
  );

  // Selected Hotel Detail Amenity Lightbox Modal
  const [selectedAmenityModal, setSelectedAmenityModal] =
    useState<HotelDetailAmenity | null>(null);

  // Action buttons state
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    | null
    | 'directions'
    | 'nearby'
    | 'write-review'
    | 'suggest-edit'
    | 'add-website'
    | 'claim-business'
    | 'add-photo'
    | 'about-data'
    | 'configure-qr-links'
  >(null);

  // QR Code "Review Us!" State with real working Google Maps Place/Review URL + editable links
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string>(
    'https://www.google.com/maps/search/?api=1&query=AYZ+Sierra+de+Meira+Calle+de+la+Sierra+de+Meira+53+28038+Madrid+Spain'
  );
  const [tripComReviewUrl, setTripComReviewUrl] = useState<string>(
    'https://www.trip.com/hotels/madrid-hotel-detail-ayz-sierra-de-meira/'
  );
  const [trustpilotReviewUrl, setTrustpilotReviewUrl] = useState<string>(
    'https://www.trustpilot.com/review/ayzhotels.com'
  );
  const [selectedQrPlatform, setSelectedQrPlatform] = useState<
    'google' | 'trip' | 'trustpilot'
  >('google');

  // Special Offers & Packages State
  const [packages, setPackages] =
    useState<HotelPackageOffer[]>(INITIAL_PACKAGES);
  const [selectedPackageModal, setSelectedPackageModal] =
    useState<HotelPackageOffer | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageGuestName, setPackageGuestName] = useState<string>('');
  const [packageGuestPhone, setPackageGuestPhone] = useState<string>('');
  const [packageSpecialNotes, setPackageSpecialNotes] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Professional Client Testimonials Carousel State
  const [testimonialPage, setTestimonialPage] = useState<number>(0);
  const [showAllTestimonials, setShowAllTestimonials] =
    useState<boolean>(false);

  // Dynamic data state
  const [reviews, setReviews] = useState<GuestReview[]>(INITIAL_REVIEWS);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(4);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>('All');
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCategory, setNewPhotoCategory] =
    useState<PhotoItem['category']>('Rooms');

  // Business info editable state
  const [propertyAddress, setPropertyAddress] = useState<string>(
    'C. de la Sierra de Meira, 53, Puente de Vallecas, 28038 Madrid, Spain'
  );
  const [propertyPhone, setPropertyPhone] = useState<string>('+58 412-4088214');
  const [propertyWebsite, setPropertyWebsite] = useState<string>(
    'https://ayzhotels.com/sierra-de-meira'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const nightsCount = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  const formatShortDate = (isoDate: string) => {
    const d = new Date(isoDate + 'T12:00:00');
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const visibleOffers = useMemo(() => {
    const filtered = INITIAL_OFFERS.filter((offer) =>
      freeCancellationOnly ? offer.freeCancellation : true
    );
    return showMorePrices ? filtered : filtered.slice(0, 2);
  }, [freeCancellationOnly, showMorePrices]);

  const filteredPhotos = useMemo(() => {
    if (photoCategoryFilter === 'All') return photos;
    return photos.filter((p) => p.category === photoCategoryFilter);
  }, [photos, photoCategoryFilter]);

  const activeQrUrl = useMemo(() => {
    if (selectedQrPlatform === 'google') return googleReviewUrl;
    if (selectedQrPlatform === 'trip') return tripComReviewUrl;
    return trustpilotReviewUrl;
  }, [
    selectedQrPlatform,
    googleReviewUrl,
    tripComReviewUrl,
    trustpilotReviewUrl,
  ]);

  const totalTestimonialPages = Math.ceil(AGENCY_TESTIMONIALS.length / 3);
  const displayedTestimonials = useMemo(() => {
    if (showAllTestimonials) return AGENCY_TESTIMONIALS;
    const start = testimonialPage * 3;
    return AGENCY_TESTIMONIALS.slice(start, start + 3);
  }, [testimonialPage, showAllTestimonials]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .catch(() => undefined);
    }
    showToast('Listing link for AYZ Sierra de Meira copied to clipboard.');
  };

  const handleCopyText = (label: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    showToast(`${label} copied: ${text}`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    const created: GuestReview = {
      id: `rev-${Date.now()}`,
      source: 'Google',
      author: newReviewAuthor.trim() || 'Verified Guest',
      dateLabel: 'Just now',
      rating: newReviewRating,
      maxRating: 5,
      comment: newReviewComment.trim(),
      roomStayed: `${guestsCount === 1 ? 'Single' : 'Double'} Auto Check-in Room`,
    };
    setReviews((prev) => [created, ...prev]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setActiveModal(null);
    showToast('Your review has been published to the listing.');
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const created: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle.trim() || 'Guest Uploaded Property View',
      category: newPhotoCategory,
      url: newPhotoUrl.trim(),
      contributor: 'Guest Contribution',
    };
    setPhotos((prev) => [created, ...prev]);
    setNewPhotoTitle('');
    setNewPhotoUrl('');
    setActiveModal(null);
    setActiveTab('photos');
    showToast('Photo added to the property gallery.');
  };

  const handlePackageBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageModal) return;
    setBookingConfirmation(
      `Package Inquiry Confirmed: "${selectedPackageModal.title}" (${selectedPackageModal.packageType}) for ${formatShortDate(
        checkInDate
      )} – ${formatShortDate(checkOutDate)} (${nightsCount} nights, ${guestsCount} ${
        guestsCount === 1 ? 'guest' : 'guests'
      }). Our automated check-in desk will follow up with ${
        packageGuestName || 'you'
      }.`
    );
    setSelectedPackageModal(null);
    setPackageGuestName('');
    setPackageGuestPhone('');
    setPackageSpecialNotes('');
    showToast(`Booked package inquiry: ${selectedPackageModal.title}`);
  };

  const buildWhatsAppUrl = (subject: string) => {
    const cleanDigits = propertyPhone.replace(/[^\d]/g, '') || '584124088214';
    const text = encodeURIComponent(
      `Hello AYZ Sierra de Meira! I would like to inquire about "${subject}" for Check-in: ${formatShortDate(
        checkInDate
      )}, Check-out: ${formatShortDate(checkOutDate)} (${nightsCount} nights, ${guestsCount} guests).`
    );
    return `https://wa.me/${cleanDigits}?text=${text}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 lg:px-10 py-3.5 bg-white border-b border-slate-200">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          AYZ Sierra de Meira
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'prices', label: 'Prices' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'about', label: 'About' },
              { id: 'photos', label: 'Photos' },
            ] as const
          ).map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === tab.id
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : ''
              }`}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('prices');
              const el = document.getElementById('availability-module');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Check availability
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'prices', label: 'Prices' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'about', label: 'About' },
            { id: 'photos', label: 'Photos' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center justify-between gap-4 text-xs">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Property Title, Rating & Quick Actions Header */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                AYZ Sierra de Meira - Auto check-in property
              </h1>

              {/* Zero-Pill Metadata Discipline: Clean unboxed text with · separators */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  2.0
                </span>
                <span
                  className="flex items-center text-amber-500"
                  aria-label="2.0 out of 5 stars"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 text-slate-300" />
                  <Star className="w-4 h-4 text-slate-300" />
                  <Star className="w-4 h-4 text-slate-300" />
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-slate-600 hover:text-blue-600 hover:underline font-mono tabular-nums cursor-pointer"
                >
                  ({34 + (reviews.length - INITIAL_REVIEWS.length)})
                </button>
                <span aria-hidden="true">·</span>
                <span>1-star hotel</span>
                <span aria-hidden="true">·</span>
                <span>Puente de Vallecas, Madrid</span>
              </div>
            </div>

            {/* Interactive Utility Action Bar: Directions, Save, Nearby, Share, Check availability */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('directions')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Directions</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !isSaved;
                  setIsSaved(next);
                  showToast(
                    next
                      ? 'Saved AYZ Sierra de Meira to your Madrid list.'
                      : 'Removed AYZ Sierra de Meira from Saved places.'
                  );
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSaved
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isSaved ? 'fill-blue-600 text-blue-600' : 'text-blue-600'
                  }`}
                />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('nearby')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Nearby</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('prices');
                  const el = document.getElementById('availability-module');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Check availability</span>
              </button>
            </div>
          </div>

          {/* Photo Mosaic Strip (107 Photos) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div
              onClick={() => setActiveTab('photos')}
              className="md:col-span-6 rounded-xl overflow-hidden bg-slate-100 h-64 sm:h-72 relative group cursor-pointer"
            >
              <ResilientImage
                src={photos[0].url}
                alt={photos[0].title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-medium text-white">
                  {photos[0].title}
                </span>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-rows-2 gap-3 h-64 sm:h-72">
              <div
                onClick={() => setActiveTab('photos')}
                className="rounded-xl overflow-hidden bg-slate-100 relative group cursor-pointer"
              >
                <ResilientImage
                  src={photos[1].url}
                  alt={photos[1].title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
              <div
                onClick={() => setActiveTab('photos')}
                className="rounded-xl overflow-hidden bg-slate-100 relative group cursor-pointer"
              >
                <ResilientImage
                  src={photos[2].url}
                  alt={photos[2].title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('photos')}
              className="md:col-span-3 rounded-xl overflow-hidden bg-slate-100 h-64 sm:h-72 relative group cursor-pointer"
            >
              <ResilientImage
                src={photos[3].url}
                alt={photos[3].title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors flex flex-col items-center justify-center p-4 text-white text-center">
                <Camera className="w-6 h-6 mb-1.5" />
                <span className="text-sm font-semibold font-mono tabular-nums">
                  {99 + photos.length} Photos
                </span>
                <span className="text-xs text-slate-200 mt-0.5">
                  View gallery & videos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW OR SPECIFIC TAB VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT / MAIN COLUMN (7 cols on desktop): Prices, Reviews, About, Photos */}
          <div className="lg:col-span-7 space-y-8">
            {/* COMPARE PRICES MODULE (Visible on Overview & Prices tabs) */}
            {(activeTab === 'overview' || activeTab === 'prices') && (
              <section
                id="availability-module"
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Compare prices
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Nightly rates in PKR for {formatShortDate(checkInDate)} –{' '}
                      {formatShortDate(checkOutDate)} ({nightsCount}{' '}
                      {nightsCount === 1 ? 'night' : 'nights'})
                    </p>
                  </div>

                  {/* Interactive Free cancellation only toggle */}
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={freeCancellationOnly}
                      onChange={(e) =>
                        setFreeCancellationOnly(e.target.checked)
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Free cancellation only</span>
                  </label>
                </div>

                {/* Check in / Check out & Guests Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Check in — {formatShortDate(checkInDate)}
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Check out — {formatShortDate(checkOutDate)}
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Guests
                    </label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option value={1}>1 guest (Recommended)</option>
                        <option value={2}>2 guests</option>
                        <option value={3}>3 guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* BookingConfirmation alert if booked */}
                {bookingConfirmation && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-4 text-xs text-emerald-900">
                    <span>{bookingConfirmation}</span>
                    <button
                      type="button"
                      onClick={() => setBookingConfirmation(null)}
                      className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* All options list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      All options
                    </span>
                    <span>Prices per night before local tax</span>
                  </div>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {visibleOffers.map((offer) => {
                      const totalPkr = offer.basePkrPerNight * nightsCount;
                      return (
                        <div
                          key={offer.id}
                          className="p-4 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">
                                {offer.provider}
                              </span>
                              {offer.badge && (
                                <span className="text-xs text-blue-700 font-medium">
                                  · {offer.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">
                              {offer.roomType}
                            </p>
                            <p className="text-xs text-slate-500">
                              {offer.perks}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            <div className="text-left sm:text-right">
                              <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                                PKR {offer.basePkrPerNight.toLocaleString()}
                              </div>
                              {nightsCount > 1 && (
                                <div className="text-xs text-slate-500 font-mono tabular-nums">
                                  Total: PKR {totalPkr.toLocaleString()} (
                                  {nightsCount} nights)
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOfferForRoomModal(offer)
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <span>See rooms</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* More prices from PKR 11,988 button */}
                  <button
                    type="button"
                    onClick={() => setShowMorePrices((prev) => !prev)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {showMorePrices
                        ? 'Show fewer price options'
                        : 'More prices from PKR 11,988'}
                    </span>
                    {showMorePrices ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* GOOGLE REVIEW SUMMARY & ALL REVIEWS (Visible on Overview & Reviews tabs) */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Google review summary
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified ratings and partner reviews from Google & Trip.com
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal('write-review')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Write a review</span>
                  </button>
                </div>

                {/* 5-1 Star Breakdown + 2.0 Score */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    {STAR_DISTRIBUTION.map((row) => (
                      <div
                        key={row.stars}
                        className="flex items-center gap-3 text-xs"
                      >
                        <span className="w-3 font-mono tabular-nums font-medium text-slate-700">
                          {row.stars}
                        </span>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono tabular-nums text-slate-500">
                          {row.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-4xl font-bold text-slate-900 font-mono tabular-nums">
                      2.0
                    </div>
                    <div className="flex items-center gap-0.5 my-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 text-slate-300" />
                      <Star className="w-4 h-4 text-slate-300" />
                      <Star className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {34 + (reviews.length - INITIAL_REVIEWS.length)} reviews
                    </div>
                  </div>
                </div>

                {/* All reviews list including Trip.com 3.1/5 card */}
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      All reviews
                    </h3>
                    <span className="text-xs text-slate-500">
                      Showing {showAllReviews ? reviews.length : 2} of{' '}
                      {31 + reviews.length} reviews
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(showAllReviews ? reviews : reviews.slice(0, 2)).map(
                      (rev) => (
                        <article
                          key={rev.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-slate-900">
                                {rev.source}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums font-semibold text-slate-800">
                                {rev.rating}/{rev.maxRating}
                              </span>
                              {rev.source === 'Trip.com' && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums text-slate-500">
                                    41 reviews
                                  </span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {rev.author}, {rev.dateLabel}
                            </span>
                          </div>

                          <p className="text-sm text-slate-700 leading-relaxed">
                            “{rev.comment}”
                          </p>

                          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                            <span>{rev.roomStayed || 'Verified Stay'}</span>
                            {rev.source === 'Trip.com' && (
                              <button
                                type="button"
                                onClick={() => setShowAllReviews(true)}
                                className="text-blue-600 font-medium hover:underline cursor-pointer"
                              >
                                View more on Trip.com
                              </button>
                            )}
                          </div>
                        </article>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAllReviews((prev) => !prev)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {showAllReviews
                      ? 'Show fewer reviews'
                      : 'More reviews (31)'}
                  </button>
                </div>
              </section>
            )}

            {/* ABOUT TAB VIEW (Full Hotel Details & Visual Amenity Showcase) */}
            {activeTab === 'about' && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    About AYZ Sierra de Meira & Hotel Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1-star automated check-in hotel in Puente de Vallecas, Madrid
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Located at C. de la Sierra de Meira, 53 in Madrid’s Puente de Vallecas district, AYZ Sierra de Meira offers compact, air-conditioned single and double rooms featuring 100% automated self-check-in from 3:00 PM, private en-suite bathrooms, and complimentary high-speed Wi-Fi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HOTEL_DETAILS_AMENITIES.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => setSelectedAmenityModal(amenity)}
                      className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:border-blue-300 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden">
                        <ResilientImage
                          src={amenity.imageUrl}
                          alt={amenity.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <AmenityIcon
                            name={amenity.iconName}
                            className="w-4 h-4 text-blue-600 shrink-0"
                          />
                          <span className="text-sm font-bold text-slate-900">
                            {amenity.title}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">
                            ·
                          </span>
                          <span className="text-xs text-slate-500">
                            {amenity.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {amenity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PHOTOS GALLERY SECTION (Visible when Photos tab is active or via button) */}
            {activeTab === 'photos' && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Photos ({99 + photos.length} Photos)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Exterior, compact single/double rooms, bathroom, automated check-in lobby, and hotel details
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal('add-photo')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Add photos & videos</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(
                    [
                      'All',
                      'Exterior',
                      'Rooms',
                      'Bathroom',
                      'Auto Check-in',
                      'Hotel Details',
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPhotoCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        photoCategoryFilter === cat
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col"
                    >
                      <div className="aspect-4/3 w-full bg-slate-100">
                        <ResilientImage
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {item.category} · {item.contributor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT / SIDEBAR COLUMN (5 cols on desktop): Address, Check-in times, Hotel details WITH IMAGES, QR Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Property Address, Contact & Check-in/Check-out Card */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Property location & contact
                </h2>
                <span className="text-xs text-slate-500">Madrid, Spain</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900 leading-relaxed">
                        {propertyAddress}
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        Puente de Vallecas district · Near Nueva Numancia Metro
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('Address', propertyAddress)}
                    className="text-blue-600 hover:underline font-medium shrink-0 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-mono tabular-nums font-medium text-slate-900">
                      {propertyPhone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText('Phone number', propertyPhone)
                    }
                    className="text-blue-600 hover:underline font-medium shrink-0 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                {/* Plus Code */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-mono tabular-nums text-slate-800">
                      98XP+MP Madrid, Spain
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText('Plus Code', '98XP+MP Madrid, Spain')
                    }
                    className="text-blue-600 hover:underline font-medium shrink-0 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                {/* Check-in / Check-out time */}
                <div className="pt-3 border-t border-slate-100 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 font-mono tabular-nums text-slate-800">
                    <div>Check-in time: 3:00 PM</div>
                    <div>Check-out time: 12:00 PM</div>
                  </div>
                </div>

                {/* Auto check-in info */}
                <div className="pt-3 border-t border-slate-100 flex items-start gap-3">
                  <KeyRound className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-900">
                      Auto check-in property:
                    </span>{' '}
                    Digital entrance pin & room code issued after online ID verification.
                  </div>
                </div>
              </div>

              {/* Business Management & Edit Actions */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('claim-business')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Claim this business</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('suggest-edit')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Suggest an edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('suggest-edit')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Add missing info</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('add-website')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Add website</span>
                </button>
              </div>
            </section>

            {/* Hotel Details & Amenities Card — NOW WITH RICH IMAGES ON EVERY CARD */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Hotel details
                </h2>
                <span className="text-xs text-slate-500">1-star hotel</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {HOTEL_DETAILS_AMENITIES.map((amenity) => (
                  <div
                    key={amenity.id}
                    onClick={() => setSelectedAmenityModal(amenity)}
                    className="group rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-xs overflow-hidden transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-28 w-full bg-slate-100 overflow-hidden relative">
                      <ResilientImage
                        src={amenity.imageUrl}
                        alt={amenity.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200"
                      />
                    </div>
                    <div className="p-3 flex items-center gap-2.5">
                      <AmenityIcon
                        name={amenity.iconName}
                        className={`w-4 h-4 shrink-0 ${
                          amenity.iconName === 'wifi'
                            ? 'text-blue-600'
                            : 'text-slate-600'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {amenity.title}
                        </div>
                        <div className="text-slate-500 truncate">
                          {amenity.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  {99 + photos.length} Photos & videos available
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('add-photo')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Add photos & videos
                </button>
              </div>
            </section>

            {/* STYLISH "REVIEW US!" QR CODE CARD */}
            <section
              id="review-qr-card"
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                    <QrCode className="w-4 h-4" />
                    <span>Scan & Share Your Feedback</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Review Us!
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Scan with your phone camera to open the live review page for{' '}
                    <span className="font-medium text-slate-700">
                      AYZ Sierra de Meira
                    </span>
                    .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('configure-qr-links')}
                  title="Update Google Reviews or Trustpilot URL"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>

              {/* Platform Switcher Tabs (Google / Trip.com / Trustpilot Placeholder) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedQrPlatform('google')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedQrPlatform === 'google'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Google (2.0 ★)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQrPlatform('trip')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedQrPlatform === 'trip'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trip.com (3.1/5)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQrPlatform('trustpilot')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedQrPlatform === 'trustpilot'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trustpilot
                </button>
              </div>

              {/* Scannable QR Code Container */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0 group-hover:scale-[1.02] transition-transform duration-200">
                  <QRCodeSVG
                    value={activeQrUrl}
                    size={132}
                    level="M"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                  />
                </div>

                <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
                  <div className="text-xs text-slate-600">
                    {selectedQrPlatform === 'google' && (
                      <>
                        <p className="font-semibold text-slate-900">
                          Google Maps & Reviews
                        </p>
                        <p className="font-mono tabular-nums text-slate-600 mt-0.5">
                          Verified Rating: 2.0 / 5.0 · 34 reviews
                        </p>
                      </>
                    )}
                    {selectedQrPlatform === 'trip' && (
                      <>
                        <p className="font-semibold text-slate-900">
                          Trip.com Guest Reviews
                        </p>
                        <p className="font-mono tabular-nums text-slate-600 mt-0.5">
                          Verified Rating: 3.1 / 5.0 · 41 reviews
                        </p>
                      </>
                    )}
                    {selectedQrPlatform === 'trustpilot' && (
                      <>
                        <p className="font-semibold text-slate-900">
                          Trustpilot Link (Editable Placeholder)
                        </p>
                        <p className="text-slate-500 mt-0.5">
                          Click “Update Review Links” to set your official Trustpilot URL
                        </p>
                      </>
                    )}
                  </div>

                  <p
                    className="text-[11px] font-mono text-slate-500 truncate bg-white px-2.5 py-1 rounded border border-slate-200"
                    title={activeQrUrl}
                  >
                    {activeQrUrl}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <a
                      href={activeQrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>See Reviews</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveModal('write-review')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Leave a Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText('Review Page URL', activeQrUrl)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Real scannable QR · Encodes active review URL</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('configure-qr-links')}
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Update Review Links
                </button>
              </div>
            </section>

            {/* About this data notice */}
            <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  About this data
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('about-data')}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Learn more
                </button>
              </div>
              <p className="leading-relaxed">
                Hotel nightly prices in PKR are provided by official property channels and online travel agencies for the selected check-in window.
              </p>
            </section>
          </div>
        </div>

        {/* =====================================================================
            EXCLUSIVE OFFERS & PACKAGES (Special Offers & Packages)
            ===================================================================== */}
        <section
          id="special-offers-section"
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 space-y-10 shadow-xs"
        >
          {/* Section Heading & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <span>AYZ Sierra de Meira · Puente de Vallecas, Madrid</span>
                <span aria-hidden="true">·</span>
                <span>Direct & Seasonal Packages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Exclusive Offers & Packages
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Discover exceptional stays and exclusive offers designed to make your experience unforgettable.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={buildWhatsAppUrl(
                  'Special Offers & Packages at AYZ Sierra de Meira'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Direct Inquiry</span>
              </a>
            </div>
          </div>

          {/* Featured Offer Banner at Top of Section */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-medium">
                  <span>Featured Official Direct Rate</span>
                  <span aria-hidden="true">·</span>
                  <span>Auto Check-In from 3:00 PM</span>
                  <span aria-hidden="true">·</span>
                  <span>Free Wi-Fi Included</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">
                  Book Direct on Official Site from PKR 10,346 / Night
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Compare verified nightly rates: Official Site at{' '}
                  <span className="font-mono tabular-nums text-white font-semibold">
                    PKR 10,346
                  </span>{' '}
                  vs. Trip.com at{' '}
                  <span className="font-mono tabular-nums text-slate-200">
                    PKR 11,988
                  </span>{' '}
                  and Booking.com at{' '}
                  <span className="font-mono tabular-nums text-slate-200">
                    PKR 12,537
                  </span>
                  . Includes 24/7 digital keycode access and Free Wi-Fi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPackageModal(packages[0])}
                  className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Reserve Direct Rate (PKR 10,346)
                </button>
                <a
                  href={buildWhatsAppUrl(
                    'Featured Official Direct Rate (PKR 10,346)'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 min-h-[220px] relative">
              <ResilientImage
                src={imgLobby}
                alt="AYZ Sierra de Meira Automated Check-In Lobby"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* "Find Your Perfect Stay" Interactive Date & Guest Selector Bar */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Find Your Perfect Stay
                </h3>
                <p className="text-xs text-slate-500">
                  Select your check-in and check-out dates and number of guests to customize package totals below
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-blue-700 font-semibold">
                Selected Window: {formatShortDate(checkInDate)} →{' '}
                {formatShortDate(checkOutDate)} ({nightsCount}{' '}
                {nightsCount === 1 ? 'night' : 'nights'}, {guestsCount}{' '}
                {guestsCount === 1 ? 'guest' : 'guests'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Number of Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value={1}>1 Guest (Optimal for compact room)</option>
                  <option value={2}>2 Guests (Standard double)</option>
                  <option value={3}>3 Guests (Requires 2 rooms)</option>
                  <option value={4}>4 Guests (2 Adjacent rooms)</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Updated package availability for ${formatShortDate(
                        checkInDate
                      )} – ${formatShortDate(checkOutDate)} (${guestsCount} guests).`
                    )
                  }
                  className="w-full py-2 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Update Stay Dates
                </button>
              </div>
            </div>
          </div>

          {/* 6 Attractive Offer Cards Grid (A through F) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isExpired = pkg.status === 'expired';
              const meetsMinStay = nightsCount >= pkg.minStayNights;

              return (
                <article
                  key={pkg.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image */}
                    <div className="aspect-4/3 w-full bg-slate-100 relative overflow-hidden">
                      <ResilientImage
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent flex flex-col justify-end p-4 text-white">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-200">
                          <span>
                            {pkg.categoryCode}. {pkg.packageType}
                          </span>
                          <span className="font-mono tabular-nums">
                            Min {pkg.minStayNights} night
                            {pkg.minStayNights > 1 ? 's' : ''}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                          {pkg.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      {/* Price & Verified / Placeholder Information */}
                      <div className="pb-3 border-b border-slate-100 space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                            {pkg.priceLabel}
                          </span>
                          {pkg.originalPriceLabel && (
                            <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                              {pkg.originalPriceLabel}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            {pkg.discountBadge
                              ? pkg.discountBadge
                              : pkg.isPlaceholderRate
                              ? 'Editable rate placeholder'
                              : 'Verified official property rate'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingPackageId(
                                editingPackageId === pkg.id ? null : pkg.id
                              )
                            }
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            {editingPackageId === pkg.id ? 'Done' : 'Edit rate'}
                          </button>
                        </div>

                        {/* Inline rate & status editor for hotel owner */}
                        {editingPackageId === pkg.id && (
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                            <label className="block text-[11px] font-medium text-slate-700">
                              Update Package Rate Text:
                            </label>
                            <input
                              type="text"
                              value={pkg.priceLabel}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPackages((prev) =>
                                  prev.map((item) =>
                                    item.id === pkg.id
                                      ? {
                                          ...item,
                                          priceLabel: val,
                                          isPlaceholderRate: false,
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                            />
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-600">
                                Offer Status:
                              </span>
                              <select
                                value={pkg.status}
                                onChange={(e) => {
                                  const st = e.target
                                    .value as HotelPackageOffer['status'];
                                  setPackages((prev) =>
                                    prev.map((item) =>
                                      item.id === pkg.id
                                        ? { ...item, status: st }
                                        : item
                                    )
                                  );
                                }}
                                className="px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                              >
                                <option value="available">Available</option>
                                <option value="seasonal">Seasonal Active</option>
                                <option value="expired">
                                  Unavailable / Expired
                                </option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Included Amenities & Services */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-900">
                          Included amenities & services:
                        </p>
                        <ul className="space-y-1">
                          {pkg.includedBenefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-2 text-xs text-slate-600"
                            >
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Occupancy, Validity & Conditions */}
                      <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                        <div>
                          <strong className="text-slate-700">Occupancy:</strong>{' '}
                          {pkg.occupancyLimit}
                        </div>
                        <div>
                          <strong className="text-slate-700">Validity:</strong>{' '}
                          {pkg.validityPeriod}
                        </div>
                        <div>
                          <strong className="text-slate-700">Conditions:</strong>{' '}
                          {pkg.bookingConditions}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTAs & Availability Notice */}
                  <div className="p-5 pt-0 space-y-2.5">
                    {isExpired ? (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          This seasonal offer is currently unavailable or has expired for the selected dates.
                        </span>
                      </div>
                    ) : !meetsMinStay ? (
                      <div className="text-[11px] text-amber-700 bg-amber-50/80 px-2.5 py-1.5 rounded border border-amber-200">
                        Note: Requires minimum {pkg.minStayNights}-night stay (currently {nightsCount} night selected).
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isExpired}
                        onClick={() => setSelectedPackageModal(pkg)}
                        className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                          isExpired
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        }`}
                      >
                        {isExpired ? 'Offer Unavailable' : pkg.ctaLabel}
                      </button>

                      <a
                        href={buildWhatsAppUrl(
                          `${pkg.packageType} — ${pkg.title}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Inquire via WhatsApp"
                        className="p-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shrink-0"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Small FAQ Area Covering Offer Validity, Booking Conditions, Cancellations & Inclusions */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <HelpCircle className="w-4 h-4" />
                <span>Offer Policies & Inclusions</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Special Offers FAQ
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent answers regarding offer validity, minimum stays, cancellation terms, and automated check-in at AYZ Sierra de Meira.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              {PACKAGE_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.question} className="bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            PROFESSIONAL CLIENT TESTIMONIALS SECTION
            ("What Our Clients Say" — 3-Card Responsive Grid + Carousel)
            ===================================================================== */}
        <section
          id="client-testimonials-section"
          className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white via-purple-50/35 to-white p-6 sm:p-8 lg:p-10 space-y-8 shadow-xs"
        >
          {/* Section Heading & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-700 font-medium">
                <span>Digital Excellence & Web Partner Showcase</span>
                <span aria-hidden="true">·</span>
                <span>Sample Agency Client Reviews (Demo Content)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                What Our Clients Say
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Real feedback on our commitment to quality, creativity, and digital excellence.
              </p>
            </div>

            {/* Carousel Pagination & View All Toggle */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setShowAllTestimonials((prev) => !prev)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {showAllTestimonials
                  ? 'Show 3-Card Carousel'
                  : `View All (${AGENCY_TESTIMONIALS.length})`}
              </button>

              {!showAllTestimonials && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonialPage((prev) =>
                        prev > 0 ? prev - 1 : totalTestimonialPages - 1
                      )
                    }
                    aria-label="Previous testimonials"
                    className="p-2 bg-white border border-slate-200 hover:border-purple-400 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono tabular-nums text-slate-600 px-2">
                    {testimonialPage + 1} / {totalTestimonialPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonialPage((prev) =>
                        prev < totalTestimonialPages - 1 ? prev + 1 : 0
                      )
                    }
                    aria-label="Next testimonials"
                    className="p-2 bg-white border border-slate-200 hover:border-purple-400 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3 Cards Per Row Desktop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTestimonials.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-purple-400 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 relative"
              >
                <div className="space-y-4">
                  {/* Top Row: 5 Golden Stars + Verified Client Info + Light Purple Quote Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div
                        className="flex items-center gap-1 text-amber-400"
                        aria-label="5 out of 5 golden stars"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Verified Client</span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-slate-500 font-normal">
                          Demo Showcase
                        </span>
                      </div>
                    </div>

                    <Quote className="w-8 h-8 text-purple-200 group-hover:text-purple-300 transition-colors shrink-0" />
                  </div>

                  {/* Service Category Kicker */}
                  <p className="text-xs font-semibold text-purple-700">
                    {item.serviceCategory}
                  </p>

                  {/* Review Text */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    “{item.reviewText}”
                  </p>
                </div>

                {/* Circular Profile Image + Bold Dark Navy Name + Job Title & Company */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                    <ResilientImage
                      src={item.avatarUrl}
                      alt={item.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {item.clientName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {item.jobTitle}, {item.companyName}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* INTERACTIVE MODALS FOR ALL BUTTON ACTIONS */}
      {selectedAmenityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-xl">
            <div className="aspect-16/9 w-full bg-slate-100 relative">
              <ResilientImage
                src={selectedAmenityModal.imageUrl}
                alt={selectedAmenityModal.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedAmenityModal(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <AmenityIcon
                  name={selectedAmenityModal.iconName}
                  className="w-5 h-5 text-blue-600"
                />
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedAmenityModal.title}
                </h3>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-xs text-slate-500">
                  {selectedAmenityModal.subtitle}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedAmenityModal.description}
              </p>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAmenityModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOfferForRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs text-slate-500">
                  Room Selection · {selectedOfferForRoomModal.provider}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedOfferForRoomModal.roomType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOfferForRoomModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Check-in / Check-out</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {formatShortDate(checkInDate)} →{' '}
                  {formatShortDate(checkOutDate)} ({nightsCount} night
                  {nightsCount > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Occupancy</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>Nightly Rate</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  PKR{' '}
                  {selectedOfferForRoomModal.basePkrPerNight.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-slate-900">
                  Total Stay Price
                </span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  PKR{' '}
                  {(
                    selectedOfferForRoomModal.basePkrPerNight * nightsCount
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOfferForRoomModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingConfirmation(
                    `Reserved ${selectedOfferForRoomModal.roomType} via ${selectedOfferForRoomModal.provider} for ${formatShortDate(
                      checkInDate
                    )} – ${formatShortDate(checkOutDate)} (PKR ${(
                      selectedOfferForRoomModal.basePkrPerNight * nightsCount
                    ).toLocaleString()}). Auto check-in PIN will arrive by SMS.`
                  );
                  setSelectedOfferForRoomModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Confirm Auto Check-In Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Booking & Inquiry Modal */}
      {selectedPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handlePackageBookingSubmit}
            className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs text-blue-600 font-semibold">
                  {selectedPackageModal.packageType}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedPackageModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackageModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-mono tabular-nums"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={packageGuestName}
                  onChange={(e) => setPackageGuestName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={packageGuestPhone}
                  onChange={(e) => setPackageGuestPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                rows={2}
                value={packageSpecialNotes}
                onChange={(e) => setPackageSpecialNotes(e.target.value)}
                placeholder="Arrival time, adjacent room request, or invoice details..."
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">Package Rate:</span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {selectedPackageModal.priceLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <a
                href={buildWhatsAppUrl(
                  `${selectedPackageModal.packageType} — ${selectedPackageModal.title}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquire on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPackageModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Submit Package Booking
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Configure QR Review Links Modal */}
      {activeModal === 'configure-qr-links' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveModal(null);
              showToast('QR Code review links updated.');
            }}
            className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Configure “Review Us!” QR Code Links
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Paste your official Google Reviews URL, Trip.com listing URL, or Trustpilot review URL below. The QR code updates automatically.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Google Reviews URL
                </label>
                <input
                  type="url"
                  required
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Trip.com Reviews URL
                </label>
                <input
                  type="url"
                  required
                  value={tripComReviewUrl}
                  onChange={(e) => setTripComReviewUrl(e.target.value)}
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Trustpilot Reviews URL (Editable Placeholder)
                </label>
                <input
                  type="url"
                  required
                  value={trustpilotReviewUrl}
                  onChange={(e) => setTrustpilotReviewUrl(e.target.value)}
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Save & Regenerate QR
              </button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'directions' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Directions to AYZ Sierra de Meira
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-medium text-slate-900">
                Destination: {propertyAddress} (Plus Code: 98XP+MP Madrid, Spain)
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-900">
                  By Madrid Metro (Recommended · 14 mins from Atocha):
                </p>
                <p>
                  Take Metro Line 1 (light blue) toward Valdecarros and exit at{' '}
                  <strong>Nueva Numancia</strong>. Walk 350 meters north along
                  Calle de la Sierra de Meira to #53.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-900">
                  From Adolfo Suárez Madrid–Barajas Airport (MAD):
                </p>
                <p>
                  22 minutes by taxi via M-30 South (approx. €33 fixed urban
                  tariff) or Metro Line 8 → Nuevos Ministerios → Line 1.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'nearby' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Nearby in Puente de Vallecas, Madrid
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {NEARBY_PLACES.map((place) => (
                <div key={place.name} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {place.name}
                    </span>
                    <span className="font-mono tabular-nums text-blue-600 font-medium">
                      {place.distance}
                    </span>
                  </div>
                  <p className="text-slate-500">{place.detail}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'write-review' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddReview}
            className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Write a review for AYZ Sierra de Meira
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                placeholder="e.g., Carlos G."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Rating (1 to 5)
              </label>
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums"
              >
                <option value={5}>5 / 5 — Excellent</option>
                <option value={4}>4 / 5 — Good</option>
                <option value={3}>3 / 5 — Average</option>
                <option value={2}>2 / 5 — Below Average</option>
                <option value={1}>1 / 5 — Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Review Details
              </label>
              <textarea
                rows={4}
                required
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your experience with the auto check-in process, room size, and cleanliness..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Post Review
              </button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'add-photo' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddPhoto}
            className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add photos & videos
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                required
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                placeholder="e.g., Single Room Desk & Window"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newPhotoCategory}
                onChange={(e) =>
                  setNewPhotoCategory(
                    e.target.value as PhotoItem['category']
                  )
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="Rooms">Rooms</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Exterior">Exterior</option>
                <option value="Auto Check-in">Auto Check-in</option>
                <option value="Hotel Details">Hotel Details</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Hotlinked Image URL
              </label>
              <input
                type="url"
                required
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Upload Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {(activeModal === 'suggest-edit' ||
        activeModal === 'add-website' ||
        activeModal === 'claim-business' ||
        activeModal === 'about-data') && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveModal(null);
              showToast('Property listing details updated.');
            }}
            className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === 'suggest-edit' && 'Suggest an edit'}
                {activeModal === 'add-website' && 'Update official website'}
                {activeModal === 'claim-business' &&
                  'Claim AYZ Sierra de Meira'}
                {activeModal === 'about-data' && 'About this listing data'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModal === 'about-data' ? (
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  This property view aggregates live room rates (displayed in
                  PKR), check-in/check-out policies, and verified guest reviews
                  from Google (34 reviews, 2.0 average) and Trip.com (41
                  reviews, 3.1/5 average).
                </p>
                <p>
                  Location Plus Code: <strong>98XP+MP Madrid, Spain</strong> ·
                  Puente de Vallecas.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={propertyPhone}
                    onChange={(e) => setPropertyPhone(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={propertyWebsite}
                    onChange={(e) => setPropertyWebsite(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              {activeModal !== 'about-data' && (
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            AYZ Sierra de Meira · C. de la Sierra de Meira, 53, Puente de Vallecas, 28038 Madrid, Spain
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#review-qr-card"
              className="hover:text-slate-900 transition-colors"
            >
              Review Us QR
            </a>
            <a
              href="#special-offers-section"
              className="hover:text-slate-900 transition-colors"
            >
              Exclusive Offers
            </a>
            <a
              href="#client-testimonials-section"
              className="hover:text-slate-900 transition-colors"
            >
              Client Testimonials
            </a>
            <button
              type="button"
              onClick={() => setActiveModal('about-data')}
              className="hover:text-slate-900 cursor-pointer"
            >
              About this data
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('suggest-edit')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Suggest an edit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
