import Link from 'next/link';
import { paintingPieces } from '../../data/paintings';

export const metadata = { title: 'Paintings | Kayo O Young' };

export default function PaintingsList() {
  return (
    <section>
      <h1>Paintings</h1>
      <ul className="art-list">
        {paintingPieces.map((piece) => (
          <li key={piece.slug}>
            <Link href={`/paintings/${piece.slug}`}>
              <img src={piece.images[0]} alt={piece.title} />
              <div>
                <h2>{piece.title}</h2>
                <p>{piece.shortDescription}</p>
                <p>{piece.availability === 'available' ? 'Available' : 'Sold'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
