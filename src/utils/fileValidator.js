// Ukuran maksimum file dalam bytes
export const FILE_LIMITS = {
  IMAGE: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 6 * 1024 * 1024, // 50MB
};

// Tipe file yang diizinkan
export const ALLOWED_MIMETYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/jpg"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const validateFile = (file) => {
  // Cek apakah file ada
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Cek ukuran file berdasarkan tipe
  if (ALLOWED_MIMETYPES.IMAGE.includes(file.type)) {
    if (file.size > FILE_LIMITS.IMAGE) {
      throw new Error("Image file too large. Maximum size is 2MB");
    }
  } else if (ALLOWED_MIMETYPES.DOCUMENT.includes(file.type)) {
    if (file.size > FILE_LIMITS.DOCUMENT) {
      throw new Error("Document file too large. Maximum size is 6MB");
    }
  } else {
    throw new Error("File type not allowed");
  }

  return true;
};
