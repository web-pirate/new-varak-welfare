// Campaign slugs look like "<readable part>-<short id>". The short id makes the slug unique and is what lookups
// rely on, so titles in any script (Hindi, Arabic, Chinese, mixed) work: the readable part is ASCII-only and can
// fall back to a plain word. No dependencies, so it also runs in the browser and in `node --test`.

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ID_CHARS = "abcdefghjkmnpqrstuvwxyz23456789"; // no look-alikes: i, l, o, 0, 1
const ID_LENGTH = 8;
const SLUG_ID = new RegExp(`^[${ID_CHARS}]{${ID_LENGTH}}$`);

// Always contains a digit and a letter, so an ordinary word at the end of a slug ("...-lymphoma") is never taken for an id
// shortcut: modulo bias on the random bytes is negligible for ids this size
export function shortId(): string {
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(ID_LENGTH));
    const id = Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("");
    if (/\d/.test(id) && /[a-z]/.test(id)) return id;
  }
}

export function campaignSlug(title: string, fallback = "campaign"): string {
  const base = slugify(title).slice(0, 60).replace(/-+$/, "") || slugify(fallback) || "campaign";
  return `${base}-${shortId()}`;
}

/** The id at the end of a slug we generated, or null when the slug doesn't end in one. */
export function slugId(slug: string): string | null {
  const id = slug.slice(slug.lastIndexOf("-") + 1);
  return SLUG_ID.test(id) && /\d/.test(id) ? id : null;
}
