# 🎨 Glass Components API Reference

## Overview

Complete reference for the glassmorphic component library included with DeployGen.

---

## GlassCard

Premium glass container with blur effect and transparency.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Card content |
| `className` | string | `''` | Additional CSS classes |
| `variant` | 'default' \| 'light' \| 'dark' \| 'primary' | `'default'` | Color variant |
| `hover` | boolean | `true` | Enable hover effect |
| `...props` | any | - | HTML div props |

### Variants

- `default`: rgba(255, 255, 255, 0.2)
- `light`: rgba(255, 255, 255, 0.4)
- `dark`: rgba(0, 0, 0, 0.1)
- `primary`: rgba(59, 130, 246, 0.2)

### Example

```jsx
import { GlassCard } from '@/app/components/GlassComponents';

<GlassCard variant="primary" hover className="p-8">
  <h2>Welcome</h2>
  <p>This card has a premium glass effect</p>
</GlassCard>
```

---

## GlassButton

Glassmorphic button with smooth interactions.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Button content |
| `className` | string | `''` | Additional CSS classes |
| `variant` | 'primary' \| 'secondary' \| 'accent' \| 'danger' | `'primary'` | Button style |
| `size` | 'sm' \| 'md' \| 'lg' | `'md'` | Button size |
| `...props` | any | - | HTML button props |

### Variants

- `primary`: Blue with dominant presence
- `secondary`: White/translucent
- `accent`: Cyan for highlights
- `danger`: Red for destructive actions

### Sizes

- `sm`: px-3 py-1.5 text-sm
- `md`: px-4 py-2 text-base
- `lg`: px-6 py-3 text-lg

### Example

```jsx
import { GlassButton } from '@/app/components/GlassComponents';

<GlassButton variant="primary" size="lg" onClick={handleClick}>
  <Sparkles size={20} />
  Get Started
</GlassButton>
```

---

## GlassInput

Glassmorphic input field with focus effects.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | `''` | Input placeholder |
| `className` | string | `''` | Additional CSS classes |
| `...props` | any | - | HTML input props |

### Features

- Automatic backdrop blur
- Focus ring effect
- Smooth transitions
- Dark mode support

### Example

```jsx
import { GlassInput } from '@/app/components/GlassComponents';

<GlassInput
  placeholder="Search apps..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

---

## GlassContainer

Full-width container with glass background.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Container content |
| `className` | string | `''` | Additional CSS classes |
| `blur` | 'blur-sm' \| 'blur-md' \| 'blur-lg' | `'blur-md'` | Blur intensity |
| `...props` | any | - | HTML div props |

### Blur Intensities

- `blur-sm`: 10px blur
- `blur-md`: 12px blur
- `blur-lg`: 16px blur

### Example

```jsx
import { GlassContainer } from '@/app/components/GlassComponents';

<GlassContainer blur="blur-lg" className="p-8 m-4">
  Main content area
</GlassContainer>
```

---

## GlassBadge

Small glassmorphic badge for labels.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Badge text |
| `className` | string | `''` | Additional CSS classes |
| `variant` | 'default' \| 'success' \| 'warning' \| 'error' \| 'info' | `'default'` | Badge color |
| `...props` | any | - | HTML span props |

### Variants

- `default`: Blue badge
- `success`: Green badge
- `warning`: Yellow badge
- `error`: Red badge
- `info`: Cyan badge

### Example

```jsx
import { GlassBadge } from '@/app/components/GlassComponents';

<div className="space-x-2">
  <GlassBadge>Active</GlassBadge>
  <GlassBadge variant="success">Verified</GlassBadge>
  <GlassBadge variant="warning">Pending</GlassBadge>
  <GlassBadge variant="error">Failed</GlassBadge>
</div>
```

---

## GlassPanel

Large panel with glass effect for sections.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Panel content |
| `title` | string | - | Panel title |
| `subtitle` | string | - | Panel subtitle |
| `className` | string | `''` | Additional CSS classes |
| `...props` | any | - | HTML div props |

### Features

- Automatic gradient title text
- Subtitle support
- Built-in spacing
- Glass container wrapper

### Example

```jsx
import { GlassPanel } from '@/app/components/GlassComponents';

<GlassPanel title="Settings" subtitle="Manage your preferences">
  <div className="space-y-4">
    <label>
      <input type="checkbox" /> Enable notifications
    </label>
    <label>
      <input type="checkbox" /> Dark mode
    </label>
  </div>
