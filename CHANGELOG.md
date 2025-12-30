# CHANGELOG (Behsayar MVP)

تاریخ: 2025-12-30

## مشکلاتی که پیدا شد
- عدم یکپارچگی Visual System (رنگ‌ها/شدو/رادیوس/فوکِس) و نبود توکن‌های طراحی مشترک.
- تکرار/تعارض CSS (تعریف دوباره `.container` و تکرار بلاک‌های Home در `pages.css`).
- فوتر بیش از حد شلوغ/سنگین و شامل لینک‌های «دسترسی صفحات» (عدم تطابق با UX مورد انتظار).
- خطای تایپی در `layout.css` (`gap: 16x`) و Override اشتباه padding کانتینر هدر.
- ناسازگاری/کد معیوب در `assets/js/auth.js` (شناسه‌های غلط و کلیدهای متفاوت localStorage).
- ساختار HTML غیرمعنایی (nested `<main>` در بعضی صفحات) که به SEO/دسترسی‌پذیری آسیب می‌زد.
- فایل‌های ناخواسته/بی‌استفاده در assets (فایل‌های خیلی کوچک و junk).

## اصلاحاتی که انجام شد
- تعریف Design System سبک در `base.css` (CSS Variables برای رنگ‌ها، spacing، radius، shadow، تایپوگرافی) + فوکس استاندارد `:focus-visible` + `prefers-reduced-motion`.
- استانداردسازی باتن‌ها/ورودی‌ها/کارت‌ها در `components.css` با حداقل اندازه لمس 44px و حالت‌های hover/active.
- تمیزکاری `pages.css`: حذف تعریف تکراری `.container` و حذف بلاک‌های تکراری بخش Home + استفاده از متغیرها برای رنگ‌ها/شدو.
- بازطراحی فوتر: ساده، خلوت، یکپارچه، فقط Brand + راه‌های ارتباطی + CTA؛ بک‌گراند بسیار سبک و رعایت `prefers-reduced-motion`.
- اصلاح `layout.css`: رفع typo، جلوگیری از شکستن padding کانتینر هدر، و جایگزینی کامل استایل‌های فوتر قدیمی با نسخه جدید.
- یکپارچه‌سازی `auth.js` به عنوان fallback هم‌سو با session demo پروژه (کلید `bs_session` و مسیر‌دهی نقش‌ها).
- اصلاح HTML: حذف nested `<main>` و تبدیل main داخلی به `<div class="container">` برای معنایی‌بودن و جلوگیری از مشکلات layout/SEO.
- حذف فایل‌های junk در assets.

## فایل‌هایی که تغییر کرد
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layout.css`
- `assets/css/pages.css`
- `assets/js/auth.js`
- همه‌ی صفحات HTML (برای فوتر جدید و اصلاح nested main)
- `CHANGELOG.md` (این فایل)

