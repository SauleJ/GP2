import {
  Box,
  HStack,
  Skeleton,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const RecommendationSkeleton = () => {
  const RecommendationHover = useColorModeValue("gray.50", "gray.700");
  return (
    <Box as="section" py={4}>
      <VStack spacing={4} align="stretch">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: RecommendationHover }}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Skeleton boxSize={{ base: "75px", md: "100px" }} mr={4} />
            <VStack flex="1" spacing={4}>
              <Skeleton height="20px" w="full" />
              <Skeleton height="15px" w="full" />
              <HStack spacing={4} w="full">
                <Skeleton height="10px" w="50px" />
                <Skeleton height="10px" w="80px" />
              </HStack>
              <HStack spacing={2}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} height="20px" w="70px" />
                ))}
              </HStack>
            </VStack>
            <Skeleton
              ml="50px"
              height="30px"
              w="75px"
              alignSelf={{ base: "flex-start", md: "center" }}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default RecommendationSkeleton;
