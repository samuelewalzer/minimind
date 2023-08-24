function FilterButton(props: {
  isPressed: boolean;
  setFilter: (name: string) => void;
  name: string;
}) {
  function handleClick() {
    props.setFilter(props.name);
  }

  return (
    <button
      type="button"
      className="btn filter"
      aria-pressed={props.isPressed}
      onClick={handleClick}
    >
      <span>{props.name}</span>
    </button>
  );
}

export default FilterButton;
