import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CreateDataLoadDrawer } from "./create-data-load-drawer";

interface CreateDataLoadButtonProps {
  onSuccess: () => void;
}

export function CreateDataLoadButton({ onSuccess }: CreateDataLoadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        colorPalette="brand"
        borderRadius="24px"
        onClick={() => setIsOpen(true)}
      >
        Загрузить из АБС
      </Button>
      <CreateDataLoadDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
