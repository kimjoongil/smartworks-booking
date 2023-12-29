import { create } from "zustand";
import { SafeRoom, SafeUser } from "@/types";

interface RoomInfo {
  roomId: SafeRoom | null;
  currentUser?: SafeUser | null;
}

interface RoomBookingModalStore {
  isOpen: boolean;
  roomInfo: RoomInfo | null;
  //onOpen: () => void;
  onOpen: (currentUser: SafeUser, roomInfo: SafeRoom) => void;
  onClose: () => void;
}

const useRoomBookingModal = create<RoomBookingModalStore>((set) => ({
  isOpen: false,
  roomInfo: null,
  onOpen: (currentUser, roomId) =>
    set({
      isOpen: true,
      roomInfo: { currentUser, roomId },
    }),
  onClose: () =>
    set({
      isOpen: false,
      roomInfo: null,
    }),
}));

export default useRoomBookingModal;
