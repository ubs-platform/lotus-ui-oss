import { Reform } from "@lotus/front-global/minky/core";
import { Observable } from "rxjs";

export interface FormEditInstruction<INPUT = any, OUTPUT = any> { 
    form: Reform<INPUT>;
    onValidationError: (form: Reform<INPUT>) => Observable<void> | Promise<void> | void;
    beforeSave: (form: Reform<INPUT>) => Observable<boolean> | Promise<boolean> | boolean;
    saveMethod: (data: INPUT) => Observable<OUTPUT> | Promise<OUTPUT> | OUTPUT;
    afterSaveSuccess: (out: OUTPUT, data: INPUT) => Observable<void> | Promise<void> | void;
    afterSaveError: (error: any, data: INPUT) => Observable<void> | Promise<void> | void;
}