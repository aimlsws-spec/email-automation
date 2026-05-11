import PropTypes from "prop-types";

export function CreditCard({ balance, image, number }) {
  return (
    <div className="relative h-40 w-64 shrink-0 rounded-lg bg-linear-to-br from-[#ffffff55] to-[#ffffff20]">
      <div className="absolute inset-0 flex flex-col justify-between rounded-lg border border-white/10 p-5">
        <div className="flex items-center justify-between">
          <img className="h-3" src={image} alt="creditcard" />
          <ChipIcon className="size-5 text-white/80" />
        </div>

        <div className="text-white">
          <p className="text-lg font-semibold tracking-wide">{balance}</p>
          <p className="mt-1 text-xs font-medium">{number}</p>
        </div>
      </div>
    </div>
  );
}

function ChipIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.343 7.257a.5.5 0 01.354.147 6.5 6.5 0 010 9.192.64.64 0 00-.073.087 4.718 4.718 0 01-.56-.094 1.301 1.301 0 01-.109-.03.5.5 0 01.035-.67 5.5 5.5 0 000-7.778.5.5 0 01.353-.854zm-.422 9.288a.06.06 0 010 0zM15 1.6a.5.5 0 01.354.147 14.5 14.5 0 010 20.506.5.5 0 11-.708-.707 13.5 13.5 0 000-19.092A.5.5 0 0115 1.6zM10.172 4.43a.5.5 0 01.353.146 10.5 10.5 0 010 14.85.5.5 0 11-.707-.707 9.5 9.5 0 000-13.436.5.5 0 01.354-.853z"
      />
    </svg>
  );
}

CreditCard.propTypes = {
  balance: PropTypes.string,
  image: PropTypes.string,
  number: PropTypes.string,
};
