import { notFound } from 'next/navigation';
import { potteryPieces } from '../../../data/pottery';

interface Params { slug: string }

export default function PotteryDetail({ params }: { params: Params }) {
  const piece = potteryPieces.find((p) => p.slug === params.slug);
  if (!piece) {
    notFound();
  }
  return (
    <article>
      <h1>{piece.title}</h1>
      <div>
        {piece.images.map((src, idx) => (
          <img key={idx} src={src} alt={`${piece.title} image ${idx + 1}`} />
        ))}
      </div>
      <p>{piece.description}</p>
      <ul>
        {Object.entries(piece.meta).map(([key, value]) => (
          <li key={key}>
            <strong>{key}: </strong>
            {value}
          </li>
        ))}
      </ul>
      <p>Status: {piece.availability === 'available' ? 'Available' : 'Sold'}</p>
      <p>
        Contact Kayo at <a href="mailto:kayo@example.com">kayo@example.com</a> or
        <a href="tel:+15551234567">+1 (555) 123-4567</a> to acquire this piece.
      </p>
    </article>
  );
}
