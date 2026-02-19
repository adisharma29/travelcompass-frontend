# Phase 3 Enhancements — Departments & Experiences Admin UX

## Why
The current CRUD pages are functional but use basic HTML inputs. This upgrade brings a polished admin experience: rich text editing, drag-to-reorder, styled uploads, timezone dropdowns, multi-photo galleries, and backend-generated slugs.

---

## Summary of Changes

| # | Change | Scope | New Packages |
|---|--------|-------|-------------|
| 1 | Auto-generate slugs on backend | Backend + Frontend | none |
| 2 | Rich text description (Tiptap) with server-side sanitization | Backend + Frontend | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`; backend: `bleach` |
| 3 | Display order via drag-and-drop | Backend + Frontend | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| 4 | Styled photo upload area | Frontend only | none |
| 5 | Timezone dropdown (searchable) | Frontend only | shadcn `command` + `popover` components |
| 6 | Horizontal day overrides | Frontend only | none |
| 7 | Multi-photo gallery for experiences | Backend + Frontend | none (reuses dnd-kit) |
| 8 | Highlights helper text | Frontend only | none |

---

## Security: Rich-Text Sanitization Policy

Descriptions will now store HTML (authored via Tiptap in the admin dashboard). This introduces an XSS surface that must be mitigated at every layer:

**Backend (authoritative sanitization):**
- Install `bleach` (`pip install bleach`)
- Sanitize description HTML on save in both `DepartmentSerializer.validate_description()` and `ExperienceSerializer.validate_description()`
- Allowlist: `<p>`, `<br>`, `<strong>`, `<em>`, `<s>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<li>`, `<blockquote>`, `<hr>`
- Strip all attributes (no `style`, `class`, `on*`, `href`, `src`)
- This ensures no script injection or event handler injection regardless of frontend
- Add to `requirements.txt`: `bleach>=6.0`

**Frontend — admin dashboard (editor):**
- Tiptap renders via ProseMirror contenteditable — does NOT use `dangerouslySetInnerHTML`
- Admin card previews strip HTML to plain text: `desc.replace(/<[^>]*>/g, '').trim()`
- No raw HTML rendering anywhere in the admin dashboard

**Frontend — guest-facing pages (Phase 4):**
- Render descriptions using Tiptap's read-only `EditorContent` (ProseMirror, no innerHTML)
- Alternatively, use a sanitized renderer that only allows the same tag allowlist
- CSP headers for `(hotel)` route group remain strict: `script-src 'self'`
- Existing CSP test updated: inject `<script>alert(1)</script>` in description → must be stripped by backend sanitizer, rendered as text on guest page

**Updated CSP verification (from v1 plan §11):**
- Admin creates department with description containing `<script>alert(1)</script><img onerror="alert(1)">` → backend strips to empty string / safe text
- Guest page loads that department → no script execution, CSP blocks any residual inline script
- Check `Content-Security-Policy` header present on guest routes

---

## Backend Changes

All in `tcomp-backend/tcomp/concierge/`.

### 1. Auto-generate slugs (`models.py` + `serializers.py`)

**models.py**
- `Department.save()`: if `self.slug` is empty, set `self.slug = slugify(self.name)` with uniqueness collision handling (append `-1`, `-2` etc., scoped to `hotel`)
- `Experience.save()`: same pattern, scoped to `department`

**serializers.py**
- `DepartmentSerializer.Meta.read_only_fields`: add `'slug'`
- `ExperienceSerializer.Meta.read_only_fields`: add `'slug'`

No migration needed — slug field already exists.

### 2. Rich-text sanitization (`serializers.py`)

Add `validate_description` method to both `DepartmentSerializer` and `ExperienceSerializer`:
```python
import bleach

ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr']

def validate_description(self, value):
    if value:
        return bleach.clean(value, tags=ALLOWED_TAGS, attributes={}, strip=True)
    return value
