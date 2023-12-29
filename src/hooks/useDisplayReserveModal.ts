import { create } from "zustand";

interface DisplayReserveModalStore {  
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDisplayReserveModal = create<DisplayReserveModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useDisplayReserveModal;
