import React from 'react';

interface TagPillProps {
  content: string;
  icon?: React.ReactNode;
}

const TagPill = ({ content, icon }: TagPillProps) => {
  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-fainter text-brand-default text-sm break-all">
      <div className="flex items-center min-w-0">
        {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
        <span className="truncate">{content}</span>
      </div>
    </div>
  );
};

export default TagPill;