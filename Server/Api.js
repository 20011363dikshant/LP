import axios from 'axios';

export const fetchData = async (currentUser, setLeaveData, setCelebrations) => {
  const fetchLeaveData = async () => {
    try {
      if (currentUser && currentUser.id) {
        const response = await axios.get(`http://localhost:4000/api/leave-data/${currentUser.id}`);
        setLeaveData(response.data);
      } else {
        console.error('User is not authenticated or currentUser is not properly initialized.');
      }
    } catch (error) {
      console.error('Error fetching leave data:', error.message);
      alert('Failed to fetch leave data');
    }
  };

  const fetchCelebrations = async () => {
    try {
      if (currentUser && currentUser.id) {
        const response = await axios.get(`http://localhost:4000/api/celebrations/${currentUser.id}`);
        setCelebrations(response.data);
      } else {
        console.error('User is not authenticated or currentUser is not properly initialized.');
      }
    } catch (error) {
      console.error('Error fetching celebrations:', error.message);
      alert('Failed to fetch celebrations');
    }
  };

  useEffect(() => {
    fetchLeaveData();
    fetchCelebrations();
  }, [currentUser]);
};
