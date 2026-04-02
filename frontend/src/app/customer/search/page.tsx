import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Search, ArrowLeftRight } from 'lucide-react';

export default function CustomerSearch() {
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Auto-fill form from URL parameters
  useEffect(() => {
    const from = urlSearchParams.get('from');
    const to = urlSearchParams.get('to');
    const date = urlSearchParams.get('date');

    if (from || to || date) {
      setFormData({
        from: from || formData.from,
        to: to || formData.to,
        date: date || formData.date
      });
    }
  }, [urlSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${formData.from}&to=${formData.to}&date=${formData.date}`);
  };

  const swapLocations = () => {
    setFormData({
      ...formData,
      from: formData.to,
      to: formData.from
    });
  };

  const setDateShortcut = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData({...formData, date: date.toISOString().split('T')[0]});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Search Buses</h1>
          <Link to="/customer/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Source City"
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Destination City"
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={swapLocations}
                className="p-2 border rounded-full hover:bg-gray-100 transition"
              >
                <ArrowLeftRight size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Journey Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setDateShortcut(0)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Today
              </button>
              <button 
                type="button" 
                onClick={() => setDateShortcut(1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Tomorrow
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search Buses
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
