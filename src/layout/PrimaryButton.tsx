import { Button } from "rsuite";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type PrimaryButtonProps = {
  disabled?: boolean;
  bg?: string;
  icon?: ReactNode;
  text: string;
  url?: string;
  click?: () => void;
};

export function PrimaryButton({
  disabled = false,
  text,
  bg,
  icon,
  url,
  click,
}: PrimaryButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      disabled={disabled}
      appearance="primary"
      style={{ backgroundColor: bg }}
      startIcon={icon}
      className="w-full"
      onClick={() => (url ? navigate("/" + url) : click)}
    >
      {text}
    </Button>
  );
}
