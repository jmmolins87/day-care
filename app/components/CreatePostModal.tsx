"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { children } from "@/app/data/children";
import { postTypes, type PostTypeKey } from "@/app/data/postTypes";

type PhotoPreview = {
  id: string;
  url: string | null;
};

const INITIAL_PHOTOS: PhotoPreview[] = [{ id: "mock", url: null }];

type FormErrors = {
  recipients?: string;
  type?: string;
  description?: string;
};

function validate(
  selectedChildSlugs: string[],
  allClassroom: boolean,
  selectedType: "" | PostTypeKey,
  description: string
): FormErrors {
  const errors: FormErrors = {};
  if (selectedChildSlugs.length === 0 && !allClassroom)
    errors.recipients = "Elegí al menos un niño o Toda la sala.";
  if (!selectedType) errors.type = "Elegí un tipo de publicación.";
  if (!description.trim()) errors.description = "La descripción es requerida.";
  return errors;
}

export default function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [selectedChildSlugs, setSelectedChildSlugs] = useState<string[]>([]);
  const [allClassroom, setAllClassroom] = useState(false);
  const [selectedType, setSelectedType] = useState<"" | PostTypeKey>("");
  const [photos, setPhotos] = useState<PhotoPreview[]>(INITIAL_PHOTOS);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIdRef = useRef<string | null>(null);

  const resetForm = useCallback(() => {
    setSelectedChildSlugs([]);
    setAllClassroom(false);
    setSelectedType("");
    setDescription("");
    setErrors({});
    setTouched({});
    setPhotos((prev) => {
      prev.forEach((photo) => {
        if (photo.url) URL.revokeObjectURL(photo.url);
      });
      return INITIAL_PHOTOS;
    });
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const toggleChild = (slug: string) => {
    setSelectedChildSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setAllClassroom(false);
    if (errors.recipients) setErrors({ ...errors, recipients: undefined });
  };

  const toggleAllClassroom = () => {
    setAllClassroom((prev) => !prev);
    setSelectedChildSlugs([]);
    if (errors.recipients) setErrors({ ...errors, recipients: undefined });
  };

  const addFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length === 0) return;
    const previews = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...previews]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo?.url) URL.revokeObjectURL(photo.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleTileDragStart = (id: string, e: DragEvent<HTMLDivElement>) => {
    dragIdRef.current = id;
    e.dataTransfer.setData("application/x-photo-tile", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTileDragOver = (e: DragEvent<HTMLDivElement>, overId: string) => {
    const dragId = dragIdRef.current;
    if (!dragId || dragId === overId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setPhotos((prev) => {
      const from = prev.findIndex((p) => p.id === dragId);
      const to = prev.findIndex((p) => p.id === overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleTileDragEnd = () => {
    dragIdRef.current = null;
  };

  const handlePhotosDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (dragIdRef.current === null && e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setIsFileDragOver(true);
    }
  };

  const handlePhotosDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsFileDragOver(false);
  };

  const handlePhotosDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragOver(false);
    if (dragIdRef.current !== null) return;
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(
      validate(selectedChildSlugs, allClassroom, selectedType, description)
    );
  };

  const handlePublish = () => {
    setTouched({ recipients: true, type: true, description: true });
    const newErrors = validate(
      selectedChildSlugs,
      allClassroom,
      selectedType,
      description
    );
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handlePublish();
  };

  const showError = (field: keyof FormErrors) => touched[field] && errors[field];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)] mb-[18px] cursor-pointer"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva publicación
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[40px] px-[24px]"
          style={{ backgroundColor: "rgba(63,54,46,.45)" }}
          role="dialog"
          aria-modal
          aria-label="Nueva publicación"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-[580px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden">
            <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#94887B] font-[700] text-[15px] cursor-pointer"
              >
                Cancelar
              </button>
              <span className="font-['Fredoka'] font-[600] text-[18px] text-[#3F362E]">
                Nueva publicación
              </span>
              <button
                type="submit"
                form="create-post-form"
                className="text-[#D9583C] font-[800] text-[15px] cursor-pointer"
              >
                Publicar
              </button>
            </div>

            <form
              id="create-post-form"
              onSubmit={handleSubmit}
              className="px-[26px] py-[24px]"
            >
              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                PARA
              </div>
              <div
                className={`flex flex-wrap gap-[9px] ${
                  showError("recipients") ? "mb-[6px]" : "mb-[22px]"
                }`}
              >
                {children.map((child) => {
                  const selected = selectedChildSlugs.includes(child.slug);
                  return (
                    <button
                      key={child.slug}
                      type="button"
                      onClick={() => toggleChild(child.slug)}
                      className={`flex items-center gap-[8px] py-[6px] pr-[14px] pl-[6px] rounded-full border-[1.5px] font-[700] text-[14px] cursor-pointer ${
                        selected
                          ? "border-[#3F362E] bg-[#3F362E] text-white"
                          : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                      }`}
                    >
                      <span
                        className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-['Fredoka'] font-[600] text-[13px]"
                        style={{
                          backgroundColor: child.avatar.bg,
                          color: child.avatar.color,
                        }}
                      >
                        {child.initial}
                      </span>
                      {child.name.split(" ")[0]}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={toggleAllClassroom}
                  className={`py-[6px] px-[16px] rounded-full border-[1.5px] font-[700] text-[14px] cursor-pointer ${
                    allClassroom
                      ? "border-[#3F362E] bg-[#3F362E] text-white"
                      : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                  }`}
                >
                  Toda la sala
                </button>
              </div>
              {showError("recipients") && (
                <p className="text-[13px] text-[#C5413A] mb-[22px]">
                  {errors.recipients}
                </p>
              )}

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                TIPO
              </div>
              <div
                className={`flex flex-wrap gap-[9px] ${
                  showError("type") ? "mb-[6px]" : "mb-[22px]"
                }`}
              >
                {postTypes.map((type) => {
                  const selected = selectedType === type.key;
                  return (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => {
                        setSelectedType(type.key);
                        if (errors.type) setErrors({ ...errors, type: undefined });
                      }}
                      className="py-[8px] px-[16px] rounded-full border-none font-[800] text-[13.5px] cursor-pointer"
                      style={
                        selected
                          ? { backgroundColor: type.solid, color: "#fff" }
                          : { backgroundColor: type.soft.bg, color: type.soft.color }
                      }
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
              {showError("type") && (
                <p className="text-[13px] text-[#C5413A] mb-[22px]">
                  {errors.type}
                </p>
              )}

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                DESCRIPCIÓN
              </div>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors({ ...errors, description: undefined });
                }}
                onBlur={() => handleBlur("description")}
                placeholder="Contá cómo le fue hoy…"
                className={`w-full min-h-[120px] resize-y py-[14px] px-[16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] leading-[1.5] placeholder:text-[#B6A99B] ${
                  showError("description")
                    ? "border-[#C5503A] mb-[6px]"
                    : "border-[#EADFD0] mb-[22px]"
                }`}
              />
              {showError("description") && (
                <p className="text-[13px] text-[#C5413A] mb-[22px]">
                  {errors.description}
                </p>
              )}

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                FOTOS
              </div>
              <div
                className="flex flex-wrap gap-[12px]"
                onDragOver={handlePhotosDragOver}
                onDragLeave={handlePhotosDragLeave}
                onDrop={handlePhotosDrop}
              >
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleTileDragStart(photo.id, e)}
                    onDragOver={(e) => handleTileDragOver(e, photo.id)}
                    onDragEnd={handleTileDragEnd}
                    className="relative flex-none w-[96px] h-[96px] rounded-[14px] bg-[#F4ECE1] border border-[#ECE0D0] flex items-center justify-center text-[#CBB89F] cursor-grab"
                  >
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover rounded-[13px]"
                      />
                    ) : (
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                      </svg>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Quitar foto"
                      className="absolute -top-[8px] -right-[8px] w-[22px] h-[22px] rounded-full bg-[#3F362E] text-white flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-none w-[96px] h-[96px] rounded-[14px] border-[1.5px] border-dashed bg-[#F4ECE1] flex flex-col items-center justify-center gap-[6px] text-[#B0A290] cursor-pointer ${
                    isFileDragOver ? "border-[#C5503A]" : "border-[#DBCDBA]"
                  }`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C5503A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[12px]">Agregar</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
