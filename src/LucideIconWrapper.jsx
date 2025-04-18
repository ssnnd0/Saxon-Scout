import React, { memo } from 'react';

/**
 * A wrapper for Lucide icons to avoid issues with loading in development
 * This helps prevent issues with ad blockers and tree-shaking in dev mode
 */
const LucideIconWrapper = ({ icon: Icon, ...props }) => {
  if (!Icon) return null;
  
  return <Icon {...props} />;
};

export default memo(LucideIconWrapper); 