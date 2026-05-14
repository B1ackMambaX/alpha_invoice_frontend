import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CreateResponsibleDrawer } from "./create-responsible-drawer";

interface CreateResponsibleButtonProps {
  onSuccess: () => void;
}

export function CreateResponsibleButton({ onSuccess }: CreateResponsibleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" colorPalette="brand" borderRadius="12px" py="8px" px="16px" fontSize="14px" onClick={() => setIsOpen(true)}>
        Добавить ответственного
      </Button>
      <CreateResponsibleDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
