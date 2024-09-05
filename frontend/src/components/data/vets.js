// src/data/vets.js

import vet1 from "../assets/vet1.jpg";
import vet2 from "../assets/vet2.jpg";
import vet3 from "../assets/vet3.jpg";
import vet4 from "../assets/vet4.jpg";
const vets = [
    {
      id: 'vet1',
      name: 'Dr. Sophie',
      title: 'Veterinarian',
      short_description: 'Dr. Sophie is an Australian veterinarian who graduated from the University of Melbourne\'s Veterinary School in 2019...',
      long_description: 'Dr. Sophie is an Australian veterinarian who graduated from the University of Melbourne\'s Veterinary School in 2019. After spending two years in rural Victoria working with both small animals and livestock, she returned to Melbourne to join the Urban Pet Clinic in Docklands. Dr. Sophie has a keen interest in dermatology and has taken additional courses to specialize in this area. She enjoys Melbourne\'s vibrant café culture and spends her weekends trying out new brunch spots. Sophie also participates in marathons around the city and volunteers at local animal shelters.',
      imagePath: vet1,
      detailPath: '/dr-sophie'
    },
    {
      id: 'vet2',
      name: 'Dr. Liam',
      title: 'Emergency Care Veterinarian',
      short_description: 'Dr. Liam is a British vet who moved to Melbourne, specializing in emergency care and critical conditions...',
      long_description: 'Dr. Liam is a British vet who moved to Melbourne after graduating from the Royal Veterinary College in London in 2016. He works at the Bayside Veterinary Hospital in St Kilda, where he specializes in emergency care and critical conditions. Liam has embraced Melbourne\'s sports scene, becoming a fan of Australian Rules football, and regularly attends games at the MCG. He is also an amateur photographer, capturing Melbourne\'s dynamic street art and coastal landscapes.',
      imagePath: vet2,
      detailPath: '/dr-liam'
    },
    {
      id: 'vet3',
      name: 'Dr. Emily',
      title: 'Feline Specialist',
      short_description: 'Dr. Emily focuses on feline medicine and animal welfare in Melbourne...',
      long_description: 'Dr. Emily is an Australian vet who completed her studies at James Cook University in 2018 and has been working in Melbourne ever since. She is part of the team at the Richmond Veterinary Clinic, where she focuses on feline medicine. Emily is passionate about animal welfare and is involved in several initiatives to help stray cats in the city. In her leisure time, she enjoys exploring Melbourne\'s extensive parks and gardens, and she is an active member of a local gardening club.',
      imagePath: vet3,
      detailPath: '/dr-emily'
    },
    {
      id: 'vet4',
      name: 'Dr. Aaron',
      title: 'Surgical Specialist',
      short_description: 'Dr. Aaron specializes in surgical procedures for small animals, embracing minimally invasive techniques...',
      long_description: 'Dr. Aaron is a New Zealand vet who moved to Melbourne after obtaining his degree from Massey University in 2017. He works at the Melbourne Veterinary Specialist Centre, specializing in surgical procedures for small animals. Aaron is particularly interested in minimally invasive techniques and regularly attends workshops and seminars to enhance his skills. An avid cyclist, he loves cycling along the Yarra River and through the Dandenong Ranges on weekends. Aaron also enjoys Melbourne\'s live music scene and is a regular at jazz and blues nights around the city.',
      imagePath: vet4,
      detailPath: '/dr-aaron'
    }
  ];
  
  export default vets;
  