
export function haversineDistance ( coord1: [ number, number ], coord2: [ number, number ] )
{
  const toRad = (x: number) => (x * Math.PI) / 180;

  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371e3; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

export function calculateFare ( distance: number, type: string )
{
  
  const baseFare = type === "premium" ? 50 : 30; 
  const perKmRate = type === "premium" ? 18 : 12; // Taka per km

  return baseFare + (distance / 1000) * perKmRate;
}
