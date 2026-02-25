# SmileCare — Premium Luxury Dental Brand System

## Brand Identity

SmileCare represents a high-end dental experience defined by:

• Elegance
• Calm authority
• Spacious layout
• Subtle premium accents
• Clinical trust

The interface must feel refined and confident — never playful, loud, or trendy.

## 🎨 Color System (PERMANENTLY LOCKED)

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| Primary | `#165b9c` | Primary CTAs, links |
| Accent Gold | `#c5a059` | Thin accents, dividers, icons, highlights |
| Background Light | `#f6f7f8` | Page background |
| Background Dark | `#111921` | Footer only |
| Pearl | `#fcfcfd` | Elevated cards |
| Navy Deep | `#0a1e35` | Headings |

### Color Usage Hierarchy

- **Primary** → Primary CTAs, links
- **Accent Gold** → Thin accents, dividers, icons, highlights
- **Navy Deep** → Headings
- **Pearl** → Elevated cards
- **Background Light** → Page background
- **Background Dark** → Footer only

> [!IMPORTANT]
> Gold must remain subtle. Never use gold for large background areas.
> No additional colors allowed without approval.

## ✍️ Typography System (LOCKED)

### Font Families:
- **Headings** → Noto Serif
- **Body** → Noto Sans

### Heading Scale
- **H1** → `text-5xl md:text-6xl font-display font-semibold`
- **H2** → `text-4xl font-display font-semibold`
- **H3** → `text-2xl font-semibold`

- **Body** → `text-base leading-relaxed`
- **Small** → `text-sm text-gray-600`

> [!NOTE]
> Headings must have generous spacing. Body text must feel breathable.
> No other font families allowed.

## 🧱 Layout Philosophy
• Generous whitespace
• Section spacing → `py-20`
• Max container width → `max-w-6xl`
• Horizontal padding → `px-6`
• Avoid clutter
• No dense layouts

Luxury is defined by space.

## 🔲 Radius System (LOCKED)
- **DEFAULT** → `rounded` (0.5rem)
- **lg** → `rounded-lg` (1rem)
- **xl** → `rounded-xl` (1.5rem)
- **full** → `rounded-full`

> [!IMPORTANT]
> Cards must use `rounded-xl`.

## ✨ Shadow System (LOCKED)
Allowed:
- `shadow-sm`
- `shadow-md`

No heavy drop shadows. No dramatic depth effects.

## 🎞 Motion System (Moderate Luxury)
Motion must be elegant and restrained.

### Allowed Animations:
• Fade-in on scroll
• Subtle lift on hover (`translate-y -1`)
• Button scale hover (`scale 1.02` max)
• Smooth transitions (`duration-200 / 300`)

### Do NOT use:
• Bounce
• Elastic
• Dramatic slide-ins
• Parallax
• Over-animated elements

Animation philosophy: calm and refined.

## 📱 Responsiveness Standard (MANDATORY)
All pages must:
• Work from 320px → 1440px
• Be mobile-first
• Avoid overflow
• Avoid layout shifts
• Maintain consistent spacing

### Breakpoints:
- `sm` → 640px
- `md` → 768px
- `lg` → 1024px
- `xl` → 1280px

Typography must scale properly at `md+`.

## 🚫 Strict Restrictions
Do NOT:
• Add random hex colors
• Add gradients without approval
• Use inline style color values
• Add decorative icons excessively
• Use cartoon or playful UI
• Break spacing system

All styles must reference Tailwind theme tokens.
