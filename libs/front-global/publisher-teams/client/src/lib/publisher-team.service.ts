import { HttpClient } from "@angular/common/http";
import { CrudBaseServiceGenerator } from "@lotus/front-global/front-bases"
import { environment } from "@lotus-web/environment";
import { Injectable } from "@angular/core";
import { EntityOwnershipGroupCommonDTO, EntityOwnershipGroupSearchDTO } from "@ubs-platform/users-common";
import { merge, mergeMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PublisherTeamService extends CrudBaseServiceGenerator<EntityOwnershipGroupCommonDTO, EntityOwnershipGroupCommonDTO, EntityOwnershipGroupSearchDTO>(`${environment.authUrl}entity-ownership-group`) {

    private _activeTeamId: string | null | undefined;

    /**
     *
     */
    constructor(override http: HttpClient) {
        super(http);

    }

    // Bir obje eklenirken veya güncellenirken, eğer yetkisi varsa takım seçip ona göre ekleme yapabilmesi için aktif takım bilgisini tutuyoruz. Bu bilgi, ekleme veya güncelleme işlemi sırasında backend'e gönderiliyor ve backend de bu bilgiye göre işlemi gerçekleştiriyor.
    setActiveTeam(teamId?: string) {
        this._activeTeamId = teamId;
    }

    getActiveTeamId() {
        return this._activeTeamId;
    }

    // Sadece güvenilir takımlar listelensin
    getEogTrustedStatus(eogId: string) {
        return this.http.get<boolean>(`${environment.examsServiceUrl}eog-book-trust/${eogId}`);
    }

    // Güvenilir takım olarak işaretle veya işareti kaldır. Sadece adminler yapabilir.
    setEogTrusted(eogId: string, isTrusted: boolean) {
        if (isTrusted) {
            return this.http.post(`${environment.examsServiceUrl}eog-book-trust/${eogId}`, {});
        } else {
            return this.http.delete(`${environment.examsServiceUrl}eog-book-trust/${eogId}`);
        }
    }
}