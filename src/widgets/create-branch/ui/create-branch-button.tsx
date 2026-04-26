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
      <Button colorPalette="brand" borderRadius="24px" onClick={() => setIsOpen(true)}>
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
