import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    content_cannot_be_empty: "Content cannot be empty.",
    diaryReflectionButtonText: "Reflect on the me from that day",
    placeholder1: "What’s on your mind now?",
    placeholder2: "Jot down your memories...",
    placeholder3: "Capture your day’s moments...",
    placeholder4: "Write your thoughts here...",
    placeholder5: "Start your diary entry now...",
    openCalendar: 'Open Calendar',
    alert_delete_message: "Are you sure you want to delete this?",
  },
  ja: {
    edit: "編集",
    delete: "削除",
    cancel: "キャンセル",
    save: "保存",
    content_cannot_be_empty: "内容が空です",
    diaryReflectionButtonText: "あの日の自分を振り返る",
    placeholder1: "今、どんなことを考えていますか？",
    placeholder2: "思い出を書きとめよう",
    placeholder3: "今日の出来事を残してみよう",
    placeholder4: "今の気持ちを書いてみよう",
    placeholder5: "日記を書きはじめよう",
    openCalendar: "カレンダーを開く",
    alert_delete_message: "本当に削除しますか？",
  },
});

export default i18n;
