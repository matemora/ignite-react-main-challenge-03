import { format } from "date-fns";
import ptLocale from 'date-fns/locale/pt-BR';

export function formatDateString(date: string) {
  return format(new Date(date), "dd MMM yyyy", {locale: ptLocale});
}
