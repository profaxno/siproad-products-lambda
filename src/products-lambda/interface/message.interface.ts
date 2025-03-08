import { ProcessEnum, SourceEnum } from "../enums";

export interface Message {
    source  : SourceEnum;
    process : ProcessEnum;
    jsonData: string;
}