import { useState, useEffect } from 'react';
import { listingApi } from '../services/apis/listingApi';
import type { ListingOut } from '../types/listing';
import { ListingCard } from '../components/listing/ListingCard';

export const ListingsPage = () => {
  const [listings, setListings] = useState<ListingOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedListings = await listingApi.getAllListings();
        setListings(fetchedListings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>All Listings</h1>
        <p>Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>All Listings</h1>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>All Listings</h1>
      {listings.length === 0 ? (
        <p>No listings available.</p>
      ) : (
        <div>
          <p>Found {listings.length} listings</p>
          <div>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
