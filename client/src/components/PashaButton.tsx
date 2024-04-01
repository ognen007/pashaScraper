import { Button } from "@chakra-ui/react"

interface PashaButtonProps {
  label: string;
  onClick: any;
}

export const PashaButton: React.FC<PashaButtonProps> = ({
  label,
  onClick
}) => {
  return (
    <Button
      borderRadius={"3px 3px 4px 4px"}
      fontSize={"30px"}
      padding={"9px"}
      w={"370px"}
      background={"#801F2A"}
      border={"none"}
      color={"#fff"}
      style={{ cursor: "pointer" }}
      onClick={onClick}>
      {label}
    </Button>
  )
}