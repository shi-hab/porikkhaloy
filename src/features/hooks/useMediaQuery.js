import { useEffect, useState } from 'react';

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Create a media query list for the given query
        const mediaQueryList = window.matchMedia(query);

        // Define a listener to handle changes to the media query list
        const handleChange = (event) => setMatches(event.matches);

        // Set the initial state
        setMatches(mediaQueryList.matches);

        // Attach the listener to the media query list
        mediaQueryList.addListener(handleChange);

        // Clean up the listener on unmount
        return () => mediaQueryList.removeListener(handleChange);
    }, [query]);

    return matches;
}

export default useMediaQuery;
