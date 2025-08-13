import type { ListingOut } from '../../types/listing';

interface ListingCardProps {
  listing: ListingOut;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <div>
      <h3>{listing.title}</h3>
      
      <div>
        <p><strong>Species:</strong> {listing.species}</p>
        <p><strong>Sex:</strong> {listing.sex}</p>
        <p><strong>Birth Year:</strong> {listing.birth}</p>
        <p><strong>Price:</strong> ${listing.priceUSD.toFixed(2)} USD</p>
      </div>

      <div>
        <p><strong>Production:</strong> {listing.production}</p>
        <p><strong>Status:</strong> {listing.status}</p>
      </div>

      {listing.traits.length > 0 && (
        <div>
          <p><strong>Traits:</strong></p>
          <ul>
            {listing.traits.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p><strong>Description:</strong></p>
        <p>{listing.description}</p>
      </div>

      <div>
        <p><strong>Location:</strong> {listing.location.city}, {listing.location.state}, {listing.location.country}</p>
      </div>

      <div>
        <p><strong>Health Info:</strong></p>
        <p>Vet Checked: {listing.healthInfo.vetChecked ? 'Yes' : 'No'}</p>
        {listing.healthInfo.notes && (
          <p>Notes: {listing.healthInfo.notes}</p>
        )}
      </div>

      {listing.photos.length > 0 && (
        <div>
          <p><strong>Photos:</strong></p>
          <div>
            {listing.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`${listing.title} photo ${index + 1}`} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p><strong>Posted:</strong> {new Date(listing.created_at).toLocaleDateString()}</p>
        <p><strong>Updated:</strong> {new Date(listing.updated_at).toLocaleDateString()}</p>
      </div>
      
      <hr />
    </div>
  );
};
