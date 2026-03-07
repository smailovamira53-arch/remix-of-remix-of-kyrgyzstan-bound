import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Globe,
  Link,
  ToggleLeft,
  Hash,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// ─── ТИПЫ ───────────────────────────────────────────────────────────────────

interface Banner {
  id: string;
  text_en: string | null;
  text_ru: string | null;
  text_es: string | null;
  text_ar: string | null;
  link: string | null;
  link_label_en: string | null;
  link_label_ru: string | null;
  link_label_es: string | null;
  link_label_ar: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

// Пустой шаблон для новых баннеров
const emptyBanner: Omit<Banner, "id" | "created_at"> = {
  text_en: "",
  text_ru: "",
  text_es: "",
  text_ar: "",
  link: "",
  link_label_en: "",
  link_label_ru: "",
  link_label_es: "",
  link_label_ar: "",
  is_active: true,
  sort_order: 0,
};

// Цвета и флаги для языковых вкладок
const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { code: "ru", label: "RU", flag: "🇷🇺", color: "bg-red-100 text-red-700 border-red-300" },
  { code: "es", label: "ES", flag: "🇪🇸", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { code: "ar", label: "AR", flag: "🇸🇦", color: "bg-green-100 text-green-700 border-green-300" },
];

// ─── КОМПОНЕНТ ──────────────────────────────────────────────────────────────

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Omit<Banner, "id" | "created_at">>(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "ru" | "es" | "ar">("en");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Загрузка баннеров из Supabase ──────────────────────────────────────
  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ── Открыть модал для создания ─────────────────────────────────────────
  const openCreate = () => {
    setEditingBanner(null);
    setFormData({ ...emptyBanner, sort_order: banners.length });
    setActiveTab("en");
    setModalOpen(true);
  };

  // ── Открыть модал для редактирования ──────────────────────────────────
  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    const { id, created_at, ...rest } = banner;
    setFormData(rest);
    setActiveTab("en");
    setModalOpen(true);
  };

