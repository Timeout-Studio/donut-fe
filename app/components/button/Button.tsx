

interface ButtonProps {
  label: string; // 按鈕上顯示的文字
}

function Button({ label }: ButtonProps) {
  return (
    <>
      <button
        className="
          bg-donut-bg-2
          font-semibold
          text-2xl
          text-donut-text-white
          px-6 
          py-2
          rounded-full
          hover:bg-donut-sec
          hover:text-donut-bg
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
