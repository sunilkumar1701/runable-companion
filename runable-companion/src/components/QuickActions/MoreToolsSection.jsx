import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Globe,
  Smartphone,
  Presentation,
  LineChart,
  Table2,
  GitBranch,
  Video,
  Image,
  AudioLines,
  LayoutTemplate,
} from 'lucide-react';
import { moreToolsCategories } from '../../data/demoData';

/**
 * Renders the expanded/collapsible More Tools section.
 * Matches Reference Images 3 (collapsed) and 4 (expanded).
 */
export default function MoreToolsSection({
  onBack,
  onSelectTool,
  onAction,
}) {
  // All three categories (Code, Productivity, Content Creation) open by default as in Reference Image 4
  const [expandedCategories, setExpandedCategories] = useState({
    code: true,
    productivity: true,
    'content-creation': true,
  });

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getToolIcon = (iconType, color) => {
    const props = { size: 20, strokeWidth: 1.8, style: { color } };
    switch (iconType) {
      case 'websites':
        return <Globe {...props} />;
      case 'apps':
        return <Smartphone {...props} />;
      case 'slides':
        return <Presentation {...props} />;
      case 'report':
        return <LineChart {...props} />;
      case 'sheets':
        return <Table2 {...props} />;
      case 'workflows':
        return <GitBranch {...props} />;
      case 'video':
        return <Video {...props} />;
      case 'image':
        return <Image {...props} />;
      case 'audio':
        return <AudioLines {...props} />;
      case 'carousels':
        return <LayoutTemplate {...props} />;
      default:
        return <Globe {...props} />;
    }
  };

  const handleTileClick = (item) => {
    if (onSelectTool) {
      onSelectTool(item);
    } else if (onAction) {
      onAction(`Tool selected: ${item.title} (Demo)`);
    }
  };

  return (
    <div className="more-tools-container" aria-label="More tools list">
      {/* Back button row to return to standard 4 quick action cards */}
      <div className="more-tools-header-bar">
        <button
          type="button"
          onClick={onBack}
          className="more-tools-back-btn"
          aria-label="Back to quick actions"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          <span>Quick actions</span>
        </button>
      </div>

      {/* Accordion Categories: Code, Productivity, Content Creation */}
      <div className="more-tools-categories-list">
        {moreToolsCategories.map((category) => {
          const isOpen = Boolean(expandedCategories[category.id]);
          return (
            <div key={category.id} className="more-tools-category-card">
              {/* Category Header Row (Reference Image 3 when collapsed, Image 4 when open) */}
              <button
                type="button"
                className="more-tools-category-header"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isOpen}
              >
                <span className="more-tools-category-title">{category.title}</span>
                <span className="more-tools-category-chevron">
                  {isOpen ? (
                    <ChevronDown size={18} strokeWidth={1.8} />
                  ) : (
                    <ChevronRight size={18} strokeWidth={1.8} />
                  )}
                </span>
              </button>

              {/* Category Grid Body (Reference Image 4) */}
              {isOpen && (
                <div
                  className={`more-tools-grid more-tools-grid--${category.columns}cols`}
                >
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="more-tools-tile"
                      onClick={() => handleTileClick(item)}
                      title={item.title}
                    >
                      <div className="more-tools-tile-icon">
                        {getToolIcon(item.iconType, item.color)}
                      </div>
                      <span className="more-tools-tile-label">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

