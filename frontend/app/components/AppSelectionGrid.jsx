/**
 * App Selection Grid Component
 * Displays apps in a responsive grid with selection
 */

'use client';

import AppCard from './AppCard';
import useAppStore from '@/app/lib/appStore';

export default function AppSelectionGrid() {
  const { filteredApps, selectedApps, toggleApp } = useAppStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredApps.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          isSelected={selectedApps.includes(app.id)}
          onToggle={() => toggleApp(app.id)}
        />
      ))}
    </div>
  );
}
