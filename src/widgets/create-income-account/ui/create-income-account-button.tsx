import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CreateIncomeAccountDrawer } from "./create-income-account-drawer";

interface CreateIncomeAccountButtonProps {
  onSuccess: () => void;
}

export function CreateIncomeAccountButton({ onSuccess }: CreateIncomeAccountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" colorPalette="brand" borderRadius="12px" py="8px" px="16px" fontSize="14px" onClick={() => setIsOpen(true)}>
        Добавить счёт доходов
      </Button>
      <CreateIncomeAccountDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
