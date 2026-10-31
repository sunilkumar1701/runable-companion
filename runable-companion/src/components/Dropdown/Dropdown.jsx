import { useOutsideClick } from '../../hooks/useOutsideClick';
import './Dropdown.css';

/**
 * Reusable dropdown menu component.
 * @param {Object} props
 * @param {Array} props.options - Array of { id, label, default? }
 * @param {string} props.selected - Currently selected option id
 * @param {Function} props.onSelect - Called with selected option id
 * @param {Function} props.onClose - Called to close the dropdown
 * @param {string} [props.className] - Additional class names
 */
export default function Dropdown({ options, selected, onSelect, onClose, className = '' }) {
  const ref = useOutsideClick(onClose, true);

  return (
    <div
      ref={ref}
      className={`dropdown-container ${className}`}
      role="listbox"
      aria-label="Select option"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          role="option"
          aria-selected={selected === opt.id}
          className={`dropdown-item ${selected === opt.id ? 'dropdown-item--active' : ''}`}
          onClick={() => {
            onSelect(opt.id);
            onClose();
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

