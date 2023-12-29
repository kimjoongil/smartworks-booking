import { create } from "zustand";

interface RoomReserveEditModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRoomReserveEditModal = create<RoomReserveEditModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRoomReserveEditModal;
