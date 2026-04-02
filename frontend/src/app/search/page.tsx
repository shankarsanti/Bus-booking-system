import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import BusCard from '../../components/BusCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchBuses();
  }, [searchParams]);

  const searchBuses = async () => {
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = new Date(searchParams.get('date') || '');

    const results = await tripService.searchTrips(from, to, date);
    setTrips(results);
    setLoading(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Buses</h1>
      <div className="space-y-4">
        {trips.map((trip: any) => (
          <BusCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