```

### 3. Bulk reorder endpoints (`views.py` + `urls.py`)

**views.py** — 2 new APIView subclasses with `IsAdminOrAbove` + `HotelScopedMixin`:

```
DepartmentBulkReorder (PATCH)
  URL: /hotels/{hotel_slug}/admin/departments/reorder/
  Permission: IsAdminOrAbove (hotel-scoped via HotelScopedMixin)
  Body: { "order": [1, 3, 2, 5] }   ← array of department IDs in desired order
  Server assigns display_order = array index (0, 1, 2, 3, ...)
  Constraints:
    - All IDs must exist and belong to the requesting hotel → 400 if any ID is not found in hotel
    - Duplicate IDs → 400
    - Empty list → 400
    - Wrapped in transaction.atomic()

ExperienceBulkReorder (PATCH)
  URL: /hotels/{hotel_slug}/admin/departments/{dept_slug}/experiences/reorder/
  Permission: IsAdminOrAbove (hotel-scoped)
  Body: { "order": [5, 8, 3] }
  Constraints: same as above, scoped to department__hotel + department__slug
```

**urls.py** — Place reorder paths **before** `<slug:dept_slug>/` to prevent "reorder" being captured as a slug:
```
path('.../admin/departments/reorder/', views.DepartmentBulkReorder.as_view())
path('.../admin/departments/<slug:dept_slug>/experiences/reorder/', views.ExperienceBulkReorder.as_view())
```

### 4. ExperienceImage model + API (`models.py`, `serializers.py`, `views.py`, `urls.py`)

**models.py** — New model:
```
ExperienceImage
  experience     FK -> Experience (related_name='gallery_images', on_delete=CASCADE)
  image          ImageField (upload_to='experience_gallery/')
  alt_text       CharField (max 255, blank)
  display_order  IntegerField (default=0)
  created_at     DateTimeField (auto_now_add)
  Meta: ordering = ['display_order', 'created_at']
```

**serializers.py**:
- New `ExperienceImageSerializer` (fields: id, image, alt_text, display_order, created_at; read_only: id, created_at)
- Nest `gallery_images = ExperienceImageSerializer(many=True, read_only=True)` in both `ExperienceSerializer` and `ExperiencePublicSerializer`

**views.py** — 3 new views, all with `IsAdminOrAbove` + `HotelScopedMixin`:

```
ExperienceImageUpload (POST)
  URL: /hotels/{hotel_slug}/admin/departments/{dept_slug}/experiences/{exp_id}/images/
  Permission: IsAdminOrAbove, hotel-scoped
  Scoping: validates exp belongs to dept belongs to hotel via queryset
  Action: upload one image, auto-assign next display_order

ExperienceImageDelete (DELETE)
  URL: /hotels/{hotel_slug}/admin/departments/{dept_slug}/experience-images/{pk}/
  Permission: IsAdminOrAbove, hotel-scoped
  Scoping: queryset filter experience__department__hotel=self.get_hotel(),
           experience__department__slug=self.kwargs['dept_slug']

ExperienceImageReorder (PATCH)
  URL: /hotels/{hotel_slug}/admin/departments/{dept_slug}/experiences/{exp_id}/images/reorder/
  Permission: IsAdminOrAbove, hotel-scoped
  Scoping: filters by experience__department__hotel + experience__department__slug
  Constraints: same atomic/deterministic/no-duplicates rules as dept/exp reorder
```

All image routes are fully hotel-scoped and department-scoped in both URL and queryset.

**urls.py** — 3 new paths under Admin section:
```python
# Experience images (under admin, hotel + dept scoped)
path('hotels/<slug:hotel_slug>/admin/departments/<slug:dept_slug>/experiences/<int:exp_id>/images/',
     views.ExperienceImageUpload.as_view(), name='admin-experience-image-upload'),
path('hotels/<slug:hotel_slug>/admin/departments/<slug:dept_slug>/experiences/<int:exp_id>/images/reorder/',
     views.ExperienceImageReorder.as_view(), name='admin-experience-image-reorder'),
