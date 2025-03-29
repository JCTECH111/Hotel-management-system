import { StarIcon } from "@heroicons/react/24/solid";

const ReviewItem = ({ review }) => {
  return (
    <div className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-start space-x-4">
        <img
          src={review.profileImg || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold">Guest #{review.guest_id}</p>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;