import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface RatingPromptProps {
  onRatingSubmit: (rating: string) => void;
}

const RatingPrompt = ({ onRatingSubmit }: RatingPromptProps) => {
  const [rating, setRating] = useState("");

  const getRatingEmoji = (value: number) => {
    if (value <= 2) return "😢";
    if (value <= 4) return "😟";
    if (value <= 6) return "😐";
    if (value <= 8) return "🙂";
    return "😊";
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 flex justify-between px-2">
        <span>1 = Feeling very low</span>
        <span>10 = Feeling great</span>
      </div>
      <RadioGroup
        value={rating}
        onValueChange={setRating}
        className="grid grid-cols-5 gap-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <div key={value} className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={value.toString()} id={`r${value}`} />
              <label htmlFor={`r${value}`} className="flex flex-col items-center">
                <span>{value}</span>
                <span className="text-xl">{getRatingEmoji(value)}</span>
              </label>
            </div>
          </div>
        ))}
      </RadioGroup>
      <div className="flex justify-end">
        <Button 
          onClick={() => rating && onRatingSubmit(rating)}
          disabled={!rating}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RatingPrompt;