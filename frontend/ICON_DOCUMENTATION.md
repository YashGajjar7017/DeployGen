# Icon System Documentation

## Overview
The App Manager frontend uses a comprehensive icon system with multiple fallbacks to ensure icons are always visible, even offline.

## Icon Sources (Priority Order)
1. **lucide-react** (primary) - Modern, lightweight SVG icons
2. **Offline SVG Fallback** - Minimal set of essential icons for offline support
3. **Placeholder** - Gray boxes as last resort

## Available Icons

### Navigation
- `menu` - Hamburger menu icon
- `x` - Close/cancel icon
- `chevronDown` - Chevron pointing down
- `chevronUp` - Chevron pointing up
- `chevronLeft` - Chevron pointing left
- `chevronRight` - Chevron pointing right
- `home` - Home icon
- `settings` - Settings/gear icon
- `user` - User profile icon
- `logout` - Logout icon
- `login` - Login icon

### Actions
- `download` - Download icon (both lucide + offline)
- `upload` - Upload icon (both lucide + offline)
- `copy` - Copy to clipboard icon (both lucide + offline)
- `check` - Checkmark icon (both lucide + offline)
- `alert` - Alert/warning icon
- `delete` - Trash/delete icon
- `edit` - Edit/pencil icon
- `save` - Save icon
- `cancel` - Cancel icon

### Status
- `search` - Search/magnifying glass icon (both lucide + offline)
- `zap` - Lightning bolt/loading icon
- `mail` - Email icon
- `lock` - Lock icon
- `bell` - Notifications icon
- `shield` - Security/shield icon
- `eye` - Visible/open eye icon
- `eyeOff` - Hidden/closed eye icon

### Display
- `grid` - Grid layout icon
- `list` - List layout icon
- `chart` - Chart/analytics icon
- `clock` - Clock icon
- `calendar` - Calendar icon
- `time` - Time icon

### Social
- `github` - GitHub logo
- `linkedin` - LinkedIn logo
- `twitter` - Twitter logo
- `location` - Location/map icon

### App-Related
- `chrome` - Chrome browser icon
- `code` - Code icon
- `json` - JSON file icon
- `package` - Package icon
- `database` - Database icon
- `server` - Server icon
- `cpu` - CPU/processor icon
- `terminal` - Terminal/console icon
- `git` - Git icon
- `cloud` - Cloud icon
- `layers` - Layers icon

## Usage

### Basic Usage
```jsx
import { Icon } from '@/app/lib/icons';

export default function MyComponent() {
  return <Icon name="download" size={24} />;
}
```

### With Tailwind Classes
```jsx
<Icon name="settings" size={20} className="text-blue-600 hover:text-blue-700" />
```

### In Button
```jsx
<button className="flex items-center gap-2">
  <Icon name="download" size={18} />
  Download
</button>
```

### With Custom Styling
```jsx
<div className="p-2 bg-blue-100 rounded">
  <Icon name="check" size={32} className="text-green-600" />
</div>
```

## Icon Rendering Priority

1. **Lucide React** (0.263.1)
   - Full SVG support
   - Customizable size and color
   - Scalable to any size
   - Best for production

2. **Offline SVG Fallback**
   - Essential icons only
   - Pre-built SVG paths
   - Works without CDN
   - Used when lucide is unavailable

3. **Error Handling**
   - Gray placeholder if icon name not found
   - Red placeholder if rendering error occurs
   - Console warning for debugging

## Offline Icon Pack

The package includes a minimal offline icon pack for these essential icons:
- `download`
- `upload`
- `search`
- `settings`
- `home`
- `check`
- `copy`

These icons work even if CDN is unreachable or network is offline.

## Performance
- Icons are tree-shakeable with lucide-react
- Only imported icons are included in the bundle
- Offline SVGs add minimal file size (< 2KB)
- Icons are rendered as inline SVG (best performance)

## Troubleshooting

### Icons not showing
1. Check that `lucide-react` is installed: `npm list lucide-react`
2. Verify icon name matches the list above (case-sensitive)
3. Check browser console for errors
4. Try refreshing the page

### Icons look wrong
1. Verify `size` prop value (default 24)
2. Check Tailwind CSS is applied correctly
3. Try using a different icon to isolate the issue
4. Inspect element in browser dev tools

### Performance issues
1. Check if many icons are rendering simultaneously
2. Consider memoizing icon components
3. Use appropriate icon sizes (smaller = better)
4. Profile with React DevTools

## Adding New Icons

To add a new icon:

1. **Check if available in lucide-react**
   - See: https://lucide.dev

2. **Import in `frontend/app/lib/icons.js`**
   ```jsx
   import { NewIconName } from 'lucide-react';
   ```

3. **Add to `iconComponents` object**
   ```jsx
   newIcon: NewIconName,
   ```

4. **Update this documentation**

## Resources
- **Lucide Icons**: https://lucide.dev
- **Icon Pack Size**: ~263KB for full library
- **License**: ISC (Lucide React)

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ with proper SVG support
- Mobile browsers fully supported

## Version Info
- Lucide React: ^0.263.1
- Package Size: ~2.5MB (with tree-shaking ~50KB in production)
- Offline Icons: 6 essential icons
