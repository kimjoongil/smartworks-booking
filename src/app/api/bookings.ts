import axios from "axios";

const API_ENDPOINT = "/api/bookings"; // 예를 들어서 정의한 엔드포인트. 실제 엔드포인트에 맞게 수정하세요.

export const getBookingByRoomId = async (roomId: string | number) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postBooking = async (data: any) => {
  try {
    const response = await axios.post(API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 필요에 따라 다른 API 함수들도 추가하세요.
