export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-lg font-semibold text-neutral-300">
        {title}
      </div>

      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}
