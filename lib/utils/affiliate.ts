export const getHotelLink = (destination: string) => {
    // Booking.com deep link
    // Generally looks like: https://www.booking.com/searchresults.html?ss={destination}
    // We can add affiliate ID later
    const query = encodeURIComponent(destination);
    return `https://www.booking.com/searchresults.html?ss=${query}&aid=304142`;
};

export const getFlightLink = (destination: string) => {
    // Skyscanner Affiliate Link (Impact Properties)
    // We attempt to deep link to the search results using the 'u' parameter.
    // Base search: https://www.skyscanner.com/transport/flights/everywhere/{destination}
    const query = encodeURIComponent(destination);
    const targetUrl = `https://www.skyscanner.com/transport/flights/everywhere/${query}`;

    // Impact Radius (pxf.io) uses 'u' for destination URL
    return `https://skyscanner.pxf.io/bOMygk?u=${encodeURIComponent(targetUrl)}`;
};

export const getActivityLink = (activity: string, destination: string) => {
    // Viator or GetYourGuide
    const query = encodeURIComponent(`${activity} in ${destination}`);
    return `https://www.viator.com/searchResults/all?text=${query}&pid=P00000000`; // Placeholder PID
};
