import { useOutsideClick } from '../../hooks/useOutsideClick';
import { menuItems } from '../../data/demoData';
import './MoreOptionsMenu.css';

/**
 * Floating more-options dropdown anchored below the ellipsis button.
 */
export default function MoreOptionsMenu({ onClose, onAction }) {
  const ref = useOutsideClick(onClose, true);

  function handleClick(item) {
    if (item.id === 'new-chat') {
      onAction('new-chat');
    } else {
      onAction('navigate', item.id);
    }
    onClose();
  }

  return (
    <div
      ref={ref}
      className="more-options-menu"
      role="menu"
      aria-label="More options"
    >
      {menuItems.map((item) => {
        if (item.type === 'divider') {
          return <div key={item.id} className="more-options-divider" role="separator" />;
        }

        const Icon = item.icon;
        return (
          <button
            key={item.id}
            role="menuitem"
            className="more-options-item"
            onClick={() => handleClick(item)}
          >
            <Icon size={18} strokeWidth={1.8} className="more-options-icon" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
