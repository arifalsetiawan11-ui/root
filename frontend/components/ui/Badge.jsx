/**
 * Badge Component System
 * Inspired by GitHub's badge/label design system
 * 
 * Components:
 * - Badge:  Inline badge untuk di samping username (seperti GitHub's "Pro" badge)
 * - BadgeChip: Badge dengan background untuk lists/grids
 * - BadgeList: Container untuk multiple badges
 * - UsernameWithBadge: Username + primary badge combo
 */

/**
 * Badge - Inline badge yang tampil di samping username
 * Seperti badge "Pro", "Sponsor", "Member" di GitHub
 */
export function Badge({
  badge,
  size = "sm",
  showName = true,
  noBorder = false,
  className = "",
}) {
  if (!badge) return null;

  const badgeColor = badge.color || "#6366f1";

  // Ukuran yang proporsional untuk inline display
  const sizes = {
    xs: {
      height: "h-5",
      icon: "h-3.5 w-3.5",
      text: "text-xs",
      padding: "px-1.5",
      gap: "gap-1",
    },
    sm: {
      height: "h-6",
      icon: "h-4 w-4",
      text: "text-xs",
      padding: "px-2",
      gap: "gap-1.5",
    },
    md: {
      height: "h-7",
      icon: "h-[18px] w-[18px]",
      text: "text-sm",
      padding: "px-2.5",
      gap: "gap-1.5",
    },
    lg: {
      height: "h-8",
      icon: "h-5 w-5",
      text: "text-sm",
      padding: "px-3",
      gap: "gap-2",
    },
    xl: {
      height: "h-8",
      icon: "h-8 w-8",
      text: "text-sm",
      padding: "px-0",
      gap: "gap-0",
    },
  };

  const s = sizes[size] || sizes.sm;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${s.height} ${s.padding} ${s.gap}
        rounded-full
        font-medium leading-none
        ${noBorder ? "" : "border"}
        select-none
        ${s.text}
        ${className}
      `}
      style={{
        backgroundColor: noBorder ? "transparent" : `${badgeColor}15`,
        borderColor: `${badgeColor}40`,
        color: badgeColor,
      }}
      title={badge.description || badge.name}
    >
      {badge.icon_url && (
        <img
          src={badge.icon_url}
          alt=""
          className={`${s.icon} object-contain flex-shrink-0`}
          loading="lazy"
        />
      )}
      {showName && (
        <span className="truncate max-w-[100px]">{badge.name}</span>
      )}
    </span>
  );
}

/**
 * BadgeChip - Badge yang lebih besar untuk display di cards/lists
 * Seperti GitHub's label di issues
 */
export function BadgeChip({
  badge,
  onRemove,
  size = "md",
  interactive = true,
  className = "",
}) {
  if (!badge) return null;

  const badgeColor = badge.color || "#6366f1";

  const sizes = {
    sm: {
      icon: "h-4 w-4",
      padding: "px-2.5 py-1.5",
      text: "text-xs",
      gap: "gap-1.5",
    },
    md: {
      icon: "h-[18px] w-[18px]",
      padding: "px-3 py-2",
      text: "text-sm",
      gap: "gap-2",
    },
    lg: {
      icon: "h-5 w-5",
      padding: "px-3.5 py-2.5",
      text: "text-sm",
      gap: "gap-2",
    },
  };

  const s = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center 
        ${s.gap} ${s.padding} ${s.text}
        rounded-full
        font-medium
        border
        transition-colors duration-150
        ${interactive ? "hover:opacity-80" : ""}
        ${className}
      `}
      style={{
        backgroundColor: `${badgeColor}15`,
        borderColor: `${badgeColor}40`,
        color: badgeColor,
      }}
      title={badge.description || badge.name}
    >
      {badge.icon_url && (
        <img
          src={badge.icon_url}
          alt=""
          className={`${s.icon} object-contain flex-shrink-0`}
          loading="lazy"
        />
      )}
      <span>{badge.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded hover:bg-black/10 p-0.5 -mr-1 transition-colors"
          aria-label={`Remove ${badge.name}`}
        >
          <svg 
            className="h-3 w-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

/**
 * BadgeList - Container untuk multiple badges
 */
export function BadgeList({
  badges = [],
  maxDisplay = 5,
  size = "md",
  className = "",
}) {
  if (!badges || badges.length === 0) return null;

  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {displayBadges.map((badge, i) => (
        <BadgeChip 
          key={badge.ID || badge.id || i} 
          badge={badge} 
          size={size}
          interactive={false}
        />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center h-6 px-2 rounded-full text-xs font-medium bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]">
          +{remaining}
        </span>
      )}
    </div>
  );
}

/**
 * UsernameWithBadge - Kombinasi username dengan primary badge
 * Ini yang dipakai di thread headers, comments, dll
 */
export function UsernameWithBadge({
  username,
  primaryBadge,
  badgeSize = "sm",
  className = "",
  usernameClassName = "font-medium text-[rgb(var(--fg))]",
  showAt = true,
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={usernameClassName}>
        {showAt ?  "@" : ""}{username}
      </span>
      {primaryBadge && (
        <Badge badge={primaryBadge} size={badgeSize} />
      )}
    </span>
  );
}

/**
 * BadgeIcon - Hanya icon badge tanpa text (untuk space terbatas)
 */
export function BadgeIcon({
  badge,
  size = "sm",
  className = "",
}) {
  if (!badge) return null;

  const sizes = {
    xs: "h-5 w-5",
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-8 w-8",
  };

  const iconSize = sizes[size] || sizes.sm;

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      title={badge.name}
    >
      {badge.icon_url ? (
        <img
          src={badge.icon_url}
          alt={badge.name}
          className={`${iconSize} object-contain`}
          loading="lazy"
        />
      ) : (
        <span 
          className={`${iconSize} flex items-center justify-center rounded-full text-xs`}
          style={{ 
            backgroundColor: `${badge.color || "#6366f1"}20`,
            color: badge.color || "#6366f1"
          }}
        >
          ★
        </span>
      )}
    </span>
  );
}

export default Badge;
