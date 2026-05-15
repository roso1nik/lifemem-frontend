import dayjs from "dayjs";
import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_BIRTHDAY_DEFAULT_FORMAT, DATE_TIME_DEFAULT_FORMAT } from "../config";

dayjs.locale("ru");
dayjs.extend(customParseFormat);

export const dayjsInstance = dayjs;

export const FORMAT_DATETIME = (dateISO: string): string => {
    return dayjs(dateISO).format(DATE_TIME_DEFAULT_FORMAT,);
};

export const BIRTHDAY_FORMAT = (dateISO: string): string => {
    return dayjs(dateISO).format(DATE_BIRTHDAY_DEFAULT_FORMAT);
};

