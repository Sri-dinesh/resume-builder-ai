import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone, type Accept } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  maxFiles = 1,
  accept,
}: {
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: Accept;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    let updatedFiles = [];
    if (maxFiles === 1) {
      updatedFiles = newFiles.slice(0, 1);
    } else {
      updatedFiles = [...files, ...newFiles];
      if (maxFiles > 0 && updatedFiles.length > maxFiles) {
        updatedFiles = updatedFiles.slice(0, maxFiles);
      }
    }

    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    accept,
    multiple: maxFiles !== 1,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-6"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={accept ? Object.keys(accept).join(",") : undefined}
          multiple={maxFiles !== 1}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-sm font-bold text-neutral-700 dark:text-neutral-300">
            Upload file
          </p>
          <p className="relative z-20 mt-1 font-sans text-xs font-normal text-neutral-400 dark:text-neutral-400">
            Drag or drop your PDF here
          </p>
          <div className="relative mx-auto mt-6 w-full max-w-xl">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative z-40 mx-auto mt-2 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-3 dark:bg-neutral-900",
                    "shadow-sm",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="max-w-[150px] truncate text-xs text-neutral-700 dark:text-neutral-300"
                    >
                      {file.name}
                    </motion.p>
                    <div className="flex items-center gap-1.5">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="w-fit shrink-0 rounded-lg px-1.5 py-0.5 text-[10px] text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                      <button
                        onClick={(e) => removeFile(idx, e)}
                        className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      >
                        <IconX className="h-3 w-3 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 mx-auto mt-2 flex h-20 w-full max-w-[5rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-xs text-neutral-600"
                  >
                    Drop
                    <IconUpload className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-2 flex h-20 w-full max-w-[5rem] items-center justify-center rounded-md border border-dashed border-primary bg-transparent opacity-0"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
