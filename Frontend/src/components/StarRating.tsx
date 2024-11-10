import { Icon } from "@chakra-ui/react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

interface Props {
  rating: number;
}

const StarRating = ({ rating }: Props) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Icon as={BsStarFill} color="yellow.400" key={i} />
        ))}
      {halfStar === 1 && <Icon as={BsStarHalf} color="yellow.400" />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Icon as={BsStar} color="gray.300" key={i} />
        ))}
    </>
  );
};

export default StarRating;
