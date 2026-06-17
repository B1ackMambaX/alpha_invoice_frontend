import { IconButton } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";

type RefetchButtonProps = {
  onClick: () => void;
  isFetching?: boolean;
};

export const RefetchButton = ({ onClick, isFetching }: RefetchButtonProps) => (
  <IconButton
    aria-label="Обновить таблицу"
    variant="outline"
    loading={isFetching}
    onClick={onClick}
  >
    <LuRefreshCw />
  </IconButton>
);
