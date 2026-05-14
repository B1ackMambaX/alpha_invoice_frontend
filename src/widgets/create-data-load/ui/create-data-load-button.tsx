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
        size="sm"
        colorPalette="brand"
        borderRadius="12px"
        py="8px"
        px="16px"
        fontSize="14px"
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
