

interface ButtonProps {
  label: string; // 按鈕上顯示的文字
}

function Button({ label }: ButtonProps) {
  return (
    <>
      <button
        className="
          bg-emerald-300
          font-semibold
          text-2xl
          text-black
          px-6 
          py-2
          rounded-full
          hover:bg-gray-800
          hover:text-white
          transition
          duration-200
        "
      >
        {label}
      </button>
      
    </>
  );
}

export default Button;
