import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CreateBranchDrawer } from "./create-branch-drawer";

interface CreateBranchButtonProps {
  onSuccess: () => void;
}

export function CreateBranchButton({ onSuccess }: CreateBranchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" colorPalette="brand" borderRadius="12px" py="8px" px="16px" fontSize="14px" onClick={() => setIsOpen(true)}>
        Добавить отделение
      </Button>
      <CreateBranchDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
