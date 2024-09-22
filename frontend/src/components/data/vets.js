import vet1 from "../assets/vet1.jpg";
import vet2 from "../assets/vet2.jpg";
import vet3 from "../assets/vet3.jpg";
import vet4 from "../assets/vet4.jpg";
import vet5 from "../assets/vet5.jpg";
import vet6 from "../assets/vet6.jpg";
import vet7 from "../assets/vet7.jpg";
import vet8 from "../assets/vet8.jpg";
import vet9 from "../assets/vet9.jpg";

const vets = [
  {
    id: 'vet1',
    name: 'Dr. Sophie',
    title: 'Veterinarian',
    short_description: 'Specializing in dermatology, Dr. Sophie brings a wealth of experience to the VetCare team...',
    long_description: 'Dr. Sophie is a dedicated veterinarian who graduated from the University of Melbourne\'s Veterinary School in 2019. Her expertise lies in dermatology, a field she was drawn to after witnessing common skin ailments in pets during her early years at a rural practice in Victoria. Dr. Sophie has since committed to advancing her knowledge with continuous professional development and is known for her compassionate approach to patient care. She finds great satisfaction in improving the quality of life for pets with chronic skin conditions. Outside the clinic, Dr. Sophie is an avid marathon runner and a connoisseur of the local café scene, often seen savoring the newest espresso blends.',
    imagePath: vet1,
    detailPath: '/dr-sophie'
  },
  {
    id: 'vet2',
    name: 'Dr. Liam',
    title: 'Emergency Care Veterinarian',
    short_description: 'Dr. Liam specializes in emergency and critical care at VetCare...',
    long_description: 'Dr. Liam, originally from London, has carved a niche in emergency and critical care since his graduation from the Royal Veterinary College in 2016. His move to Melbourne introduced him to VetCare where his quick decision-making and depth of surgical knowledge have saved countless lives. Dr. Liam’s expertise extends to treating acute trauma cases and complex surgical emergencies. When not at work, he is a passionate sports enthusiast, capturing Melbourne’s dynamic landscapes through his lens and cheering at the MCG during AFL season.',
    imagePath: vet2,
    detailPath: '/dr-liam'
  },
  {
    id: 'vet3',
    name: 'Dr. Emily',
    title: 'Feline Specialist',
    short_description: 'Dr. Emily focuses on feline medicine at VetCare, ensuring the best care for our feline friends...',
    long_description: 'With a heartfelt passion for cats, Dr. Emily specializes in feline medicine, an interest that blossomed during her studies at James Cook University. Since joining VetCare, she has developed a reputation for her gentle handling and deep understanding of feline behavior and physiology. Dr. Emily actively contributes to feline welfare through community outreach and education programs, aiming to improve the lives of indoor and stray cats alike. Her weekends are often spent exploring local parks and engaging in Melbourne\'s vibrant gardening community.',
    imagePath: vet3,
    detailPath: '/dr-emily'
  },
  {
    id: 'vet4',
    name: 'Dr. Aaron',
    title: 'Surgical Specialist',
    short_description: 'Dr. Aaron leads the surgical unit at VetCare, focusing on minimally invasive techniques...',
    long_description: 'Dr. Aaron from New Zealand is a highly skilled surgeon known for his proficiency in minimally invasive surgical techniques. Graduating from Massey University, his career at VetCare involves leading a team of surgeons in pioneering advanced surgical treatments that offer faster recovery times for pets. Dr. Aaron’s commitment to veterinary excellence is evident in his continuous research and adaptation of the latest technologies in veterinary surgery. A lover of the outdoors, he spends his leisure cycling through Melbourne’s scenic routes and enjoying live music events.',
    imagePath: vet4,
    detailPath: '/dr-aaron'
  },
  {
    id: 'vet5',
    name: 'Dr. Rachel',
    title: 'Canine Behavior Specialist',
    short_description: 'Dr. Rachel is dedicated to improving canine behavior and well-being at VetCare...',
    long_description: 'Dr. Rachel is a University of Sydney alumna whose interest in animal behavior has led her to become a leading canine behavior specialist at VetCare. She works closely with pet owners to develop behavioral modification plans that address issues ranging from simple obedience problems to complex anxiety disorders. Dr. Rachel’s approach combines behavioral science with holistic well-being practices to foster healthier relationships between pets and their families. Her free time is often spent hiking and volunteering in dog behavior workshops and seminars.',
    imagePath: vet5,
    detailPath: '/dr-rachel'
  },
  {
    id: 'vet6',
    name: 'Dr. Omar',
    title: 'Avian and Exotic Pet Specialist',
    short_description: 'Dr. Omar treats a variety of avian and exotic pets at VetCare, providing specialized care...',
    long_description: 'Dr. Omar graduated from Cornell University with a focus on avian and exotic animals. His deep understanding and passion for birds and exotic pets make him a unique specialist at VetCare, where he is committed to providing comprehensive care tailored to the needs of less common pets. Dr. Omar’s clinic is equipped with state-of-the-art facilities designed to cater to the unique requirements of these animals. He is also an enthusiastic birdwatcher and wildlife photographer, often traveling to remote locations to capture the beauty of wildlife.',
    imagePath: vet6,
    detailPath: '/dr-omar'
  },
  {
    id: 'vet7',
    name: 'Dr. Lisa',
    title: 'Equine Specialist',
    short_description: 'With a focus on equine medicine, Dr. Lisa brings her expert care to VetCare\'s equine patients...',
    long_description: 'A graduate from the University of California, Davis, Dr. Lisa has dedicated her career to equine medicine, specializing in performance issues and rehabilitative therapy. At VetCare, she applies her extensive knowledge to help enhance the health and performance of competition horses and pleasure equines. Dr. Lisa’s expertise is also sought after in equine nutrition and preventive care, making her a beloved figure in the equine community. Her competitive spirit finds an outlet in equestrian sports, where she regularly competes at a national level.',
    imagePath: vet7,
    detailPath: '/dr-lisa'
  },
  {
    id: 'vet8',
    name: 'Dr. Bruce',
    title: 'Senior Veterinarian',
    short_description: 'Dr. Bruce oversees complex medical cases at VetCare, bringing decades of experience...',
    long_description: 'Dr. Bruce, a distinguished graduate from the University of Queensland, brings over thirty years of veterinary experience to VetCare, where he oversees complex medical cases and provides mentorship to the veterinary team. His areas of expertise include internal medicine and geriatric care, ensuring that senior pets live their later years with quality and dignity. Outside of his professional life, Dr. Bruce is an avid mentor to young vets and enjoys family trips exploring Australia’s natural wonders.',
    imagePath: vet8,
    detailPath: '/dr-bruce'
  },
  {
    id: 'vet9',
    name: 'Dr. Anita',
    title: 'Pediatric Veterinary Specialist',
    short_description: 'Dr. Anita specializes in pediatric care for young pets at VetCare...',
    long_description: 'Dr. Anita, who hails from Murdoch University, is a pediatric veterinary specialist at VetCare. Her practice focuses on the developmental stages of puppies and kittens, ensuring they receive the best start in life through comprehensive health plans that include vaccinations, nutrition, and early socialization techniques. Dr. Anita is passionate about animal welfare, dedicating much of her time to volunteer work and educational outreach programs. Her hobbies include pottery and landscape gardening, which she finds therapeutic.',
    imagePath: vet9,
    detailPath: '/dr-anita'
  }
];

export default vets;
