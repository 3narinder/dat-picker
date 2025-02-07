interface ButtonProps {
  bg: string;
  text: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Button = ({ bg, text, setIsShow }: ButtonProps) => {
  return (
    <button
      onClick={() => setIsShow((prev) => !prev)}
      className={`${bg} tracking-wide text-white w-full px-8 py-2 rounded-full text-sm font-semibold cursor-pointer hover:opacity-80 transition ease-in-out`}
    >
      {text}
    </button>
  );
};

export default Button;
