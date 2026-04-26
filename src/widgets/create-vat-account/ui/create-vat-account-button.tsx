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
      <Button colorPalette="brand" borderRadius="24px" onClick={() => setIsOpen(true)}>
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
