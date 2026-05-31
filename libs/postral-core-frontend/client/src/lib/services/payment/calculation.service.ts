import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ItemListCalculationInputDto, ItemListCalculationDto } from "@tk-postral/payment-common";
import { Observable } from "rxjs";

@Injectable()
export class CalculationService {
    readonly baseUrl = '/service/payment/api/calculation';
    
    constructor(private http: HttpClient) { }

    calculateTotalAmount(body: ItemListCalculationInputDto): Observable<ItemListCalculationDto> {
        return this.http.post<ItemListCalculationDto>(this.baseUrl + '/total-amount', body);
    }
}