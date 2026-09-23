import { Reform } from "@lotus/front-global/minky/core";
import { Observable } from "rxjs";
import { ReformDataEditAction } from "./reform-data-edit-action";

export interface FormEditInstruction<INPUT = any, OUTPUT = any> { 
    form: Reform<INPUT>;
    extraActions?: ReformDataEditAction<INPUT>[];
    onValidationError: (form: Reform<INPUT>) => Observable<void> | Promise<void> | void;
    beforeValidation?: (form: Reform<INPUT>) => Observable<void> | Promise<void> | void;
    beforeSave?: (form: Reform<INPUT>) => Observable<boolean> | Promise<boolean> | boolean;
    saveMethod: (data: INPUT) => Observable<OUTPUT> | Promise<OUTPUT> | OUTPUT;
    afterSaveSuccess: (out: OUTPUT, data: INPUT) => Observable<void> | Promise<void> | void;
    afterSaveError: (error: any, data: INPUT) => Observable<void> | Promise<void> | void;
}