path('hotels/<slug:hotel_slug>/admin/departments/<slug:dept_slug>/experience-images/<int:pk>/',
     views.ExperienceImageDelete.as_view(), name='admin-experience-image-delete'),
```

**Migration**: `makemigrations concierge` + `migrate` for the new ExperienceImage model.

---

## Frontend Changes

### Package Installation
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npx shadcn@latest add command popover
```

### New Shared Components (4 files)

**`src/components/dashboard/RichTextEditor.tsx`**
- Props: `content: string`, `onChange: (html: string) => void`, `placeholder?: string`
- Uses `useEditor` from `@tiptap/react` with `StarterKit`
- Toolbar: bold, italic, strike, H2, H3, bullet list, ordered list, blockquote
- Styled to match shadcn form inputs (border, rounded, focus ring)
- Tiptap uses ProseMirror contenteditable internally (NOT `dangerouslySetInnerHTML`)

**`src/components/dashboard/SortableList.tsx`**
- Generic `SortableList<T extends { id: number }>` component
- Props: `items: T[]`, `onReorder: (items: T[]) => void`, `renderItem: (item: T, dragHandleProps) => ReactNode`
- Uses `DndContext` + `SortableContext` + `verticalListSortingStrategy` from dnd-kit
- Each item wraps in `useSortable`, passes drag handle listeners to the render callback
- GripVertical icon becomes the functional drag handle
- Keyboard DnD support via `KeyboardSensor` + `sortableKeyboardCoordinates` (accessibility)

**`src/components/dashboard/ImageUploadArea.tsx`**
- Props: `value: File | null`, `existingUrl?: string | null`, `onChange: (file: File | null) => void`, `maxSizeMB?: number`
- Styled dashed-border drop zone with Upload icon and "Click to browse" text
- Shows image preview when file selected or existing URL present
- Clear button, size validation with inline error

**`src/components/dashboard/TimezoneCombobox.tsx`**
- Props: `value: string`, `onChange: (tz: string) => void`
- Uses shadcn Combobox pattern (Popover + Command with CommandInput)
- Populated from `Intl.supportedValuesOf('timeZone')` — no extra package needed
- Searchable, grouped by region (Asia/, America/, Europe/, etc.)

### CSS (`src/app/globals.css`)
- Add scoped ProseMirror styles under `.tiptap-editor` class
- Heading sizes, list styles, blockquote border, placeholder text

### Types & API (`src/lib/`)

**concierge-types.ts**:
- Add `ExperienceImage` interface
- Add `gallery_images: ExperienceImage[]` to `Experience`

**concierge-api.ts** — 5 new functions (reorder functions send `{ "order": [id, id, ...] }`, server assigns `display_order` by array index):
- `reorderDepartments(hotelSlug, orderedIds: number[])` — PATCH `/hotels/{slug}/admin/departments/reorder/`
- `reorderExperiences(hotelSlug, deptSlug, orderedIds: number[])` — PATCH `/hotels/{slug}/admin/departments/{dept_slug}/experiences/reorder/`
- `uploadExperienceImage(hotelSlug, deptSlug, expId, FormData)` — POST `/hotels/{slug}/admin/departments/{dept_slug}/experiences/{exp_id}/images/`
- `deleteExperienceImage(hotelSlug, deptSlug, imageId)` — DELETE `/hotels/{slug}/admin/departments/{dept_slug}/experience-images/{pk}/`
- `reorderExperienceImages(hotelSlug, deptSlug, expId, orderedIds: number[])` — PATCH `/hotels/{slug}/admin/departments/{dept_slug}/experiences/{exp_id}/images/reorder/`

### Departments Page (`src/app/(dashboard)/dashboard/departments/page.tsx`)

