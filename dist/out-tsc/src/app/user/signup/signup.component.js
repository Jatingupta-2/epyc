import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
var SignupComponent = /** @class */ (function () {
    function SignupComponent(http) {
        this.http = http;
    }
    SignupComponent.prototype.ngOnInit = function () {
    };
    SignupComponent.prototype.loadStates = function () {
        this.http.get('../../../state-city.json');
    };
    SignupComponent = tslib_1.__decorate([
        Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], SignupComponent);
    return SignupComponent;
}());
export { SignupComponent };
//# sourceMappingURL=signup.component.js.map