import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query; // Get the artist's name from the query parameter (?q=Pompi)

  // If no query is provided, return an error
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    // Fetch data from Deezer API
    const response = await axios.get(`https://api.deezer.com/search`, {
      params: { q }, // Pass the artist name as a query parameter
    });

    // Return the data to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from Deezer API:', error.message);

    // Handle errors (e.g., network issues or invalid responses)
    return res.status(500).json({ error: 'Failed to fetch data from Deezer API' });
  }
}
