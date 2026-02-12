import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const [isUploading, setIsUploading] = useState(false);

  async function startUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Rename files
    const renamedFiles = files.map((file) => {
      const extension = file.name.split(".").pop();
      return new File(
        [file],
        `attachment_${crypto.randomUUID()}.${extension}`,
        {
          type: file.type,
        },
      );
    });

    // Add files to attachments as uploading
    setAttachments((prev) => [
      ...prev,
      ...renamedFiles.map((file) => ({ file, isUploading: true })),
    ]);

    try {
      const formData = new FormData();
      renamedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload/attachment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      // Update attachments with mediaId
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = data.results.find(
            (r: any) => r.name === a.file.name,
          );

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.mediaId,
            isUploading: false,
          };
        }),
      );

      setUploadProgress(100);
    } catch (error) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(undefined), 1000);
    }
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
