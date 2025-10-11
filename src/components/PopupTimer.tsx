import { useEffect, useState } from "react";
import { ReceptionistModal } from "./ReceptionistModal";

export const PopupTimer = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  return <ReceptionistModal open={showModal} onOpenChange={setShowModal} />;
};
