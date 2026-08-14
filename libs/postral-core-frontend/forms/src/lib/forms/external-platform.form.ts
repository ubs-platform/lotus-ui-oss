import { minky, minkyRoot } from "@lotus/front-global/minky/core";
import { ExternalPlatformDTO } from "@tk-postral/payment-common";

@minkyRoot()
export class ExternalPlatformForm extends ExternalPlatformDTO {

    @minky({
        disable: true
    })
    override id: string = "";

    @minky({
        inputType: "checkbox",
        defaultValueConstructor: () => true
    })
    override active: boolean = true;

    @minky({
        inputType: "text",
        defaultValueConstructor: () => "",
        widthRatio: "50%"
    })
    override name: string = "";

    @minky({
        inputType: "text",
        defaultValueConstructor: () => "",
        widthRatio: "50%"
    })
    override code: string = "";

    @minky({
        disable: true
    })
    override createdAt?: Date | undefined;

    @minky({
        disable: true
    }) override updatedAt?: Date | undefined;



}