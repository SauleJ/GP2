import { IconButton, useColorMode } from "@chakra-ui/react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="ghost"
      onClick={toggleColorMode}
      icon={
        colorMode === "dark" ? (
          <BsMoonFill size={24} />
        ) : (
          <BsSunFill size={28} />
        )
      }
    />
  );
};

export default ColorModeSwitch;
