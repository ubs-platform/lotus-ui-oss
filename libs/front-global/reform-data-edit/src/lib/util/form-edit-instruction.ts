import { Reform } from "@lotus/front-global/minky/core";
import { Observable } from "rxjs";
import { ReformDataEditAction } from "./reform-data-edit-action";
import { TeamSelectionResult } from "@lotus/front-global/team-selection-dialog";

export interface FormEditTeamSelectionDialogOptions {
    title?: string;
    description?: string;
}

export interface FormEditInstruction<INPUT = any, OUTPUT = any> { 
    form: Reform<INPUT>;
    extraActions?: ReformDataEditAction<INPUT>[];
    onValidationError: (form: Reform<INPUT>) => Observable<void> | Promise<void> | void;
    beforeValidation?: (form: Reform<INPUT>) => Observable<void> | Promise<void> | void;
    beforeSave?: (form: Reform<INPUT>) => Observable<boolean> | Promise<boolean> | boolean;
    /**
     * Whether the team selection dialog should open before `saveMethod`.
     * Only effective when `onTeamSelected` is set; defaults to `true` in that case.
     */
    teamSelectionRequired?: boolean | ((data: INPUT) => boolean);
    teamSelectionDialog?: FormEditTeamSelectionDialogOptions;
    /**
     * Receives the team selection dialog result before `saveMethod` runs.
     * Mutate `data` or return a replacement. Cancelling the dialog aborts the save.
     */
    onTeamSelected?: (result: TeamSelectionResult, data: INPUT) => Observable<INPUT | void> | Promise<INPUT | void> | INPUT | void;
    saveMethod: (data: INPUT) => Observable<OUTPUT> | Promise<OUTPUT> | OUTPUT;
    afterSaveSuccess: (out: OUTPUT, data: INPUT) => Observable<void> | Promise<void> | void;
    afterSaveError: (error: any, data: INPUT) => Observable<void> | Promise<void> | void;
}