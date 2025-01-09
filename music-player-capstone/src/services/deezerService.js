import axios from "axios";

const searchTracks = async (query) => {
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };
  

export default searchTracks;