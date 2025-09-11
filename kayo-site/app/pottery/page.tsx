import Link from 'next/link';
import { potteryPieces } from '../../data/pottery';

export const metadata = { title: 'Pottery | Kayo O Young' };

export default function PotteryList() {
  return (
    <section>
      <h1>Pottery</h1>
      <ul className="art-list">
        {potteryPieces.map((piece) => (
          <li key={piece.slug}>
            <Link href={`/pottery/${piece.slug}`}>
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
