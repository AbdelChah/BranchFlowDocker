import { Button } from "@/components/ui/button";

export default function LoadingButton({ isLoading, handleClick, buttonText }: { isLoading: boolean, handleClick: () => void, buttonText: string }) {
  return (
    <Button
      className={`relative w-full py-2 px-4 rounded-md text-white text-lg font-semibold ${
        isLoading
          ? "bg-white text-gray-900"
          : "bg-purple-600 hover:bg-purple-700 focus:bg-purple-700"
      } ${isLoading ? "waves-animation" : ""}`} // Add waves class when loading
      onClick={handleClick}
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>{buttonText}</span>
      )}
    </Button>
  );
}


// CSS-in-JS for Tailwind (Add this to your CSS or global styles)
const css = `
.waves-animation {
  background-color: white;
  position: relative;
  overflow: hidden;
}

.waves-animation::before {
  position: absolute;
  content: '';
  width: calc(100% + 30px);
  height: calc(100% + 30px);
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%) scale(.7);
  filter: blur(0);
  opacity: 1;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
  background-image: 
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23ffffff' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23ffffff' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23ffffff' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23ffffff' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23ffffff' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23ffffff' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e");
  background-repeat: repeat-x;
  background-size: 1600px 50%;
  background-position: 0 130%, -50px 130%, 500px 130%;
  animation: 20s waves linear infinite forwards;
}

@keyframes waves {
  to {
    background-position: 1600px 130%, 3150px 130%, 5300px 130%;
  }
}
`;