  // ── Закрыть модал ──────────────────────────────────────────────────────
  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
    setFormData(emptyBanner);
  };

  // ── Обновить поле формы ────────────────────────────────────────────────
  const setField = (key: keyof typeof emptyBanner, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Сохранить (создать или обновить) ───────────────────────────────────
  const handleSave = async () => {
    if (!formData.text_en?.trim()) {
      toast({ title: "Заполните текст EN", description: "Английский текст обязателен", variant: "destructive" });
      setActiveTab("en");
      return;
    }

    setSaving(true);
    if (editingBanner) {
      // Обновляем существующий
      const { error } = await supabase
        .from("banners")
        .update(formData)
        .eq("id", editingBanner.id);

      if (error) {
        toast({ title: "Ошибка сохранения", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Баннер обновлён" });
        closeModal();
        fetchBanners();
      }
    } else {
      // Создаём новый
      const { error } = await supabase.from("banners").insert([formData]);
      if (error) {
        toast({ title: "Ошибка создания", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Баннер создан" });
        closeModal();
        fetchBanners();
      }
    }
    setSaving(false);
  };

  // ── Удалить баннер ─────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка удаления", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "🗑️ Баннер удалён" });
      fetchBanners();
    }
    setDeletingId(null);
  };

  // ── Переключить is_active прямо из списка ──────────────────────────────
  const handleToggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
      );
    }
  };

  // ── Изменить sort_order ────────────────────────────────────────────────
  const handleReorder = async (banner: Banner, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === banner.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;

    const swapBanner = banners[swapIdx];
    const newOrder = banner.sort_order;
    const swapOrder = swapBanner.sort_order;

    // Обновляем обе записи в Supabase
    await Promise.all([
      supabase.from("banners").update({ sort_order: swapOrder }).eq("id", banner.id),
      supabase.from("banners").update({ sort_order: newOrder }).eq("id", swapBanner.id),
    ]);

    fetchBanners();
  };

  // ─── РЕНДЕР ─────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Баннеры</h1>
          <p className="text-sm text-gray-500 mt-1">
            Управление информационными баннерами сайта
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить баннер
        </Button>
      </div>

      {/* Список баннеров */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Нет баннеров</p>
          <p className="text-sm mt-1">Нажмите «Добавить баннер», чтобы создать первый</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`rounded-xl border p-4 transition-all ${
                banner.is_active
                  ? "bg-white border-gray-200 shadow-sm"
                  : "bg-gray-50 border-dashed border-gray-300 opacity-70"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Кнопки перемещения */}
                <div className="flex flex-col gap-1 pt-1 shrink-0">
                  <button
                    onClick={() => handleReorder(banner, "up")}
                    disabled={idx === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-20 transition"
                    title="Переместить выше"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(banner, "down")}
                    disabled={idx === banners.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-20 transition"
                    title="Переместить ниже"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Контент баннера */}
                <div className="flex-1 min-w-0">
                  {/* Тексты на языках */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {LANGUAGES.map((lang) => {
                      const text = banner[`text_${lang.code}` as keyof Banner] as string;
                      return text ? (
                        <span
                          key={lang.code}
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${lang.color}`}
                        >
                          {lang.flag} {lang.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {/* Основной текст EN */}
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {banner.text_en || <span className="italic text-gray-400">Нет текста EN</span>}
                  </p>

                  {/* Ссылка */}
                  {banner.link && (
                    <p className="text-xs text-blue-500 mt-1 flex items-center gap-1 truncate">
                      <Link className="w-3 h-3 shrink-0" />
                      {banner.link}
                      {banner.link_label_en && (
                        <span className="text-gray-400">→ «{banner.link_label_en}»</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Правая часть: статус + кнопки */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* sort_order бейдж */}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {banner.sort_order}
                  </span>

                  {/* Переключатель активности */}
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={() => handleToggleActive(banner)}
                    />
                    <span className="text-xs text-gray-500">
                      {banner.is_active ? "Активен" : "Скрыт"}
                    </span>
                  </div>

                  {/* Редактировать */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(banner)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Удалить */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deletingId === banner.id}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── МОДАЛЬНОЕ ОКНО ФОРМЫ ─────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Редактировать баннер" : "Новый баннер"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">

            {/* ── ЯЗЫКОВЫЕ ВКЛАДКИ ── */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Текст баннера по языкам
              </Label>

              {/* Вкладки */}
              <div className="flex gap-2 mb-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveTab(lang.code as typeof activeTab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      activeTab === lang.code
                        ? lang.color + " shadow-sm"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {lang.flag} {lang.label}
                    {/* Зелёная точка если заполнено */}
                    {formData[`text_${lang.code}` as keyof typeof formData] && (
                      <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Поле текста для активного языка */}
              {LANGUAGES.map((lang) =>
                activeTab === lang.code ? (
                  <div key={lang.code}>
                    <Textarea
                      placeholder={`Текст баннера на ${lang.label}${lang.code === "en" ? " (обязательно)" : ""}`}
                      value={(formData[`text_${lang.code}` as keyof typeof formData] as string) || ""}
                      onChange={(e) => setField(`text_${lang.code}` as keyof typeof emptyBanner, e.target.value)}
                      className={`resize-none h-20 ${
                        lang.code === "en" && !formData.text_en?.trim()
                          ? "border-red-300 focus-visible:ring-red-400"
                          : ""
                      }`}
                      dir={lang.code === "ar" ? "rtl" : "ltr"}
                    />
                    {lang.code === "en" && !formData.text_en?.trim() && (
                      <p className="text-xs text-red-500 mt-1">Английский текст обязателен</p>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {/* ── ССЫЛКА ── */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" /> Ссылка (необязательно)
              </Label>
              <Input
                placeholder="https://example.com/page или /tours/world-nomad-games-2026"
                value={formData.link || ""}
                onChange={(e) => setField("link", e.target.value)}
              />
            </div>

            {/* ── ПОДПИСИ К ССЫЛКЕ ПО ЯЗЫКАМ ── */}
            {formData.link && (
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Текст кнопки/ссылки по языкам
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.code}>
                      <Label className={`text-xs mb-1 block px-2 py-0.5 rounded w-fit border ${lang.color}`}>
                        {lang.flag} {lang.label}
                      </Label>
                      <Input
                        placeholder={`Подпись на ${lang.label}`}
                        value={(formData[`link_label_${lang.code}` as keyof typeof formData] as string) || ""}
                        onChange={(e) =>
                          setField(`link_label_${lang.code}` as keyof typeof emptyBanner, e.target.value)
                        }
                        dir={lang.code === "ar" ? "rtl" : "ltr"}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── НАСТРОЙКИ ── */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              {/* is_active */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium">Активен</p>
                  <p className="text-xs text-gray-500">Показывать на сайте</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(val) => setField("is_active", val)}
                />
              </div>

              {/* sort_order */}
              <div className="p-3 rounded-lg bg-gray-50">
                <Label className="text-sm font-medium mb-1 block flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" /> Порядок сортировки
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.sort_order}
                  onChange={(e) => setField("sort_order", parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ── КНОПКИ ДЕЙСТВИЙ ── */}
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={closeModal} disabled={saving}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Сохраняем..." : editingBanner ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}