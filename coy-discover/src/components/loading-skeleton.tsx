export function DiscoverSkeleton() {
  return (
    <div aria-label="Loading profiles" className="skeleton-card" role="status">
      <div className="skeleton-photo" />
      <div className="skeleton-lines">
        <span className="skeleton-line skeleton-line-short" />
        <span className="skeleton-line" />
        <span className="skeleton-line skeleton-line-mid" />
      </div>
    </div>
  );
}

export function MatchesSkeleton() {
  return (
    <div aria-label="Loading matches" className="matches-grid" role="status">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="match-skeleton" key={index}>
          <div className="skeleton-photo" />
          <div className="skeleton-lines">
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-line-short" />
          </div>
        </div>
      ))}
    </div>
  );
}
