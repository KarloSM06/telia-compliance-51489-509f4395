import { useEffect, useState } from "react";
import { ReceptionistModal } from "./ReceptionistModal";

const POPUP_DELAY = 30000; // 30 seconds
const POPUP_SHOWN_KEY = "receptionist_popup_shown";

export const PopupTimer = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this session
    const hasShown = sessionStorage.getItem(POPUP_SHOWN_KEY);
    if (hasShown) return;

    // Set timer to show popup after 30 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return <ReceptionistModal open={showModal} onOpenChange={setShowModal} />;
};
