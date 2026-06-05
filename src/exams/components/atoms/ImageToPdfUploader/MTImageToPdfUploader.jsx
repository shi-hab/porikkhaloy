import { useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

const MAX_FILES_PER_UPLOAD = 5;

export const MTImageToPdfUploader = ({
  onUploadSuccess,
  isUploading,
  examId,
  studentId,
  uploadAnswerFile,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelectAndUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // limit check
    if (files.length > MAX_FILES_PER_UPLOAD) {
      toast.error(
        `একবারে সর্বোচ্চ ${MAX_FILES_PER_UPLOAD} টি ছবি আপলোড করা যাবে`
      );
      return;
    }

    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };

    setIsProcessing(true);

    const toastId = toast.loading("Images uploading...");

    try {
      const compressedFiles = [];
      const previews = [];

      // compress images
      for (const file of files) {
        const compressedBlob = await imageCompression(file, options);

        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        compressedFiles.push(compressedFile);

        previews.push({
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
        });
      }

      // create formdata
      const payload = new FormData();

      payload.append("student_id", studentId);
      payload.append("exam_id", examId);

      compressedFiles.forEach((file) => {
        payload.append("images[]", file);
      });

      // upload api
      const response = await uploadAnswerFile(payload).unwrap();

      // append images instead of replace
      setSelectedImages((prev) => [...prev, ...previews]);

      toast.success("Successfully uploaded!", {
        id: toastId,
      });

      onUploadSuccess(response);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.data?.message || "Failed to upload images!",
        {
          id: toastId,
        }
      );
    } finally {
      setIsProcessing(false);
      e.target.value = null;
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <label className="text-md font-siliguri font-medium text-gray-700 dark:text-gray-300">
          উত্তরপত্র সিলেক্ট করো
        </label>

        <span className="text-xs text-blue-600 font-medium">
          প্রতি বার সর্বোচ্চ {MAX_FILES_PER_UPLOAD} টি ছবি
        </span>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {selectedImages.map((img, index) => (
          <div
            key={index}
            className="relative aspect-[3/4] border rounded-md overflow-hidden bg-white shadow-sm"
          >
            <img
              src={img.preview}
              alt={`preview-${index}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] py-0.5 text-center">
              Page {index + 1}
            </div>
          </div>
        ))}

        {/* Upload Button */}
        <label
          className={`flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed rounded-md transition-all ${
            isProcessing || isUploading
              ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
              : "border-blue-400 hover:border-blue-600 hover:bg-blue-50 dark:border-blue-800 cursor-pointer"
          }`}
        >
          {isProcessing || isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="animate-spin size-6" />
            </div>
          ) : (
            <>
              <Plus className="text-blue-500" />

              <span className="text-[10px] text-blue-600 mt-1 font-bold text-center px-1">
                {selectedImages.length > 0
                  ? "Add More"
                  : "Select & Upload"}
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelectAndUpload}
            disabled={isProcessing || isUploading}
          />
        </label>
      </div>

      {/* Footer Info */}
      {selectedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-green-600 font-medium bg-green-50 p-2 rounded border border-green-100">
            মোট {selectedImages.length} টি পেজ আপলোড হয়েছে
          </p>

          <p className="text-[10px] text-orange-600 font-medium bg-orange-50 p-2 rounded border border-orange-100">
            * একবারে সর্বোচ্চ {MAX_FILES_PER_UPLOAD} টি ছবি আপলোড করা যাবে।
            প্রয়োজনে আবার “Add More” এ ক্লিক করে বাকি পেজ আপলোড করো।
          </p>
        </div>
      )}
    </div>
  );
};