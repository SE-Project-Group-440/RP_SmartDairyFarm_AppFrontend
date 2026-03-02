# Multi-Language Implementation Guide

## Overview
This document explains how the multi-language translation system works and how to extend it to other screens in your application.

## Architecture

### Three Main Components:

1. **Language Store** (`Store/language.store.ts`)
   - Manages language state using Zustand
   - Persists language preference to AsyncStorage
   - Provides `setLanguage()` and `hydrate()` methods

2. **Translations JSON** (`constants/translations.json`)
   - Contains translations for English, Sinhala, and Tamil
   - Organized by sections (profile, dashboard, cowList, addCow, milkEntry, alerts, history, etc.)
   - Easy to add new languages and sections

3. **useTranslations Hook** (`hooks/useTranslations.ts`)
   - Custom React hook to access translations
   - Usage: `const { t, language } = useTranslations()`
   - `t(section, key)` returns the translated string

## How It Works

### Step 1: Import the hook
```tsx
import { useTranslations } from "@/hooks/useTranslations";
```

### Step 2: Use in component
```tsx
export function MyScreen() {
  const { t } = useTranslations();
  
  return (
    <View>
      <Text>{t('profile', 'logout')}</Text>
    </View>
  );
}
```

### Step 3: Add translations to JSON
```json
{
  "english": {
    "mySection": {
      "myKey": "My English Text"
    }
  },
  "sinhala": {
    "mySection": {
      "myKey": "මගේ සිංහල පෙළ"
    }
  },
  "tamil": {
    "mySection": {
      "myKey": "என்னுடைய தமிழ் உரை"
    }
  }
}
```

## Scaling to Other Screens

### 1. Create a new section in translations.json
Add a new section for your screen with all its labels:

```json
{
  "english": {
    "myNewScreen": {
      "header": "My Header",
      "button": "Click Me",
      "title": "My Title"
    }
  },
  "sinhala": {
    "myNewScreen": {
      "header": "මගේ ශීර්ෂකය",
      "button": "මට ඔබන්න",
      "title": "මගේ මාතෘකාව"
    }
  },
  "tamil": {
    "myNewScreen": {
      "header": "என்னுடைய தலைப்பு",
      "button": "என்னை கிளிக் செய்யுங்கள்",
      "title": "என்னுடைய பொருள்"
    }
  }
}
```

### 2. Import and use the hook in your screen
```tsx
import { useTranslations } from "@/hooks/useTranslations";

export function MyNewScreen() {
  const { t } = useTranslations();

  return (
    <View>
      <Text className="text-2xl">{t('myNewScreen', 'header')}</Text>
      <Text className="text-base">{t('myNewScreen', 'title')}</Text>
      <Pressable>
        <Text>{t('myNewScreen', 'button')}</Text>
      </Pressable>
    </View>
  );
}
```

## Language Selection

Users can change language from **ProfileScreen**:
1. Navigate to ProfileScreen
2. Tap on Language section
3. Select English, Sinhala, or Tamil
4. App automatically reloads with new language

### Automatic Updates
The `useTranslations` hook automatically re-renders when the language changes because the language store uses Zustand, which triggers re-renders on state updates.

## Adding a New Language

### 1. Update language store type
Edit `Store/language.store.ts`:
```tsx
export type Language = "english" | "sinhala" | "tamil" | "newLang";
```

### 2. Add translations to JSON
Add a new language object to `constants/translations.json`:
```json
{
  "newLang": {
    "common": { ... },
    "profile": { ... },
    ...
  }
}
```

### 3. Update ProfileScreen
Add language option to the language selection list:
```tsx
[
  { id: "english", name: "English", flag: "🇬🇧" },
  { id: "sinhala", name: "සිංහල", flag: "🇱🇰" },
  { id: "tamil", name: "தமிழ்", flag: "🇱🇰" },
  { id: "newLang", name: "New Language", flag: "🚩" },
]
```

## Best Practices

1. **Use `common` section for shared labels**
   - "Back", "Done", "Error", "Success" should be in `common`
   - Reuse across screens

2. **Narrow down section names**
   - Use clear, specific section names: `profile`, `cowList`, `addCow`
   - Avoid too broad sections

3. **Consistent key naming**
   - Use camelCase for keys: `myKey`, `myLongKey`
   - Use descriptive names that indicate purpose

4. **Group related translations**
   - Group buttons together, labels together
   - Organize sections by screen/feature

## Example: Adding Translation to a New Screen

```tsx
// 1. Import hook
import { useTranslations } from "@/hooks/useTranslations";

// 2. Add to component
export function MyNewScreen() {
  const { t } = useTranslations();

  return (
    <View>
      {/* 3. Use t() function */}
      <Text>{t('myScreen', 'title')}</Text>
      <Pressable>
        <Text>{t('common', 'back')}</Text>
      </Pressable>
    </View>
  );
}
```

```json
// 4. Add to translations.json
{
  "english": {
    "myScreen": {
      "title": "My Screen"
    }
  },
  "sinhala": {
    "myScreen": {
      "title": "මගේ තිර"
    }
  },
  "tamil": {
    "myScreen": {
      "title": "என்னுடைய திரை"
    }
  }
}
```

## Files Created/Modified

### Created:
- `Store/language.store.ts` - Language state management
- `hooks/useTranslations.ts` - Translation hook
- `constants/translations.json` - Translation data

### Modified:
- `app/(tabs)/Cow/Screens/ProfileScreen.tsx` - Language selection UI
- `components/cow/DairyDashboard.tsx` - All labels translated
- `components/cow/CowListScreen.tsx` - All labels translated
- `components/cow/AddCowScreen.tsx` - All labels translated,  modals translated
- `components/cow/MilkEntryScreen.tsx` - All labels and modals translated
- `components/cow/AlertsRecommendationsScreen.tsx` - Header translated
- `components/cow/HistoryScreen.tsx` - Header and UI translated

## Testing the Implementation

1. Open ProfileScreen
2. Select different languages (English, Sinhala, Tamil)
3. Verify all screens update their labels instantly
4. Check that translations persist after app restart

## Troubleshooting

### Translations not updating?
- Ensure you're using the correct section and key names
- Check that the translation exists in all language versions
- Verify the hook is imported correctly

### Missing translations?
- Add missing keys to all three language objects (english, sinhala, tamil)
- Use console errors to identify which translation is missing

### Language not persisting?
- Ensure AsyncStorage is properly configured
- Check that `language.store.ts` hydrate() is called on app startup

## Next Steps

1. Add translations to remaining screens (AnalyticsScreen, etc.)
2. Consider adding more languages following the same pattern
3. Export translations to external translators for professional translation services
4. Monitor for missing translations during development
