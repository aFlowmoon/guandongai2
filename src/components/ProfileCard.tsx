import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const nameSchema = z.string()
  .min(2, "姓名至少需要2个字符")
  .max(20, "姓名不能超过20个字符")
  .regex(/^[\u4e00-\u9fa5a-zA-Z]+$/, "姓名只能包含中文或英文字符");

export default function ProfileCard({ 
  user,
  onSave
}: {
  user: {
    name: string;
    role: string;
  };
  onSave: (data: { name: string }) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setErrors({});
    }
  }, [isEditing]);

  const validate = () => {
    try {
      nameSchema.parse(editData.name);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ name: error.errors[0].message });
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(editData);
      setIsEditing(false);
      toast.success("个人信息已保存");
    } catch (error) {
      toast.error("保存失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">账号信息</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              取消
            </button>
            <button 
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting && <i className="fa-solid fa-spinner animate-spin"></i>}
              {isSubmitting ? "保存中..." : "保存"}
            </button>
          </div>
        ) : (
          <button 
            className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            编辑
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">姓名</label>
            <input
              type="text"
              className={cn(
                "w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                errors.name ? "border-red-500" : "border-gray-300"
              )}
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              onBlur={() => validate()}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-gray-500">姓名</p>
            <p className="font-medium">{user.name}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm text-gray-500">角色</p>
          <p className="font-medium">{user.role}</p>
        </div>
      </div>
    </div>
  );
}