| Area | Before | After |
|------|--------|-------|
| Slug | Text input, auto-generated from name | Removed entirely (backend generates) |
| Description | `<Textarea>` (plain text) | `<RichTextEditor>` (Tiptap HTML, sanitized server-side) |
| Display order | Number `<Input>` in dialog | Removed from dialog; reorder via drag-and-drop on list |
| Photo | Raw `<input type="file">` | `<ImageUploadArea>` with preview |
| Timezone | Plain `<Input>` | `<TimezoneCombobox>` searchable dropdown |
| Day overrides | Vertical stack (one per row) | Horizontal `flex-wrap` with inline time inputs |
| List | Static sorted cards | Wrapped in `<SortableList>`, GripVertical is drag handle |
| Card description | Shows raw text | Strips HTML tags for plain text preview |

### Experiences Page (`src/app/(dashboard)/dashboard/experiences/page.tsx`)

| Area | Before | After |
|------|--------|-------|
| Slug | Text input, auto-generated from name | Removed entirely |
| Description | `<Textarea>` | `<RichTextEditor>` (sanitized server-side) |
| Display order | Number `<Input>` in dialog | Removed from dialog; drag-and-drop per dept group |
| Photo / Cover | Raw `<input type="file">` x2 | `<ImageUploadArea>` x2 with previews |
| Gallery | Does not exist | New section in edit dialog: sortable grid of images, multi-upload, delete per image |
| Highlights | Tags with no explanation | Add helper: "Key selling points displayed as bullet points to guests" |
| List per dept | Static sorted cards | Each dept group wrapped in `<SortableList>` |
| Card description | Shows raw text | Strips HTML tags |

---

## Execution Order

1. Backend: slug auto-gen in models + read_only in serializers
2. Backend: `pip install bleach` + description sanitization in serializers
3. Backend: bulk reorder views + URLs (with atomic transactions)
4. Backend: ExperienceImage model + migration + serializer + views + URLs
5. Frontend: install packages + shadcn components
6. Frontend: add ProseMirror CSS to globals.css
7. Frontend: create 4 shared components
8. Frontend: add types + API functions
9. Frontend: rewrite departments page
10. Frontend: rewrite experiences page
11. Update PROGRESS.md

---

## Verification

### API verification
- `PATCH /hotels/{hotel_slug}/admin/departments/reorder/` with any ID not belonging to this hotel -> 400
- `PATCH /hotels/{hotel_slug}/admin/departments/reorder/` with duplicate IDs -> 400
- `PATCH /hotels/{hotel_slug}/admin/departments/reorder/` with empty list -> 400
- `PATCH /hotels/{hotel_slug}/admin/departments/reorder/` with valid IDs -> all get sequential display_order matching array index
- `POST /hotels/{hotel_slug}/admin/departments/{dept_slug}/experiences/{exp_id}/images/` without admin role -> 403
- `DELETE /hotels/{hotel_slug}/admin/departments/{dept_slug}/experience-images/{pk}/` where image belongs to different hotel -> 404
- `POST /hotels/{hotel_slug}/admin/departments/` with description `"<script>alert(1)</script>"` -> saved as empty/stripped text

### UI verification
- Create department without slug -> backend auto-generates
- Edit description with rich text (bold, lists, headings), save, re-open -> HTML preserved correctly
- Drag departments to reorder -> order persists on refresh
- Upload photo via styled area -> preview shows, clear button works
- Search timezone in dropdown -> selects correctly
- Toggle day overrides -> horizontal layout, inline time inputs
- Create experience without slug -> auto-generated
- Upload multiple gallery images, reorder by drag, delete one -> all persist
- Drag experiences within a dept group -> order persists
- Keyboard-only drag (Tab to handle, Space to pick up, Arrow to move, Space to drop)
- `npm run build` passes

---

## Impact on Later Phases

These changes introduce HTML descriptions and gallery images that must be handled in subsequent phases. See updated sections in `v1_implementation_plan_FIXED_v4_updated.md`:

- **Phase 4** — Guest pages must render sanitized HTML descriptions (Tiptap read-only or safe renderer) and display gallery images in order
- **Phase 5** — Cache invalidation for reordered departments/experiences and new gallery images
- **Phase 6** — Accessibility hardening for DnD (keyboard fallback), upload failure/retry UX, sanitization regression tests
