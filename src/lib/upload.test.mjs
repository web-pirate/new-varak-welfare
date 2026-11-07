import { test } from "node:test";
import assert from "node:assert/strict";
import { isOwnImageUrl, photoKey, sniffImage } from "./upload.ts";

const bytes = (...n) => new Uint8Array(n);
const ascii = (s) => [...s].map((c) => c.charCodeAt(0));

test("real image formats are recognised by their bytes", () => {
  assert.equal(sniffImage(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10)), "image/jpeg");
  assert.equal(sniffImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0)), "image/png");
  assert.equal(sniffImage(bytes(...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WEBP"), 0)), "image/webp");
});

test("anything else is rejected, whatever it is named", () => {
  assert.equal(sniffImage(bytes(...ascii("<svg xmlns='http://www.w3.org/2000/svg'>"))), null); // svg can carry scripts
  assert.equal(sniffImage(bytes(...ascii("<html><script>alert(1)</script>"))), null);
  assert.equal(sniffImage(bytes(...ascii("GIF89a"))), null);
  assert.equal(sniffImage(bytes(...ascii("MZ"), 0x90, 0)), null); // an .exe renamed to .jpg
  assert.equal(sniffImage(bytes(...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WAVE"))), null);
  assert.equal(sniffImage(bytes()), null);
  assert.equal(sniffImage(bytes(0xff, 0xd8)), null);
});

test("R2 photo paths are accepted, other shapes are not", () => {
  const id = "3f2a1b4c-9b1c-4d5e-8f60-123456789abc";
  assert.equal(isOwnImageUrl(`/api/files/photos/user_2abc/${id}.jpg`, {}), true);
  assert.equal(isOwnImageUrl(`/api/files/photos/user_2abc/${id}.pdf`, {}), false);
  assert.equal(isOwnImageUrl(`/api/files/documents/user_2abc/${id}.jpg`, {}), false); // private documents are not photos
  assert.equal(isOwnImageUrl(`/api/files/photos/../x/${id}.jpg`, {}), false);
});

test("only our own Cloudinary account is accepted as a photo URL", () => {
  const o = { cloudName: "varak" };
  assert.equal(isOwnImageUrl("https://res.cloudinary.com/varak/image/upload/v1/varak/patients/a.jpg", o), true);
  assert.equal(isOwnImageUrl("https://res.cloudinary.com/someone-else/image/upload/a.jpg", o), false);
  assert.equal(isOwnImageUrl("https://evil.example/pixel.gif", o), false);
  assert.equal(isOwnImageUrl("https://res.cloudinary.com.evil.example/varak/a.jpg", o), false);
  assert.equal(isOwnImageUrl('https://res.cloudinary.com/varak/a.jpg" onerror="x', o), false);
  assert.equal(isOwnImageUrl("javascript:alert(1)", o), false);
  assert.equal(isOwnImageUrl("https://res.cloudinary.com/varak/a.jpg", {}), false); // not configured: nothing external is trusted
});

test("local /uploads files are accepted in development only", () => {
  assert.equal(isOwnImageUrl("/uploads/3f2a-9b1c.png", { allowLocal: true }), true);
  assert.equal(isOwnImageUrl("/uploads/3f2a-9b1c.png", { allowLocal: false }), false);
  assert.equal(isOwnImageUrl("/uploads/../.env", { allowLocal: true }), false);
  assert.equal(isOwnImageUrl("/uploads/a/b.png", { allowLocal: true }), false);
  assert.equal(isOwnImageUrl("/uploads/x.svg", { allowLocal: true }), false);
});

import { cleanFileName, isOwnFileUrl, sniffDocument } from "./upload.ts";

test("documents: a PDF is accepted as well as images; scripts and executables are not", () => {
  assert.equal(sniffDocument(bytes(...ascii("%PDF-1.7"))), "application/pdf");
  assert.equal(sniffDocument(bytes(0xff, 0xd8, 0xff, 0xe0)), "image/jpeg");
  assert.equal(sniffDocument(bytes(...ascii("<script>"))), null);
  assert.equal(sniffDocument(bytes(...ascii("PK"), 3, 4)), null); // zip / docx
  assert.equal(sniffDocument(bytes(...ascii("%PDF"))), null); // too short to be sure
});

test("documents: only our own storage URLs, PDF allowed", () => {
  assert.equal(isOwnFileUrl("/uploads/3f2a-9b1c.pdf", { allowLocal: true }), true);
  assert.equal(isOwnFileUrl("/uploads/3f2a-9b1c.pdf", { allowLocal: false }), false);
  assert.equal(isOwnFileUrl("/uploads/x.html", { allowLocal: true }), false);
  assert.equal(isOwnFileUrl("https://res.cloudinary.com/varak/image/upload/v1/varak/documents/a.pdf", { cloudName: "varak" }), true);
  assert.equal(isOwnFileUrl("https://res.cloudinary.com/other/image/upload/a.pdf", { cloudName: "varak" }), false);
  const id = "3f2a1b4c-9b1c-4d5e-8f60-123456789abc";
  assert.equal(isOwnFileUrl(`/api/files/documents/user_2abc/${id}.pdf`, {}), true); // private R2 file
  assert.equal(isOwnFileUrl(`/api/files/documents/user_2abc/${id}.html`, {}), false);
  assert.equal(isOwnFileUrl(`/api/files/documents/../x/${id}.pdf`, {}), false);
});

test("file names are cleaned before they are stored or shown", () => {
  assert.equal(cleanFileName("C:\\Users\\me\\report.pdf"), "report.pdf");
  assert.equal(cleanFileName("../../etc/passwd"), "passwd");
  assert.equal(cleanFileName('<img src=x onerror="alert(1)">.pdf'), "img src=x onerror=alert(1).pdf");
  assert.equal(cleanFileName(""), "document");
  assert.equal(cleanFileName("a".repeat(300)).length, 100);
});

import { DOCUMENT_LABELS, DOCUMENT_TYPES, isPdfUrl } from "./upload.ts";

test("PDFs are told apart from images by their URL", () => {
  assert.equal(isPdfUrl("/uploads/3f2a-9b1c.pdf"), true);
  assert.equal(isPdfUrl("https://res.cloudinary.com/varak/image/upload/v1/varak/documents/report.PDF"), true);
  assert.equal(isPdfUrl("https://res.cloudinary.com/varak/image/upload/v1/a.pdf?x=1"), true);
  assert.equal(isPdfUrl("/uploads/photo.jpg"), false);
  assert.equal(isPdfUrl("/uploads/pdf-notes.png"), false);
});

test("every document type has a label", () => {
  for (const t of DOCUMENT_TYPES) assert.ok(DOCUMENT_LABELS[t]);
});

test("photoKey maps our photo URLs to R2 keys and ignores everything else", () => {
  const id = "3f2a1b4c-9b1c-4d5e-8f60-123456789abc";
  assert.equal(photoKey(`/api/files/photos/user_2abc/${id}.jpg`), `photos/user_2abc/${id}.jpg`);
  assert.equal(photoKey(`/api/files/documents/user_2abc/${id}.pdf`), null); // documents are never touched
  assert.equal(photoKey("https://res.cloudinary.com/varak/image/upload/a.jpg"), null);
  assert.equal(photoKey("/uploads/a.jpg"), null);
});
