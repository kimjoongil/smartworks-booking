import { create } from "zustand";

interface RoomReserveModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRoomReserveModal = create<RoomReserveModalStore> ((set)=>({
  isOpen:false,
  onOpen: ()=>set({isOpen:true}),
  onClose: ()=>set({isOpen:false}),
}));

export default useRoomReserveModal;
