import { Input } from "@chakra-ui/react"

interface PashaInputProps {
  state: any;
  setState: any;
  placeholder: any
}

export const PashaInput: React.FC<PashaInputProps> = ({
  state,
  setState,
  placeholder
}) => {
  return (
    <Input
      padding={"9px"}
      w={"370px"}
      fontSize={"30px"}
      placeholder={placeholder}
      size='lg'
      value={state}
      onChange={(e) => setState(e.target.value)} />
  )
}