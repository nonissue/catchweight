import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// import { Moon, Sun } from "heroicons-react";
import {
  MoonSolid as Moon,
  SunSolid as Sun,
} from "@graywolfai/react-heroicons";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeToggle: React.FunctionComponent = (
  props: ColorModeSwitcherProps
) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(Sun, Moon);

  return (
    <IconButton
      size="sm"
      variant="ghost"
      color="current"
      marginX="1"
      onClick={toggleColorMode}
      icon={<SwitchIcon width="20px" height="20px" viewBox="0 0 20 20" />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
