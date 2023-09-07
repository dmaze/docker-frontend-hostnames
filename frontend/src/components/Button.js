const Button = ({ onClick, children }) => (
  <button className="px-4 py-1 rounded-full border" onClick={onClick}>
    {children}
  </button>
);

export default Button;
