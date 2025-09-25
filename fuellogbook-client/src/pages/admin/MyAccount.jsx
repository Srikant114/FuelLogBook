// src/pages/admin/MyAccount.jsx
import React, { useEffect, useRef, useState } from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/CallApi";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud, X, Check } from "lucide-react";

/* ---------- compressImage helper (same efficient implementation) ---------- */
async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82, mimeType = "image/jpeg" } = {}) {
  if (!file) return null;
  const imgBitmap = await createImageBitmap(file);
  const originalWidth = imgBitmap.width;
  const originalHeight = imgBitmap.height;

  let targetWidth = originalWidth;
  let targetHeight = originalHeight;
  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    targetWidth = Math.round(originalWidth * ratio);
    targetHeight = Math.round(originalHeight * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), mimeType, quality));
  if (!blob) return file;
  const ext = mimeType === "image/png" ? "png" : "jpg";
  const newName = (file.name || "upload").replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;
  const compressedFile = new File([blob], newName, { type: mimeType });
  imgBitmap.close?.();
  return compressedFile;
}
/* ------------------------------------------------------------------------- */

const MyAccount = () => {
  const { user, login: authLogin } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", phone: "" });

  // Photo handling
  const [photoPreview, setPhotoPreview] = useState(null); // URL
  const [photoFile, setPhotoFile] = useState(null); // File
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Profile saving
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // refs
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  // populate form from user
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
      });
      setPhotoPreview(user.photoUrl || null);
    }
    // cleanup preview on unmount
    return () => {
      if (photoPreview) {
        try {
          URL.revokeObjectURL(photoPreview);
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  /* ---------- Image handlers (drag/drop + click) ---------- */
  const handleSelectFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (jpg, png, etc.)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Image too large — please use an image under 12MB.");
      return;
    }

    // show quick preview (original) while compress runs
    const originalUrl = URL.createObjectURL(file);
    setPhotoPreview(originalUrl);

    try {
      setUploadingPhoto(true);
      const compressed = await compressImage(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82, mimeType: "image/jpeg" });
      const finalFile = compressed || file;

      // revoke previous preview if it was an objectURL (avoid leaking)
      try {
        if (photoPreview && photoPreview.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
      } catch (e) {}

      const compressedUrl = URL.createObjectURL(finalFile);
      setPhotoFile(finalFile);
      setPhotoPreview(compressedUrl);
      toast.success("Image ready — click Upload to save");
    } catch (err) {
      console.error("compress failed", err);
      toast.error("Image processing failed; using original image");
      setPhotoFile(file);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleSelectFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) handleSelectFile(f);
  };
  const onDragOver = (e) => e.preventDefault();

  /* ---------- Save profile (name/username/phone) ---------- */
  const saveProfile = async () => {
    setSavingProfile(true);
    const tid = toast.loading("Saving profile...");
    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        phone: form.phone.trim(),
      };

      const res = await api.put("/api/auth/me", payload);
      if (!res || !res.success) {
        toast.error(res?.message || "Save failed", { id: tid });
        return;
      }

      // Refresh auth context user without full reload:
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        // authLogin will save token again and fetch /api/auth/me to update context
        await authLogin({ token }, true).catch(() => {});
      }

      toast.success(res.message || "Profile updated", { id: tid });
    } catch (err) {
      console.error("saveProfile error", err);
      toast.error(err?.message || "Save failed", { id: tid });
    } finally {
      setSavingProfile(false);
    }
  };

  /* ---------- Upload photo to /api/auth/me/photo ---------- */
  const uploadPhoto = async () => {
    if (!photoFile) {
      toast.error("Pick an image first");
      return;
    }
    setUploadingPhoto(true);
    const tid = toast.loading("Uploading photo...");
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await api.put("/api/auth/me/photo", fd);
      if (!res || !res.success) {
        toast.error(res?.message || "Upload failed", { id: tid });
        return;
      }

      // Refresh user
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        await authLogin({ token }, true).catch(() => {});
      }

      toast.success(res.message || "Photo updated", { id: tid });
      // clear local file but keep preview from server when AuthContext updates
      setPhotoFile(null);
    } catch (err) {
      console.error("uploadPhoto error", err);
      toast.error(err?.message || "Upload failed", { id: tid });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = async () => {
    if (!user?.photoUrl) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    const confirm = window.confirm("Remove profile photo?");
    if (!confirm) return;
    try {
      const res = await api.del("/api/auth/me/photo");
      if (!res || !res.success) {
        toast.error(res?.message || "Remove failed");
        return;
      }
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        await authLogin({ token }, true).catch(() => {});
      }
      toast.success(res.message || "Photo removed");
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error("removePhoto error", err);
      toast.error("Failed to remove photo");
    }
  };

  /* ---------- Change password ---------- */
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both old and new password required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be 6+ characters");
      return;
    }
    setChangingPassword(true);
    const tid = toast.loading("Changing password...");
    try {
      const res = await api.put("/api/auth/me/password", { oldPassword, newPassword });
      if (!res || !res.success) {
        toast.error(res?.message || "Change failed", { id: tid });
        return;
      }
      toast.success(res.message || "Password changed", { id: tid });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("changePassword err", err);
      toast.error(err?.message || "Change failed", { id: tid });
    } finally {
      setChangingPassword(false);
    }
  };

  /* ---------- Responsive layout markup ---------- */
  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <Toaster position="top-right" />
      <TitleAdmin title="My Account" subTitle="Update your profile information and change password." />

      <section className="mt-6 max-w-5xl w-full mx-auto space-y-6">
        {/* PROFILE CARD */}
        <div className="w-full bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4 text-theme dark:text-white">Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Avatar / upload area */}
            <div className="flex flex-col items-start gap-3">
              <div
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click(); }}
                className="w-36 h-36 md:w-40 md:h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-700/40 bg-theme flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                aria-label="Upload profile image (click or drag & drop)"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-theme-light dark:text-theme-light px-3">
                    <UploadCloud size={36} />
                    <div className="text-xs text-center">Click or drop to upload</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-md border text-sm">
                  Choose
                </button>

                <button onClick={uploadPhoto} disabled={uploadingPhoto || !photoFile} className="px-3 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-60">
                  {uploadingPhoto ? "Uploading..." : "Upload"}
                </button>

                <button onClick={() => { setPhotoFile(null); setPhotoPreview(user?.photoUrl || null); }} className="px-3 py-2 rounded-md border text-sm">
                  Reset
                </button>

                {user?.photoUrl && (
                  <button onClick={removePhoto} className="px-3 py-2 rounded-md border text-sm">
                    Remove
                  </button>
                )}
              </div>

              <div className="text-xs text-theme-light dark:text-theme-light mt-2 max-w-xs">
                Recommended: square photo. Large photos will be resized automatically.
              </div>
            </div>

            {/* Profile fields */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-xs text-theme-light dark:text-theme-light mb-1">Full name</span>
                  <input value={form.name} onChange={update("name")} placeholder="Full name" className="rounded-md px-3 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-full" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-theme-light dark:text-theme-light mb-1">Username</span>
                  <input value={form.username} onChange={update("username")} placeholder="Username" className="rounded-md px-3 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-full" />
                </label>

                <label className="flex flex-col sm:col-span-2">
                  <span className="text-xs text-theme-light dark:text-theme-light mb-1">Phone</span>
                  <input value={form.phone} onChange={update("phone")} placeholder="Phone number" className="rounded-md px-3 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-full" />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={saveProfile} disabled={savingProfile} className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
                  {savingProfile ? "Saving..." : "Save profile"}
                </button>
                <button onClick={() => { setForm({ name: user?.name || "", username: user?.username || "", phone: user?.phone || "" }); setPhotoPreview(user?.photoUrl || null); setPhotoFile(null); }} className="px-4 py-2 rounded-md border">
                  Reset
                </button>
                <div className="ml-auto text-sm text-theme-light dark:text-theme-light self-center">Last updated: {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* PASSWORD CARD */}
        <div className="w-full bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4 text-theme dark:text-white">Change password</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-xs text-theme-light dark:text-theme-light mb-1">Current password</span>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old password" className="rounded-md px-3 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-full" />
            </label>

            <label className="flex flex-col">
              <span className="text-xs text-theme-light dark:text-theme-light mb-1">New password</span>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="rounded-md px-3 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-full" />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={changePassword} disabled={changingPassword} className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60">
              {changingPassword ? "Changing..." : "Change password"}
            </button>
            <button onClick={() => { setOldPassword(""); setNewPassword(""); }} className="px-4 py-2 rounded-md border">
              Reset
            </button>
            <div className="ml-auto text-sm text-theme-light dark:text-theme-light self-center">Use a strong password (8+ characters)</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccount;
