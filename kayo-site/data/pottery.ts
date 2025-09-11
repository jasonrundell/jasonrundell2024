export interface ArtPiece {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  availability: 'available' | 'sold';
  images: string[];
  meta: Record<string, string>;
}

export const potteryPieces: ArtPiece[] = [
  {
    slug: 'sunrise-vase',
    title: 'Sunrise Vase',
    shortDescription: 'Warm-toned ceramic vase.',
    description: 'A hand-thrown vase with warm sunrise glazes.',
    availability: 'available',
    images: [
      'https://placehold.co/600x400?text=Sunrise+Vase+1',
      'https://placehold.co/600x400?text=Sunrise+Vase+2'
    ],
    meta: {
      Dimensions: '25cm x 15cm',
      Material: 'Stoneware',
    },
  },
  {
    slug: 'forest-bowl',
    title: 'Forest Bowl',
    shortDescription: 'Green glazed serving bowl.',
    description: 'Large bowl finished with layered forest greens.',
    availability: 'sold',
    images: [
      'https://placehold.co/600x400?text=Forest+Bowl+1',
      'https://placehold.co/600x400?text=Forest+Bowl+2'
    ],
    meta: {
      Dimensions: '30cm diameter',
      Material: 'Porcelain',
    },
  },
];