</GlassPanel>
```

---

## GlassModal

Modal with glassmorphic background overlay.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Modal visibility |
| `onClose` | function | - | Close handler |
| `title` | string | - | Modal title |
| `children` | ReactNode | - | Modal content |
| `className` | string | `''` | Container CSS classes |
| `...props` | any | - | HTML div props |

### Features

- Backdrop blur overlay
- Click-to-close backdrop
- Close button
- Keyboard support (Esc)
- Smooth animations

### Example

```jsx
import { GlassModal } from '@/app/components/GlassComponents';
import { useState } from 'react';

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <GlassModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure?</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={() => setIsOpen(false)}>Confirm</button>
        </div>
      </GlassModal>
    </>
  );
}
```

---

## CSS Utilities

### Glass Effects

Use these classes for custom glass styling:

```jsx
<div className="glass-bg">Basic glass effect</div>
<div className="glass-frosted">Frosted glass</div>
<div className="glass-deep">Deep glass effect</div>
<div className="glass-hover">Hover glass effect</div>
```

### Glow Effects

```jsx
<div className="glow-ring">Glowing ring</div>
<div className="animate-glow">Glowing animation</div>
```

### Text Effects

```jsx
<h1 className="gradient-text">Gradient text</h1>
<h1 className="gradient-text gradient-animated">Animated gradient</h1>
<span className="text-glow">Glowing text</span>
```

### Animations

```jsx
<div className="animate-fadeIn">Fade in</div>
<div className="animate-slideIn">Slide in</div>
<div className="animate-float">Float</div>
<div className="animate-pulse-glow">Pulse & glow</div>
```

---

## Tailwind Configuration

Custom theme extensions in `tailwind.config.js`:

```javascript
colors: {
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(0, 0, 0, 0.25)',
  },
},
backdropFilter: {
  'none': 'none',
  'blur': 'blur(10px)',
  'blur-md': 'blur(12px)',
  'blur-lg': 'blur(16px)',
},
boxShadow: {
  'glass-sm': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
  'glow': '0 0 30px rgba(59, 130, 246, 0.3)',
  'glow-lg': '0 0 50px rgba(59, 130, 246, 0.5)',
},
backgroundImage: {
  'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
},
```

---

## Best Practices

### 1. Always Use Proper Spacing

```jsx
// Good - padding inside glass
<GlassCard className="p-6">
  Content
</GlassCard>

// Avoid - no padding
<GlassCard>
  Content
</GlassCard>
```

### 2. Combine Components

```jsx
// Good - layered components
<GlassContainer>
  <GlassPanel title="Features">
    <GlassCard>
      <GlassButton>Submit</GlassButton>
    </GlassCard>
  </GlassPanel>
</GlassContainer>
```

### 3. Use Variants Appropriately

```jsx
// Primary for main CTAs
<GlassButton variant="primary">Save</GlassButton>

// Secondary for less important actions
<GlassButton variant="secondary">Cancel</GlassButton>

// Danger for destructive actions
<GlassButton variant="danger">Delete</GlassButton>
```

### 4. Mobile Responsiveness

```jsx
<GlassCard className="p-4 md:p-8">
  <h2 className="text-lg md:text-2xl">Responsive</h2>
</GlassCard>
```

### 5. Dark Mode Support

All components automatically support dark mode via `dark:` prefix in Tailwind.

---

## Performance Tips

1. **Use memoization** for frequently rendered glass components
2. **Lazy load** glass modals to keep initial bundle small
3. **Cache** component instances in zustand store
4. **Avoid nested blur effects** (impacts performance)

---

## Accessibility

All components include:
- Proper semantic HTML
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast focus states
- Color-independent indicators

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 76+ | ✅ Full | backdrop-filter supported |
| Safari 15+ | ✅ Full | backdrop-filter supported |
| Firefox 103+ | ✅ Full | backdrop-filter supported |
| Edge 79+ | ✅ Full | Chromium-based |

---

## Examples Gallery

### Card Grid

```jsx
<div className="grid grid-cols-3 gap-4">
  {items.map(item => (
    <GlassCard key={item.id} hover>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </GlassCard>
  ))}
</div>
```

### Feature Showcase

```jsx
<GlassPanel title="Features" subtitle="What we offer">
  <div className="space-y-4">
    {features.map(feature => (
      <div key={feature.id} className="flex gap-4">
        <div className="glow-ring p-3 rounded-lg">
          <feature.icon />
        </div>
        <div>
          <h4>{feature.name}</h4>
          <p>{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
</GlassPanel>
```

### Search Form

```jsx
<GlassContainer className="p-6 space-y-4">
  <GlassInput placeholder="Search..." />
  <GlassButton variant="primary" className="w-full">
    Search
  </GlassButton>
</GlassContainer>
```

---

For more examples, check the [QUICK_START.md](QUICK_START.md) file!
