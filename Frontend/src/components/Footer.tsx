import {
  Box,
  Container,
  Text,
  Stack,
  Divider,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Footer = () => {
  const footerBg = useColorModeValue("gray.100", "gray.700");
  const footerColor = useColorModeValue("gray.700", "gray.100");
  const dividerColor = useColorModeValue("gray.300", "gray.600");
  return (
    <Box as="footer" bg={footerBg} color={footerColor} mt="auto" py={4}>
      <Container
        as={Stack}
        maxW={"6xl"}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        textAlign={{ base: "center", md: "center" }}
      >
        <VStack>
          <Text>
            © {new Date().getFullYear()} BookMaven. All rights reserved.
          </Text>
          <Text fontSize="sm">Powered by Vilnius University, ISE Students</Text>
        </VStack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={6}
          divider={
            <Divider orientation="horizontal" borderColor={dividerColor} />
          }
        >
          <Text fontWeight="bold">Saulė Jonynaitė</Text>
          <Text fontWeight="bold">Atėnė Kasperavičiūtė</Text>
          <Text fontWeight="bold">Airidas Žaliauskas</Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
