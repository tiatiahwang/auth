import axios from 'axios';

export const requestToken = async (refreshToken) => {
  const option = {
    headers: {
      'Content-Type': 'application/json',
      'X-REFRESH-TOKEN': refreshToken,
    },
  };

  const response = await axios.post('/api/auth/refresh', option);
  return response;
};
