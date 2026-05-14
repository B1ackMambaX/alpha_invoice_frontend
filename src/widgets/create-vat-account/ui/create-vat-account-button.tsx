import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CreateVatAccountDrawer } from "./create-vat-account-drawer";

interface CreateVatAccountButtonProps {
  onSuccess: () => void;
}

export function CreateVatAccountButton({ onSuccess }: CreateVatAccountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" colorPalette="brand" borderRadius="12px" py="8px" px="16px" fontSize="14px" onClick={() => setIsOpen(true)}>
        Добавить счёт НДС
      </Button>
      <CreateVatAccountDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
