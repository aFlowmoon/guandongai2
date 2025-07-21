import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AvatarUpload({ 
  avatar,
  onUpload
}: {
  avatar: string;
  onUpload: (file: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('请上传图片文件 (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // 验证文件大小 (最大2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片大小不能超过2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => toast.loading('正在上传头像...');
    reader.onload = () => {
      setPreview(reader.result as string);
      onUpload(file);
      toast.success('头像上传成功');
    };
    reader.onerror = () => toast.error('头像上传失败');
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <img
          src={preview || avatar}
          alt="用户头像"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 transition-all group-hover:border-blue-600"
        />
        <div 
          className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center opacity-0 group-hover:bg-opacity-30 group-hover:opacity-100 transition-all cursor-pointer"
          onClick={triggerFileInput}
        >
          <i className="fa-solid fa-camera text-white text-xl"></i>
        </div>
      </div>
      <input
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500">支持 JPG, PNG, GIF, WEBP (最大2MB)</p>
    </div>
  );
}