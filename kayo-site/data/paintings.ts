import type { ArtPiece } from './pottery';

export const paintingPieces: ArtPiece[] = [
  {
    slug: 'ocean-dreams',
    title: 'Ocean Dreams',
    shortDescription: 'Abstract seascape in blues.',
    description: 'Layers of blue capture the movement of the ocean.',
    availability: 'available',
    images: [
      'https://placehold.co/600x400?text=Ocean+Dreams+1',
      'https://placehold.co/600x400?text=Ocean+Dreams+2'
    ],
    meta: {
      Dimensions: '50cm x 70cm',
      Medium: 'Acrylic on canvas',
    },
  },
  {
    slug: 'autumn-path',
    title: 'Autumn Path',
    shortDescription: 'Impressionistic fall scene.',
    description: 'Warm autumn colours guide you down a quiet path.',
    availability: 'sold',
    images: [
      'https://placehold.co/600x400?text=Autumn+Path+1',
      'https://placehold.co/600x400?text=Autumn+Path+2'
    ],
    meta: {
      Dimensions: '60cm x 90cm',
      Medium: 'Oil on canvas',
    },
  },
];
