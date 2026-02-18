# Changelog

## [Unreleased] - 2026-02-18

### Added
- ✅ Cloud synchronization via Supabase (optional)
- ✅ Simple 6-digit access code for multi-device sync
- ✅ Automatic background synchronization
- ✅ Sync status indicator with real-time updates
- ✅ Offline-first architecture with auto-sync when online
- ✅ Sync settings management (view code, disable sync)
- ✅ Mahlgrad (grind size) field for coffee drinks
- ✅ Text review field for detailed tasting notes (optional)
- ✅ Comprehensive Supabase setup documentation
- ✅ Visual guide for getting Supabase API keys

### Changed
- ⚡ Brew time is now optional instead of required
- 🔄 Updated to support new Supabase API key naming (anon/public)
- 📝 Enhanced documentation with detailed API key instructions
- 🎨 Coffee types limited to: Geyser and French Press

### Technical
- Added `@supabase/supabase-js` dependency
- Created `useSyncedStorage` hook with debounced sync
- Implemented Row Level Security (RLS) policies
- Added sync service with CRUD operations
- Created sync UI components (SyncSetup, SyncIndicator, SyncSettings)
- Added automatic camelCase ↔ snake_case conversion for database fields
- Created `caseConverter.ts` utility for proper field mapping

### Documentation
- Added `SUPABASE_SETUP.md` - Complete Supabase configuration guide
- Added `SUPABASE_API_KEYS.md` - Visual guide for API keys
- Added `.env.example` - Environment variables template
- Updated `README.md` with sync instructions

### Security
- ✅ Row Level Security enabled on all tables
- ✅ Session-based data isolation
- ✅ Client-safe API keys (anon/public only)
- ⚠️ Warning about service_role key usage

### Fixed
- 🐛 Fixed "Could not find the 'brewTime' column" error by implementing proper field name conversion
- 🔧 Database uses snake_case (brew_time) while JavaScript uses camelCase (brewTime)

## [1.0.0] - 2026-02-18

### Initial Release
- Coffee drink tracking application
- Local storage with LocalStorage API
- Add, edit, delete, view drinks
- Rate drinks (1-5 stars)
- Mobile-responsive design
- Offline-first functionality
