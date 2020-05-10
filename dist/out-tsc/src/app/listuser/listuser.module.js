import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
var ListuserModule = /** @class */ (function () {
    function ListuserModule() {
    }
    ListuserModule = tslib_1.__decorate([
        NgModule({
            declarations: [ViewComponent, EditComponent],
            imports: [
                CommonModule
            ]
        })
    ], ListuserModule);
    return ListuserModule;
}());
export { ListuserModule };
//# sourceMappingURL=listuser.module.js.map