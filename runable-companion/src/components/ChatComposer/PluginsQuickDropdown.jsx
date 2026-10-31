import { useState } from 'react';
import {
  Search,
  Globe,
  Users,
  Building2,
  Store,
  AtSign,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { pluginQuickCategories } from '../../data/demoData';

/**
 * Dropdown menu for browsing and connecting plugins directly beneath composer.
 * Matches Reference Image 2.
 */
export default function PluginsQuickDropdown({
  onSelectCategory,
  onConnectPlugins,
  onClose,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Live filter categories by search term
  const filteredCategories = pluginQuickCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'website':
        return <Globe size={14} strokeWidth={2} />;
      case 'people':
        return <Users size={14} strokeWidth={2} />;
      case 'company':
        return <Building2 size={14} strokeWidth={2} />;
      case 'smb':
        return <Store size={14} strokeWidth={2} />;
      case 'social':
        return <AtSign size={14} strokeWidth={2} />;
      case 'ecommerce':
        return <Truck size={14} strokeWidth={2} />;
      default:
        return <Globe size={14} strokeWidth={2} />;
    }
  };

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    if (onClose) onClose();
  };

  const handleConnectClick = () => {
    if (onConnectPlugins) {
      onConnectPlugins();
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="plugins-quick-dropdown"
      role="menu"
      aria-label="Plugins quick menu"
    >
      {/* Search Bar matching Reference Image 2 */}
      <div className="plugins-quick-search-wrap">
        <Search size={14} strokeWidth={2} className="plugins-quick-search-icon" />
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plugins"
          className="plugins-quick-search-input"
        />
      </div>

      {/* Section Subheader */}
      <div className="plugins-quick-section-header">
        No plugins connected yet
      </div>

      {/* Scrollable Categories List */}
      <div className="plugins-quick-list">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="plugins-quick-item"
              onClick={() => handleCategoryClick(cat)}
            >
              <div
                className="plugins-quick-item-badge"
                style={{
                  backgroundColor: cat.badgeBg,
                  color: cat.badgeColor,
                }}
              >
                {getCategoryIcon(cat.iconType)}
              </div>
              <span className="plugins-quick-item-name">{cat.name}</span>
            </button>
          ))
        ) : (
          <div className="plugins-quick-empty">
            No plugins match "{searchQuery}"
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="plugins-quick-divider" />

      {/* Bottom Connect Plugins Action */}
      <button
        type="button"
        className="plugins-quick-connect-btn"
        onClick={handleConnectClick}
      >
        <div className="plugins-quick-connect-left">
          <AtSign size={14} strokeWidth={2} className="plugins-quick-connect-icon" />
          <span>Connect plugins</span>
        </div>
        <ChevronRight size={14} strokeWidth={2} className="plugins-quick-connect-chevron" />
      </button>
    </div>
  );
}

